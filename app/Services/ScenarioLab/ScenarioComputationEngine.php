<?php

namespace App\Services\ScenarioLab;

use App\Models\Assessment;
use App\Models\Major;
use App\Services\DecisionSupport\RecommendationEngine;
use Illuminate\Support\Facades\Cache;

class ScenarioComputationEngine
{
    public function __construct(
        private RecommendationEngine $recommendationEngine
    ) {}
    
    public function recalculateScenario(
        int $baselineAssessmentId,
        array $adjustments
    ): array {
        $cacheKey = "scenario_lab_{$baselineAssessmentId}_" . md5(json_encode($adjustments));
        
        return Cache::remember($cacheKey, 3600, function () use ($baselineAssessmentId, $adjustments) {
            return $this->performRecalculation($baselineAssessmentId, $adjustments);
        });
    }
    
    private function performRecalculation(int $baselineAssessmentId, array $adjustments): array
    {
        $startTime = microtime(true);
        
        // Load baseline assessment
        $baseline = Assessment::with(['recommendationResults.major'])->findOrFail($baselineAssessmentId);
        
        // Deep copy the original data
        $scenarioProfile = $this->applyPsychometricAdjustments(
            $baseline->psychometric_profile ?? [],
            $adjustments['psychometric'] ?? []
        );

        $scenarioBehavioralProfile = $this->applyBehavioralAdjustments(
            $baseline->behavioral_profile ?? [],
            $scenarioProfile
        );
        
        // Apply criteria weight adjustments
        $scenarioWeights = $this->applyWeightAdjustments(
            $baseline->criterion_weights ?? [],
            $adjustments['criteria_weights'] ?? []
        );
        
        // Apply life circumstance and future goal filters to majors
        $scenarioMajors = Major::all();
        $filteredMajorsCount = $scenarioMajors->count();
        
        // Recalculate recommendations using existing logic adapted for scenario parameters
        $newRecommendations = $this->recommendationEngine->generateRecommendations(
            $scenarioBehavioralProfile,
            $scenarioWeights,
            $baseline->criterion_order ?? array_keys($scenarioWeights),
            $scenarioMajors
        );
        
        $executionTime = round((microtime(true) - $startTime) * 1000, 2);
        
        $baselineRecs = array_slice($baseline->recommendationResults->toArray(), 0, 10);
        $scenarioRecs = array_slice($newRecommendations, 0, 10);

        return [
            'scenario_recommendations' => $scenarioRecs,
            'comparison' => $this->compareWithBaseline($baselineRecs, $scenarioRecs),
            'stability_metrics' => $this->calculateStabilityMetrics($baselineRecs, $scenarioRecs, $adjustments),
            'execution_time_ms' => $executionTime,
            'adjustments_applied' => $adjustments,
            'timestamp' => now()->toIso8601String()
        ];
    }
    
    private function applyPsychometricAdjustments(array $baseProfile, array $adjustments): array
    {
        $scenarioProfile = $baseProfile;
        
        // Merge shallow nested values (like RIASEC)
        foreach ($adjustments as $key => $value) {
            if (is_array($value) && isset($scenarioProfile[$key])) {
                $scenarioProfile[$key] = array_merge($scenarioProfile[$key], $value);
            } else {
                $scenarioProfile[$key] = $value;
            }
        }
        
        return $scenarioProfile;
    }

    private function applyBehavioralAdjustments(array $baseBehavioral, array $psychometric): array
    {
        // Translate scenario psychometric to behavioral factors. This mimics RecommendationEngine::processPsychometricData
        $b = $baseBehavioral;

        if (isset($psychometric['riasec']['scores'])) {
            $si = $psychometric['riasec']['scores'];
            $b['minat_stem'] = max($si['R'] ?? 0, $si['I'] ?? 0);
            $b['minat_seni'] = max($si['A'] ?? 0, $si['S'] ?? 0);
            $b['minat_sosial'] = max($si['S'] ?? 0, $si['E'] ?? 0);
            $b['minat_manajemen'] = max($si['E'] ?? 0, $si['C'] ?? 0);
        }

        if (isset($psychometric['grit'])) {
            $b['daya_juang'] = $psychometric['grit']['total_score'] ?? 50;
        }

        if (isset($psychometric['logic'])) {
            $b['logika_matematika'] = $psychometric['logic']['score'] ?? 50;
            $b['kemampuan_analitis'] = $psychometric['logic']['score'] ?? 50;
        }

        return $b;
    }
    
    private function applyWeightAdjustments(array $baseWeights, array $adjustments): array
    {
        if (empty($adjustments)) {
            return $baseWeights;
        }
        
        $scenarioWeights = array_merge($baseWeights, $adjustments);
        
        // Normalize to ensure sum = 1
        $sum = array_sum($scenarioWeights);
        if ($sum > 0) {
            foreach ($scenarioWeights as $key => $weight) {
                $scenarioWeights[$key] = $weight / $sum;
            }
        }
        
        return $scenarioWeights;
    }
    
    private function compareWithBaseline(array $baseline, array $scenario): array
    {
        $baselineTop3 = array_slice($baseline, 0, 3);
        $scenarioTop3 = array_slice($scenario, 0, 3);
        
        $comparison = [
            'rank_changes' => [],
            'new_entries' => [],
            'dropped_out' => [],
            'rank_reversal_detected' => false
        ];
        
        // Detect rank changes
        foreach ($baselineTop3 as $baseRec) {
            $scenarioRec = collect($scenario)->firstWhere('major_id', $baseRec['major_id'] ?? $baseRec['major']['id']);
            
            if ($scenarioRec) {
                $rankChange = $baseRec['rank'] - $scenarioRec['rank'];
                $scoreChange = $scenarioRec['final_score'] - $baseRec['final_score'];
                
                if ($rankChange != 0) {
                    $comparison['rank_changes'][] = [
                        'major_id' => $baseRec['major_id'] ?? $baseRec['major']['id'],
                        'major_name' => $baseRec['major']['name'],
                        'baseline_rank' => $baseRec['rank'],
                        'scenario_rank' => $scenarioRec['rank'],
                        'rank_change' => $rankChange,
                        'score_change' => round($scoreChange, 4)
                    ];
                    
                    if ($baseRec['rank'] === 1 && $scenarioRec['rank'] > 1) {
                        $comparison['rank_reversal_detected'] = true;
                    }
                }
            } else {
                $comparison['dropped_out'][] = [
                    'major_id' => $baseRec['major_id'] ?? $baseRec['major']['id'],
                    'major_name' => $baseRec['major']['name'],
                    'baseline_rank' => $baseRec['rank']
                ];
            }
        }
        
        // Detect new entries in top 3
        foreach ($scenarioTop3 as $scenRec) {
            $inBaseline = collect($baselineTop3)->contains(fn ($base) => ($base['major_id'] ?? $base['major']['id']) === ($scenRec['major_id'] ?? $scenRec['major']['id']));
            
            if (!$inBaseline) {
                $comparison['new_entries'][] = [
                    'major_id' => $scenRec['major_id'] ?? $scenRec['major']['id'],
                    'major_name' => $scenRec['major']['name'],
                    'scenario_rank' => $scenRec['rank'],
                    'final_score' => round($scenRec['final_score'], 4)
                ];
            }
        }
        
        return $comparison;
    }
    
    private function calculateStabilityMetrics(array $baseline, array $scenario, array $adjustments): array
    {
        $kendallTau = $this->calculateKendallTau($baseline, $scenario);
        $spearmanRho = $this->calculateSpearmanRho($baseline, $scenario);
        
        $stabilityScore = ($kendallTau + $spearmanRho) / 2 * 100;
        
        return [
            'stability_score' => round(max(0, min(100, $stabilityScore)), 1),
            'kendall_tau' => round($kendallTau, 3),
            'spearman_rho' => round($spearmanRho, 3)
        ];
    }
    
    private function calculateKendallTau(array $baseline, array $scenario): float
    {
        $n = min(count($baseline), count($scenario));
        if ($n < 2) return 1.0;
        
        $concordant = 0;
        $discordant = 0;
        
        for ($i = 0; $i < $n - 1; $i++) {
            for ($j = $i + 1; $j < $n; $j++) {
                $baseI = $baseline[$i]['major_id'] ?? $baseline[$i]['major']['id'];
                $baseJ = $baseline[$j]['major_id'] ?? $baseline[$j]['major']['id'];
                
                $scenI_rank = collect($scenario)->firstWhere('major_id', $baseI)['rank'] ?? 999;
                $scenJ_rank = collect($scenario)->firstWhere('major_id', $baseJ)['rank'] ?? 999;
                
                $baselineOrder = $baseline[$i]['rank'] < $baseline[$j]['rank'];
                $scenarioOrder = $scenI_rank < $scenJ_rank;
                
                if ($baselineOrder === $scenarioOrder) $concordant++;
                else $discordant++;
            }
        }
        
        $totalPairs = ($n * ($n - 1)) / 2;
        return ($concordant - $discordant) / max(1, $totalPairs);
    }

    private function calculateSpearmanRho(array $baseline, array $scenario): float
    {
        $n = min(count($baseline), count($scenario));
        if ($n < 2) return 1.0;

        $sumDSquared = 0;
        foreach ($baseline as $baseRec) {
            $baseId = $baseRec['major_id'] ?? $baseRec['major']['id'];
            $scenRec = collect($scenario)->firstWhere('major_id', $baseId);
            
            $scenRank = $scenRec ? $scenRec['rank'] : $n + 1;
            $d = $baseRec['rank'] - $scenRank;
            $sumDSquared += ($d * $d);
        }

        return 1 - ((6 * $sumDSquared) / max(1, ($n * ($n * $n - 1))));
    }
}
