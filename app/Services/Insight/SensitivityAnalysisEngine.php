<?php

namespace App\Services\Insight;

use App\Models\Assessment;
use App\Models\Criterion;
use App\Models\Major;
use App\Services\DecisionSupport\TopsisService;
use App\Services\DecisionSupport\ProfileMatchingService;

class SensitivityAnalysisEngine
{
    public function __construct(
        private readonly TopsisService $topsisService,
        private readonly ProfileMatchingService $profileMatchingService,
    ) {}

    public function analyze(int $assessmentId): array
    {
        $assessment = Assessment::with('recommendationResults.major')->findOrFail($assessmentId);
        $criterionWeights = $assessment->criterion_weights;
        $criterionOrder = $assessment->criterion_order;
        $behavioralProfile = $assessment->behavioral_profile;

        // Weight sensitivity test
        $weightSensitivity = $this->testWeightSensitivity($assessment, $criterionWeights, $criterionOrder, $behavioralProfile);

        // Behavioral sensitivity test
        $behavioralSensitivity = $this->testBehavioralSensitivity($assessment, $criterionWeights, $criterionOrder, $behavioralProfile);

        // Overall robustness score
        $robustness = $this->computeRobustness($weightSensitivity, $behavioralSensitivity);

        // Critical thresholds
        $criticalThresholds = $this->identifyCriticalThresholds($weightSensitivity);

        return [
            'weight_sensitivity' => $weightSensitivity,
            'behavioral_sensitivity' => $behavioralSensitivity,
            'robustness' => $robustness,
            'critical_thresholds' => $criticalThresholds,
        ];
    }

    private function testWeightSensitivity(
        Assessment $assessment,
        array $baseWeights,
        array $criterionOrder,
        array $behavioralProfile,
    ): array {
        $criteria = Criterion::query()->active()->orderBy('display_order')->get();
        $majors = Major::query()->active()->orderBy('name')->get();

        $criteriaArray = $criteria->map(fn (Criterion $c) => [
            'slug' => $c->slug,
            'type' => $c->type,
        ])->all();

        $alternatives = $majors->map(fn (Major $m) => [
            'id' => $m->id,
            'name' => $m->name,
            'slug' => $m->slug,
            'scores' => $m->criteria_scores,
            'behavioral_profile' => $m->behavioral_profile ?? [],
        ])->all();

        // Get baseline top 3
        $baselineRanking = $this->computeFullRanking($alternatives, $criteriaArray, $baseWeights, $behavioralProfile);
        $baselineTop3 = array_slice(array_column($baselineRanking, 'id'), 0, 3);

        $results = [];

        foreach ($criterionOrder as $criterion) {
            $scenarios = [];

            foreach ([-20, -10, -5, 5, 10, 20] as $deltaPct) {
                $modified = $this->perturbWeight($baseWeights, $criterion, $deltaPct);
                $ranking = $this->computeFullRanking($alternatives, $criteriaArray, $modified, $behavioralProfile);
                $newTop3 = array_slice(array_column($ranking, 'id'), 0, 3);

                $reversal = $baselineTop3[0] !== $newTop3[0];
                $top3Changed = $baselineTop3 !== $newTop3;

                $scenarios[] = [
                    'delta' => $deltaPct,
                    'new_top' => $ranking[0]['name'] ?? 'Unknown',
                    'rank_reversal' => $reversal,
                    'top3_changed' => $top3Changed,
                ];
            }

            $reversalCount = count(array_filter($scenarios, fn ($s) => $s['rank_reversal']));
            $stability = round(max(0, 100 - ($reversalCount * 16.7)), 1);

            $results[] = [
                'criterion' => $criterion,
                'scenarios' => $scenarios,
                'stability_score' => $stability,
                'reversals' => $reversalCount,
                'critical' => $reversalCount >= 2,
            ];
        }

        usort($results, fn ($a, $b) => $a['stability_score'] <=> $b['stability_score']);

        return $results;
    }

    private function testBehavioralSensitivity(
        Assessment $assessment,
        array $criterionWeights,
        array $criterionOrder,
        array $baseBehavioral,
    ): array {
        $criteria = Criterion::query()->active()->orderBy('display_order')->get();
        $majors = Major::query()->active()->orderBy('name')->get();

        $criteriaArray = $criteria->map(fn (Criterion $c) => [
            'slug' => $c->slug,
            'type' => $c->type,
        ])->all();

        $alternatives = $majors->map(fn (Major $m) => [
            'id' => $m->id,
            'name' => $m->name,
            'slug' => $m->slug,
            'scores' => $m->criteria_scores,
            'behavioral_profile' => $m->behavioral_profile ?? [],
        ])->all();

        $baselineRanking = $this->computeFullRanking($alternatives, $criteriaArray, $criterionWeights, $baseBehavioral);
        $baselineTop = $baselineRanking[0]['id'] ?? null;

        $results = [];

        foreach ($baseBehavioral as $dim => $value) {
            $scenarios = [];

            foreach ([-15, -10, -5, 5, 10, 15] as $delta) {
                $modified = $baseBehavioral;
                $modified[$dim] = max(0, min(100, $value + $delta));

                $ranking = $this->computeFullRanking($alternatives, $criteriaArray, $criterionWeights, $modified);
                $newTop = $ranking[0]['id'] ?? null;

                $scenarios[] = [
                    'delta' => $delta,
                    'new_value' => $modified[$dim],
                    'new_top' => $ranking[0]['name'] ?? 'Unknown',
                    'reversal' => $baselineTop !== $newTop,
                ];
            }

            $reversalCount = count(array_filter($scenarios, fn ($s) => $s['reversal']));

            $results[] = [
                'dimension' => $dim,
                'base_value' => $value,
                'scenarios' => $scenarios,
                'reversals' => $reversalCount,
                'stability_score' => round(max(0, 100 - ($reversalCount * 16.7)), 1),
            ];
        }

        return $results;
    }

    private function perturbWeight(array $weights, string $criterion, int $deltaPct): array
    {
        $modified = $weights;
        $original = $modified[$criterion] ?? 0;
        $delta = $original * ($deltaPct / 100);
        $modified[$criterion] = max(0.01, $original + $delta);

        // Renormalize
        $total = array_sum($modified);
        foreach ($modified as $k => $v) {
            $modified[$k] = $v / $total;
        }

        return $modified;
    }

    private function computeFullRanking(array $alternatives, array $criteria, array $weights, array $behavioral): array
    {
        $topsisResults = $this->topsisService->rank($alternatives, $criteria, $weights);
        $results = [];

        foreach ($topsisResults as $r) {
            $alt = $r['alternative'];
            $pm = $this->profileMatchingService->calculate(
                $behavioral,
                $alt['behavioral_profile'],
                $alt['slug'],
            );

            $final = ($r['preference'] * 0.70) + ($pm['score'] * 0.30);

            $results[] = [
                'id' => $alt['id'],
                'name' => $alt['name'],
                'final' => round($final, 6),
            ];
        }

        usort($results, fn ($a, $b) => $b['final'] <=> $a['final']);

        return $results;
    }

    private function computeRobustness(array $weightSens, array $behavioralSens): array
    {
        $weightScores = array_column($weightSens, 'stability_score');
        $behavioralScores = array_column($behavioralSens, 'stability_score');

        $allScores = array_merge($weightScores, $behavioralScores);
        $overall = count($allScores) > 0 ? round(array_sum($allScores) / count($allScores), 1) : 0;

        $level = $overall >= 80 ? 'Robust' : ($overall >= 60 ? 'Moderately Stable' : 'Sensitive');

        return [
            'overall_score' => $overall,
            'level' => $level,
            'color' => $overall >= 80 ? 'emerald' : ($overall >= 60 ? 'amber' : 'rose'),
            'weight_avg' => count($weightScores) > 0 ? round(array_sum($weightScores) / count($weightScores), 1) : 0,
            'behavioral_avg' => count($behavioralScores) > 0 ? round(array_sum($behavioralScores) / count($behavioralScores), 1) : 0,
            'interpretation' => $overall >= 80
                ? 'Rekomendasi sangat robust — perubahan parameter moderat tidak mengubah posisi #1.'
                : ($overall >= 60
                    ? 'Rekomendasi cukup stabil — hanya perubahan besar yang dapat menggeser ranking.'
                    : 'Rekomendasi sensitif — pertimbangkan hasil ini dengan hati-hati karena ranking mudah berubah.'),
        ];
    }

    private function identifyCriticalThresholds(array $weightSensitivity): array
    {
        $thresholds = [];

        foreach ($weightSensitivity as $criterion) {
            if ($criterion['critical']) {
                // Find smallest delta that causes reversal
                $minReversal = null;
                foreach ($criterion['scenarios'] as $s) {
                    if ($s['rank_reversal'] && ($minReversal === null || abs($s['delta']) < abs($minReversal))) {
                        $minReversal = $s['delta'];
                    }
                }

                $thresholds[] = [
                    'criterion' => $criterion['criterion'],
                    'min_reversal_delta' => $minReversal,
                    'warning' => "Perubahan bobot {$criterion['criterion']} sebesar {$minReversal}% sudah cukup untuk menggeser posisi #1.",
                ];
            }
        }

        return $thresholds;
    }
}
