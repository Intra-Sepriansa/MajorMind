<?php

namespace App\Services\Comparison;

use App\Models\Criterion;
use App\Models\Major;
use App\Services\DecisionSupport\ProfileMatchingService;
use App\Services\DecisionSupport\SawService;
use App\Services\DecisionSupport\TopsisService;

class AlgorithmBreakdownAnalyzer
{
    public function __construct(
        private TopsisService $topsisService,
        private SawService $sawService,
        private ProfileMatchingService $profileMatchingService,
    ) {}

    /**
     * Run each algorithm independently and compare per-major rankings.
     */
    public function analyzeAlgorithmicDifferences(
        array $majorIds,
        array $userBehavioral,
        array $criterionWeights
    ): array {
        $majors = Major::query()->whereIn('id', $majorIds)->get();

        $alternatives = $majors->map(fn (Major $m) => [
            'id' => $m->id,
            'name' => $m->name,
            'slug' => $m->slug,
            'scores' => $m->criteria_scores,
            'behavioral_profile' => $m->behavioral_profile ?? [],
        ])->all();

        $criteria = Criterion::query()->active()->orderBy('display_order')->get();
        $criteriaForRanking = $criteria->map(fn (Criterion $c) => [
            'slug' => $c->slug,
            'type' => $c->type,
        ])->all();

        // --- Run algorithms ---
        $topsisResults = $this->topsisService->rank($alternatives, $criteriaForRanking, $criterionWeights);
        $sawResults = $this->sawService->rank($alternatives, $criteriaForRanking, $criterionWeights);

        // Build lookup: majorId => rank/score
        $topsisLookup = $this->buildLookup($topsisResults, 'preference');
        $sawLookup = $this->buildLookup($sawResults, 'saw_score');

        // Profile Matching per major
        $pmLookup = [];
        foreach ($alternatives as $alt) {
            $pmResult = $this->profileMatchingService->calculate(
                $userBehavioral,
                $alt['behavioral_profile'],
                $alt['slug'],
            );
            $pmLookup[$alt['id']] = $pmResult['score'];
        }
        // Rank PM by score desc
        arsort($pmLookup);
        $pmRanked = [];
        $rank = 1;
        foreach ($pmLookup as $id => $score) {
            $pmRanked[$id] = ['rank' => $rank++, 'score' => round($score, 4)];
        }

        // --- Build breakdown ---
        $breakdown = [];
        foreach ($majors as $major) {
            $mid = $major->id;
            $ranks = [
                'topsis' => $topsisLookup[$mid]['rank'] ?? 999,
                'saw' => $sawLookup[$mid]['rank'] ?? 999,
                'profile_matching' => $pmRanked[$mid]['rank'] ?? 999,
            ];

            $scores = [
                'topsis' => round($topsisLookup[$mid]['score'] ?? 0, 4),
                'saw' => round($sawLookup[$mid]['score'] ?? 0, 4),
                'profile_matching' => round($pmRanked[$mid]['score'] ?? 0, 4),
            ];

            $rankValues = array_values($ranks);
            $variance = $this->calculateVariance($rankValues);

            $breakdown[$mid] = [
                'major_name' => $major->name,
                'algorithm_ranks' => $ranks,
                'algorithm_scores' => $scores,
                'consensus_score' => round($this->calculateConsensusScore($rankValues), 1),
                'disagreement_level' => $this->getDisagreementLevel($variance),
                'rank_variance' => round($variance, 2),
            ];
        }

        return [
            'breakdown' => $breakdown,
            'algorithm_weights' => [
                'topsis' => 0.40,
                'profile_matching' => 0.30,
                'saw' => 0.30,
            ],
            'consensus_analysis' => $this->analyzeOverallConsensus($breakdown),
        ];
    }

    private function buildLookup(array $results, string $scoreKey): array
    {
        $lookup = [];
        foreach ($results as $result) {
            $id = $result['alternative']['id'];
            $lookup[$id] = [
                'rank' => $result['rank'],
                'score' => $result[$scoreKey] ?? 0,
            ];
        }
        return $lookup;
    }

    private function calculateVariance(array $values): float
    {
        $n = count($values);
        if ($n < 2) return 0;

        $mean = array_sum($values) / $n;
        $sumSquares = 0;
        foreach ($values as $v) {
            $sumSquares += ($v - $mean) ** 2;
        }
        return $sumSquares / $n;
    }

    private function calculateConsensusScore(array $ranks): float
    {
        $variance = $this->calculateVariance($ranks);
        $maxVariance = count($ranks) ** 2;
        return (1 - ($variance / max(1, $maxVariance))) * 100;
    }

    private function getDisagreementLevel(float $variance): string
    {
        if ($variance < 0.5) return 'Very Low';
        if ($variance < 2) return 'Low';
        if ($variance < 5) return 'Moderate';
        if ($variance < 10) return 'High';
        return 'Very High';
    }

    private function analyzeOverallConsensus(array $breakdown): array
    {
        $scores = array_column($breakdown, 'consensus_score');
        $avg = count($scores) > 0 ? array_sum($scores) / count($scores) : 0;

        return [
            'average_consensus' => round($avg, 1),
            'min_consensus' => round(min($scores ?: [0]), 1),
            'max_consensus' => round(max($scores ?: [0]), 1),
            'interpretation' => $avg >= 85
                ? 'Strong agreement across algorithms — recommendations highly reliable.'
                : ($avg >= 65
                    ? 'General agreement with minor discrepancies between methods.'
                    : 'Significant disagreement — consider trade-offs carefully.'),
        ];
    }
}
