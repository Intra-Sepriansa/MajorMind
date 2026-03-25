<?php

namespace App\Services\ScenarioLab;

use App\Models\SavedScenario;

class ScenarioManager
{
    public function saveScenario(
        int $userId,
        int $assessmentId,
        string $name,
        string $description,
        array $adjustments,
        array $recommendations,
        array $stabilityMetrics
    ): SavedScenario {
        return SavedScenario::create([
            'user_id' => $userId,
            'assessment_id' => $assessmentId,
            'scenario_name' => $name,
            'scenario_description' => $description,
            'adjustments' => $adjustments,
            'recommendations' => $recommendations,
            'stability_metrics' => $stabilityMetrics,
            'tags' => $this->generateAutoTags($adjustments)
        ]);
    }
    
    public function compareScenarios(array $scenarioIds): array
    {
        $scenarios = SavedScenario::whereIn('id', $scenarioIds)->get();
        
        if ($scenarios->count() < 2) {
            throw new \Exception('At least 2 scenarios required for comparison');
        }
        
        return [
            'scenarios' => $scenarios,
            'comparison_matrix' => $this->buildComparisonMatrix($scenarios),
            'key_differences' => $this->identifyKeyDifferences($scenarios),
            'recommendation_overlap' => $this->calculateRecommendationOverlap($scenarios),
            'stability_comparison' => $this->compareStability($scenarios)
        ];
    }
    
    private function generateAutoTags(array $adjustments): array
    {
        $tags = [];
        
        if (isset($adjustments['criteria_weights'])) {
            $weights = $adjustments['criteria_weights'];
            arsort($weights);
            $topWeightKeys = array_slice(array_keys($weights), 0, 2);
            foreach ($topWeightKeys as $key) {
                $tags[] = 'high_' . $key;
            }
        }
        
        if (isset($adjustments['psychometric']['grit_score']) && $adjustments['psychometric']['grit_score'] > 80) {
            $tags[] = 'high_grit';
        }

        return $tags;
    }

    private function buildComparisonMatrix($scenarios): array
    {
        $matrix = [];
        
        foreach ($scenarios as $scenario) {
            $top3 = array_slice($scenario->recommendations, 0, 3);
            
            $matrix[$scenario->id] = [
                'name' => $scenario->scenario_name,
                'top_3_majors' => array_map(fn($r) => $r['major']['name'] ?? 'Unknown', $top3),
                'top_score' => $top3[0]['final_score'] ?? 0,
                'stability_score' => $scenario->stability_metrics['stability_score'] ?? 0,
            ];
        }
        
        return $matrix;
    }
    
    private function identifyKeyDifferences($scenarios): array
    {
        $differences = [];
        $baseScenario = $scenarios->first();
        
        foreach ($scenarios->skip(1) as $scenario) {
            $diff = [
                'scenario_name' => $scenario->scenario_name,
                'parameter_changes' => []
            ];
            
            // Shallow flattened diff for demonstration
            $baseAdj = $this->flattenArray($baseScenario->adjustments ?? []);
            $scenAdj = $this->flattenArray($scenario->adjustments ?? []);
            
            foreach ($scenAdj as $key => $value) {
                $baseValue = $baseAdj[$key] ?? null;
                if ($baseValue !== $value) {
                    $diff['parameter_changes'][] = [
                        'parameter' => $key,
                        'base_value' => is_numeric($baseValue) ? round((float)$baseValue, 2) : $baseValue,
                        'scenario_value' => is_numeric($value) ? round((float)$value, 2) : $value,
                        'change_magnitude' => is_numeric($value) && is_numeric($baseValue) ? abs((float)$value - (float)$baseValue) : null
                    ];
                }
            }
            $differences[] = $diff;
        }
        
        return $differences;
    }
    
    private function flattenArray(array $array, string $prefix = ''): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $result = array_merge($result, $this->flattenArray($value, $prefix . $key . '.'));
            } else {
                $result[$prefix . $key] = $value;
            }
        }
        return $result;
    }

    private function calculateRecommendationOverlap($scenarios): array
    {
        $allTop3 = [];
        
        foreach ($scenarios as $scenario) {
            $top3Ids = array_map(fn($r) => $r['major_id'] ?? $r['major']['id'] ?? 0, array_slice($scenario->recommendations ?? [], 0, 3));
            $allTop3[$scenario->id] = $top3Ids;
        }
        
        if (empty($allTop3)) {
            return ['common_across_all' => [], 'pairwise_similarities' => [], 'average_similarity' => 0];
        }

        $commonMajors = array_intersect(...array_values($allTop3));
        
        $similarities = [];
        $scenarioIds = $scenarios->pluck('id')->toArray();
        
        for ($i = 0; $i < count($scenarioIds) - 1; $i++) {
            for ($j = $i + 1; $j < count($scenarioIds); $j++) {
                $id1 = $scenarioIds[$i];
                $id2 = $scenarioIds[$j];
                
                $intersection = count(array_intersect($allTop3[$id1], $allTop3[$id2]));
                $union = count(array_unique(array_merge($allTop3[$id1], $allTop3[$id2])));
                
                $jaccardSimilarity = $union > 0 ? $intersection / $union : 0;
                
                $similarities[] = [
                    'scenario_1' => $scenarios->firstWhere('id', $id1)->scenario_name,
                    'scenario_2' => $scenarios->firstWhere('id', $id2)->scenario_name,
                    'jaccard_similarity' => round($jaccardSimilarity, 3),
                    'common_majors' => $intersection
                ];
            }
        }
        
        return [
            'common_across_all' => array_values($commonMajors),
            'pairwise_similarities' => $similarities,
            'average_similarity' => count($similarities) > 0 ? round(array_sum(array_column($similarities, 'jaccard_similarity')) / count($similarities), 3) : 0
        ];
    }

    private function compareStability($scenarios): array
    {
        $stabilityData = [];
        foreach ($scenarios as $scenario) {
            $stabilityData[] = [
                'name' => $scenario->scenario_name,
                'score' => $scenario->stability_metrics['stability_score'] ?? 0
            ];
        }
        return $stabilityData;
    }
}
