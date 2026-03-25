<?php

namespace App\Services\ScenarioLab;

class SensitivityAnalyzer
{
    public function __construct(
        private ScenarioComputationEngine $computationEngine
    ) {}

    public function generateSensitivityHeatmap(
        int $assessmentId,
        array $currentAdjustments,
        array $ranges
    ): array {
        $heatmapData = [];
        
        foreach ($ranges as $param => $rangeConfig) {
            $paramResults = [];
            
            $min = $rangeConfig['min'];
            $max = $rangeConfig['max'];
            $steps = $rangeConfig['steps'] ?? 10;
            $stepSize = ($max - $min) / max(1, $steps);
            
            for ($i = 0; $i <= $steps; $i++) {
                $value = $min + ($i * $stepSize);
                
                // Construct temporary adjustments with just this parameter changed
                $testAdjustments = $currentAdjustments;
                
                if (str_contains($param, 'riasec.') || str_contains($param, 'logic.') || str_contains($param, 'grit.')) {
                    $parts = explode('.', $param);
                    $testAdjustments['psychometric'][$parts[0]][$parts[1]] = $value;
                } else {
                    $testAdjustments['criteria_weights'][$param] = $value;
                }
                
                $result = $this->computationEngine->recalculateScenario($assessmentId, $testAdjustments);
                
                $paramResults[] = [
                    'value' => round($value, 2),
                    'top_major_id' => $result['scenario_recommendations'][0]['major']['id'],
                    'top_major_name' => $result['scenario_recommendations'][0]['major']['name'],
                    'top_score' => $result['scenario_recommendations'][0]['final_score']
                ];
            }
            
            $heatmapData[$param] = [
                'results' => $paramResults,
                'critical_points' => $this->findCriticalPoints($paramResults),
                'sensitivity_score' => $this->calculateSensitivityScore($paramResults)
            ];
        }
        
        return [
            'heatmap_data' => $heatmapData,
            'most_sensitive_parameter' => $this->findMostSensitiveParameter($heatmapData),
            'least_sensitive_parameter' => $this->findLeastSensitiveParameter($heatmapData),
            'overall_stability' => $this->calculateOverallStability($heatmapData)
        ];
    }
    
    private function findCriticalPoints(array $results): array
    {
        $criticalPoints = [];
        $previousMajor = null;
        
        foreach ($results as $result) {
            if ($previousMajor && $result['top_major_id'] !== $previousMajor) {
                $criticalPoints[] = [
                    'threshold_value' => $result['value'],
                    'from_major' => collect($results)->firstWhere('top_major_id', $previousMajor)['top_major_name'] ?? 'N/A',
                    'to_major' => $result['top_major_name'],
                    'type' => 'rank_reversal'
                ];
            }
            $previousMajor = $result['top_major_id'];
        }
        
        return $criticalPoints;
    }
    
    private function calculateSensitivityScore(array $results): float
    {
        $changes = 0;
        $previousMajor = null;
        
        foreach ($results as $result) {
            if ($previousMajor && $result['top_major_id'] !== $previousMajor) {
                $changes++;
            }
            $previousMajor = $result['top_major_id'];
        }
        
        return ($changes / max(1, count($results) - 1)) * 100;
    }

    private function findMostSensitiveParameter(array $heatmapData): array
    {
        $maxParam = '';
        $maxScore = -1;

        foreach ($heatmapData as $param => $data) {
            if ($data['sensitivity_score'] > $maxScore) {
                $maxScore = $data['sensitivity_score'];
                $maxParam = $param;
            }
        }

        return ['name' => str_replace(['_', '.'], ' ', $maxParam), 'sensitivity_score' => $maxScore];
    }

    private function findLeastSensitiveParameter(array $heatmapData): array
    {
        $minParam = '';
        $minScore = 999;

        foreach ($heatmapData as $param => $data) {
            if ($data['sensitivity_score'] < $minScore) {
                $minScore = $data['sensitivity_score'];
                $minParam = $param;
            }
        }

        return ['name' => str_replace(['_', '.'], ' ', $minParam), 'sensitivity_score' => $minScore === 999 ? 0 : $minScore];
    }

    private function calculateOverallStability(array $heatmapData): float
    {
        if (empty($heatmapData)) return 100.0;

        $sumScore = 0;
        foreach ($heatmapData as $data) {
            $sumScore += $data['sensitivity_score'];
        }

        return max(0, 100 - ($sumScore / count($heatmapData)));
    }
}
