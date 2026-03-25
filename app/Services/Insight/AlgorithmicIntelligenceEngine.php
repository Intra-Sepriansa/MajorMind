<?php

namespace App\Services\Insight;

use App\Models\Assessment;
use App\Models\Criterion;
use App\Models\Major;
use App\Services\DecisionSupport\ProfileMatchingService;
use App\Services\DecisionSupport\SawService;
use App\Services\DecisionSupport\TopsisService;

class AlgorithmicIntelligenceEngine
{
    public function __construct(
        private readonly TopsisService $topsisService,
        private readonly SawService $sawService,
        private readonly ProfileMatchingService $profileMatchingService,
    ) {}

    public function analyze(int $assessmentId): array
    {
        $assessment = Assessment::with('recommendationResults.major')->findOrFail($assessmentId);
        $criterionWeights = $assessment->criterion_weights;
        $criterionOrder = $assessment->criterion_order;
        $behavioralProfile = $assessment->behavioral_profile;

        $criteria = Criterion::query()->active()->orderBy('display_order')->get();
        $majors = Major::query()->active()->orderBy('name')->get();

        $criteriaArray = $criteria->map(fn (Criterion $c): array => [
            'slug' => $c->slug,
            'type' => $c->type,
        ])->all();

        $alternatives = $majors->map(fn (Major $m): array => [
            'id' => $m->id,
            'name' => $m->name,
            'slug' => $m->slug,
            'scores' => $m->criteria_scores,
            'behavioral_profile' => $m->behavioral_profile ?? [],
        ])->all();

        // Run each algorithm independently
        $topsisResults = $this->topsisService->rank($alternatives, $criteriaArray, $criterionWeights);
        $sawResults = $this->sawService->rank($alternatives, $criteriaArray, $criterionWeights);

        // Build algorithm results lookup
        $algorithmRanks = [];

        foreach ($topsisResults as $r) {
            $id = $r['alternative']['id'];
            $algorithmRanks[$id]['topsis'] = [
                'rank' => $r['rank'],
                'score' => round($r['preference'], 4),
                'name' => $r['alternative']['name'],
            ];
        }

        foreach ($sawResults as $r) {
            $id = $r['alternative']['id'];
            $algorithmRanks[$id]['saw'] = [
                'rank' => $r['rank'],
                'score' => round($r['saw_score'], 4),
                'name' => $r['alternative']['name'],
            ];
        }

        // Profile Matching rankings
        $pmResults = [];
        foreach ($alternatives as $alt) {
            $pm = $this->profileMatchingService->calculate(
                $behavioralProfile,
                $alt['behavioral_profile'],
                $alt['slug'],
            );
            $pmResults[] = [
                'id' => $alt['id'],
                'name' => $alt['name'],
                'score' => $pm['score'],
            ];
        }
        usort($pmResults, fn ($a, $b) => $b['score'] <=> $a['score']);
        foreach ($pmResults as $i => $pm) {
            $algorithmRanks[$pm['id']]['profile_matching'] = [
                'rank' => $i + 1,
                'score' => round($pm['score'], 4),
                'name' => $pm['name'],
            ];
        }

        // Consensus analysis
        $consensus = $this->buildConsensus($algorithmRanks);

        // Hybrid decomposition from stored results
        $decomposition = $this->decomposeHybrid($assessment);

        // Rank stability
        $stability = $this->computeStability($algorithmRanks);

        return [
            'consensus' => $consensus,
            'decomposition' => $decomposition,
            'stability' => $stability,
        ];
    }

    private function buildConsensus(array $algorithmRanks): array
    {
        $perMajor = [];
        $algorithms = ['topsis', 'saw', 'profile_matching'];

        foreach ($algorithmRanks as $majorId => $algos) {
            $ranks = [];
            $scores = [];

            foreach ($algorithms as $algo) {
                if (isset($algos[$algo])) {
                    $ranks[$algo] = $algos[$algo]['rank'];
                    $scores[$algo] = $algos[$algo]['score'];
                }
            }

            if (count($ranks) < 2) {
                continue;
            }

            $rankValues = array_values($ranks);
            $mean = array_sum($rankValues) / count($rankValues);
            $variance = 0;
            foreach ($rankValues as $r) {
                $variance += ($r - $mean) ** 2;
            }
            $variance /= count($rankValues);

            $maxRank = max($rankValues);
            $minRank = min($rankValues);
            $spread = $maxRank - $minRank;

            $agreementScore = max(0, 100 - ($variance * 3) - ($spread * 5));

            $perMajor[] = [
                'major_id' => $majorId,
                'major_name' => $algos['topsis']['name'] ?? $algos['saw']['name'] ?? 'Unknown',
                'ranks' => $ranks,
                'scores' => $scores,
                'rank_variance' => round($variance, 2),
                'rank_spread' => $spread,
                'agreement_score' => round(min(100, $agreementScore), 1),
                'consensus_level' => $this->consensusLevel($agreementScore),
            ];
        }

        usort($perMajor, fn ($a, $b) => $b['agreement_score'] <=> $a['agreement_score']);

        $overall = count($perMajor) > 0
            ? round(array_sum(array_column($perMajor, 'agreement_score')) / count($perMajor), 1)
            : 0;

        return [
            'per_major' => array_slice($perMajor, 0, 15),
            'overall_score' => $overall,
            'overall_level' => $this->consensusLevel($overall),
        ];
    }

    private function consensusLevel(float $score): array
    {
        if ($score >= 85) {
            return ['level' => 'Strong', 'color' => 'emerald', 'icon' => '🟢'];
        }
        if ($score >= 65) {
            return ['level' => 'Moderate', 'color' => 'blue', 'icon' => '🔵'];
        }
        if ($score >= 45) {
            return ['level' => 'Weak', 'color' => 'amber', 'icon' => '🟡'];
        }

        return ['level' => 'Divergent', 'color' => 'rose', 'icon' => '🔴'];
    }

    private function decomposeHybrid(Assessment $assessment): array
    {
        $results = $assessment->recommendationResults->take(10);
        $decomposition = [];

        foreach ($results as $rec) {
            $topsisContrib = round($rec->topsis_score * 0.70, 4);
            $behavioralContrib = round($rec->behavioral_score * 0.30, 4);
            $final = (float) $rec->final_score;

            $decomposition[] = [
                'major_id' => $rec->major_id,
                'major_name' => $rec->major->name ?? 'Unknown',
                'rank' => $rec->rank,
                'final_score' => round($final, 4),
                'contributions' => [
                    'topsis' => [
                        'raw' => round((float) $rec->topsis_score, 4),
                        'weight' => 0.70,
                        'contribution' => $topsisContrib,
                        'percentage' => $final > 0 ? round(($topsisContrib / $final) * 100, 1) : 0,
                    ],
                    'profile_matching' => [
                        'raw' => round((float) $rec->behavioral_score, 4),
                        'weight' => 0.30,
                        'contribution' => $behavioralContrib,
                        'percentage' => $final > 0 ? round(($behavioralContrib / $final) * 100, 1) : 0,
                    ],
                ],
                'dominant' => $topsisContrib >= $behavioralContrib ? 'topsis' : 'profile_matching',
                'saw_rank' => $rec->meta['saw_verification']['saw_rank'] ?? null,
                'saw_score' => $rec->meta['saw_verification']['saw_score'] ?? null,
            ];
        }

        return $decomposition;
    }

    private function computeStability(array $algorithmRanks): array
    {
        $stable = [];
        $volatile = [];
        $algorithms = ['topsis', 'saw', 'profile_matching'];

        foreach ($algorithmRanks as $majorId => $algos) {
            $ranks = [];
            foreach ($algorithms as $algo) {
                if (isset($algos[$algo])) {
                    $ranks[] = $algos[$algo]['rank'];
                }
            }
            if (count($ranks) < 2) continue;

            $mean = array_sum($ranks) / count($ranks);
            $variance = 0;
            foreach ($ranks as $r) {
                $variance += ($r - $mean) ** 2;
            }
            $variance /= count($ranks);
            $stabilityScore = round(max(0, 100 - $variance * 5), 1);

            $entry = [
                'major_id' => $majorId,
                'major_name' => $algos['topsis']['name'] ?? $algos['saw']['name'] ?? 'Unknown',
                'avg_rank' => round($mean, 1),
                'rank_variance' => round($variance, 2),
                'stability_score' => $stabilityScore,
            ];

            if ($variance < 4) {
                $stable[] = $entry;
            } else {
                $volatile[] = $entry;
            }
        }

        usort($stable, fn ($a, $b) => $b['stability_score'] <=> $a['stability_score']);
        usort($volatile, fn ($a, $b) => $a['stability_score'] <=> $b['stability_score']);

        $allScores = array_merge(
            array_column($stable, 'stability_score'),
            array_column($volatile, 'stability_score'),
        );
        $overallStability = count($allScores) > 0
            ? round(array_sum($allScores) / count($allScores), 1)
            : 0;

        return [
            'stable' => array_slice($stable, 0, 5),
            'volatile' => array_slice($volatile, 0, 5),
            'overall_score' => $overallStability,
        ];
    }
}
