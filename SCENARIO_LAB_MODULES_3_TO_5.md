# 🧪 SCENARIO LAB MODULES 3-5: ADVANCED FEATURES

## 📊 MODULE 3: STABILITY & SENSITIVITY ANALYSIS

### 3.1 Sensitivity Heatmap Generator

```php
// app/Services/ScenarioLab/SensitivityAnalyzer.php
<?php

namespace App\Services\ScenarioLab;

class SensitivityAnalyzer
{
    public function generateSensitivityHeatmap(
        int $assessmentId,
        array $parameters,
        array $ranges
    ): array {
        $heatmapData = [];
        
        // For each parameter, test multiple values
        foreach ($parameters as $param) {
            $paramResults = [];
            
            $min = $ranges[$param]['min'];
            $max = $ranges[$param]['max'];
            $steps = $ranges[$param]['steps'] ?? 10;
            $stepSize = ($max - $min) / $steps;
            
            for ($i = 0; $i <= $steps; $i++) {
                $value = $min + ($i * $stepSize);
                
                // Recalculate with this parameter value
                $result = $this->recalculateWithParameter($assessmentId, $param, $value);
                
                $paramResults[] = [
                    'value' => round($value, 2),
                    'top_major' => $result['top_major'],
                    'top_score' => $result['top_score'],
                    'rank_changed' => $result['rank_changed']
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
        
        foreach ($results as $i => $result) {
            if ($previousMajor && $result['top_major'] !== $previousMajor) {
                $criticalPoints[] = [
                    'threshold_value' => $result['value'],
                    'from_major' => $previousMajor,
                    'to_major' => $result['top_major'],
                    'type' => 'rank_reversal'
                ];
            }
            $previousMajor = $result['top_major'];
        }
        
        return $criticalPoints;
    }
    
    private function calculateSensitivityScore(array $results): float
    {
        // Count how many times top recommendation changed
        $changes = 0;
        $previousMajor = null;
        
        foreach ($results as $result) {
            if ($previousMajor && $result['top_major'] !== $previousMajor) {
                $changes++;
            }
            $previousMajor = $result['top_major'];
        }
        
        // Sensitivity score: 0 = very stable, 100 = very sensitive
        return ($changes / (count($results) - 1)) * 100;
    }
}
```

### 3.2 Interactive Sensitivity Visualization

```typescript
// resources/js/Pages/ScenarioLab/SensitivityHeatmap.tsx

import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';

interface SensitivityHeatmapProps {
  data: SensitivityData;
  onCellClick: (param: string, value: number) => void;
}

export default function SensitivityHeatmap({ data, onCellClick }: SensitivityHeatmapProps) {
  const parameters = Object.keys(data.heatmap_data);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">
        🔥 Sensitivity Heatmap
      </h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Stability:</span>
          <span className={`text-lg font-bold ${
            data.overall_stability > 80 ? 'text-green-600' :
            data.overall_stability > 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {data.overall_stability.toFixed(1)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              data.overall_stability > 80 ? 'bg-green-600' :
              data.overall_stability > 60 ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
            style={{ width: `${data.overall_stability}%` }}
          />
        </div>
      </div>
      
      {/* Parameter-by-Parameter Analysis */}
      <div className="space-y-6">
        {parameters.map(param => {
          const paramData = data.heatmap_data[param];
          
          return (
            <div key={param} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold capitalize">
                  {param.replace(/_/g, ' ')}
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  paramData.sensitivity_score < 20 ? 'bg-green-100 text-green-800' :
                  paramData.sensitivity_score < 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Sensitivity: {paramData.sensitivity_score.toFixed(1)}%
                </span>
              </div>
              
              {/* Value Range Visualization */}
              <div className="relative h-20 bg-gradient-to-r from-blue-100 via-yellow-100 to-red-100 rounded-lg overflow-hidden">
                {paramData.critical_points.map((point, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-1 bg-red-600"
                    style={{
                      left: `${((point.threshold_value - paramData.results[0].value) / 
                              (paramData.results[paramData.results.length - 1].value - paramData.results[0].value)) * 100}%`
                    }}
                    title={`Rank reversal at ${point.threshold_value}`}
                  />
                ))}
                
                {/* Current value indicator */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-blue-600 rounded"
                  style={{ left: '50%', transform: 'translateX(-50%)' }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{paramData.results[0].value}</span>
                <span className="font-semibold">Current</span>
                <span>{paramData.results[paramData.results.length - 1].value}</span>
              </div>
              
              {/* Critical Points List */}
              {paramData.critical_points.length > 0 && (
                <div className="mt-3 bg-yellow-50 p-3 rounded">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    ⚠️ Critical Thresholds Detected:
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {paramData.critical_points.map((point, idx) => (
                      <li key={idx}>
                        At {point.threshold_value}: {point.from_major} → {point.to_major}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Most/Least Sensitive Parameters */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-red-800 mb-1">
            Most Sensitive Parameter
          </p>
          <p className="text-lg font-bold text-red-900">
            {data.most_sensitive_parameter.name}
          </p>
          <p className="text-sm text-red-700">
            {data.most_sensitive_parameter.sensitivity_score.toFixed(1)}% sensitivity
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-1">
            Least Sensitive Parameter
          </p>
          <p className="text-lg font-bold text-green-900">
            {data.least_sensitive_parameter.name}
          </p>
          <p className="text-sm text-green-700">
            {data.least_sensitive_parameter.sensitivity_score.toFixed(1)}% sensitivity
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 💾 MODULE 4: COMPARATIVE SCENARIO MANAGEMENT

### 4.1 Scenario Saving & Management

```php
// app/Models/SavedScenario.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedScenario extends Model
{
    protected $fillable = [
        'user_id',
        'assessment_id',
        'scenario_name',
        'scenario_description',
        'adjustments',
        'recommendations',
        'stability_metrics',
        'is_favorite',
        'tags'
    ];
    
    protected $casts = [
        'adjustments' => 'array',
        'recommendations' => 'array',
        'stability_metrics' => 'array',
        'is_favorite' => 'boolean',
        'tags' => 'array'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }
}
```

```php
// app/Services/ScenarioLab/ScenarioManager.php
<?php

namespace App\Services\ScenarioLab;

class ScenarioManager
{
    public function saveScenario(
        int $userId,
        int $assessmentId,
        string $name,
        array $adjustments,
        array $recommendations,
        array $stabilityMetrics
    ): SavedScenario {
        return SavedScenario::create([
            'user_id' => $userId,
            'assessment_id' => $assessmentId,
            'scenario_name' => $name,
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
    
    private function buildComparisonMatrix(Collection $scenarios): array
    {
        $matrix = [];
        
        foreach ($scenarios as $scenario) {
            $top3 = array_slice($scenario->recommendations, 0, 3);
            
            $matrix[$scenario->id] = [
                'name' => $scenario->scenario_name,
                'top_3_majors' => array_map(fn($r) => $r['major']['name'], $top3),
                'top_score' => $top3[0]['final_score'],
                'stability_score' => $scenario->stability_metrics['stability_score'],
                'adjustments_summary' => $this->summarizeAdjustments($scenario->adjustments)
            ];
        }
        
        return $matrix;
    }
    
    private function identifyKeyDifferences(Collection $scenarios): array
    {
        $differences = [];
        
        // Compare adjustments
        $baseScenario = $scenarios->first();
        
        foreach ($scenarios->skip(1) as $scenario) {
            $diff = [
                'scenario_name' => $scenario->scenario_name,
                'parameter_changes' => []
            ];
            
            foreach ($scenario->adjustments as $key => $value) {
                $baseValue = data_get($baseScenario->adjustments, $key);
                
                if ($baseValue !== $value) {
                    $diff['parameter_changes'][] = [
                        'parameter' => $key,
                        'base_value' => $baseValue,
                        'scenario_value' => $value,
                        'change_magnitude' => abs($value - $baseValue)
                    ];
                }
            }
            
            $differences[] = $diff;
        }
        
        return $differences;
    }
    
    private function calculateRecommendationOverlap(Collection $scenarios): array
    {
        $allTop3 = [];
        
        foreach ($scenarios as $scenario) {
            $top3Ids = array_slice(
                array_column($scenario->recommendations, 'major_id'),
                0,
                3
            );
            $allTop3[$scenario->id] = $top3Ids;
        }
        
        // Find common majors across all scenarios
        $commonMajors = array_intersect(...array_values($allTop3));
        
        // Calculate Jaccard similarity for each pair
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
                    'scenario_1' => $scenarios->find($id1)->scenario_name,
                    'scenario_2' => $scenarios->find($id2)->scenario_name,
                    'jaccard_similarity' => round($jaccardSimilarity, 3),
                    'common_majors' => $intersection
                ];
            }
        }
        
        return [
            'common_across_all' => array_values($commonMajors),
            'pairwise_similarities' => $similarities,
            'average_similarity' => round(
                array_sum(array_column($similarities, 'jaccard_similarity')) / count($similarities),
                3
            )
        ];
    }
}
```

### 4.2 Scenario Comparison UI

```typescript
// resources/js/Pages/ScenarioLab/ScenarioComparison.tsx

import React from 'react';
import { Card, Badge, Table } from '@/Components';

interface ScenarioComparisonProps {
  comparisonData: ComparisonData;
}

export default function ScenarioComparison({ comparisonData }: ScenarioComparisonProps) {
  const { scenarios, comparison_matrix, key_differences, recommendation_overlap } = comparisonData;
  
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-4">
          📊 Scenario Comparison
        </h2>
        
        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Metric</th>
                {Object.values(comparison_matrix).map((scenario: any) => (
                  <th key={scenario.name} className="text-left p-3">
                    {scenario.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Top Recommendation</td>
                {Object.values(comparison_matrix).map((scenario: any) => (
                  <td key={scenario.name} className="p-3">
                    <span className="font-semibold text-blue-600">
                      {scenario.top_3_majors[0]}
                    </span>
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-3 font-medium">Top 3 Majors</td>
                {Object.values(comparison_matrix).map((scenario: any) => (
                  <td key={scenario.name} className="p-3">
                    <ol className="list-decimal list-inside text-sm">
                      {scenario.top_3_majors.map((major: string, idx: number) => (
                        <li key={idx}>{major}</li>
                      ))}
                    </ol>
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-3 font-medium">Match Score</td>
                {Object.values(comparison_matrix).map((scenario: any) => (
                  <td key={scenario.name} className="p-3">
                    <span className="text-lg font-bold">
                      {(scenario.top_score * 100).toFixed(1)}%
                    </span>
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-3 font-medium">Stability Score</td>
                {Object.values(comparison_matrix).map((scenario: any) => (
                  <td key={scenario.name} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        scenario.stability_score > 80 ? 'text-green-600' :
                        scenario.stability_score > 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {scenario.stability_score.toFixed(1)}%
                      </span>
                      <span className="text-2xl">
                        {scenario.stability_score > 80 ? '🟢' :
                         scenario.stability_score > 60 ? '🟡' : '🔴'}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Recommendation Overlap Analysis */}
      <Card>
        <h3 className="text-xl font-bold mb-4">
          🔗 Recommendation Overlap
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Common majors across all scenarios:
          </p>
          {recommendation_overlap.common_across_all.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {recommendation_overlap.common_across_all.map((majorId: number) => (
                <Badge key={majorId} variant="success">
                  {/* Lookup major name */}
                  Major #{majorId}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No common majors in top 3 across all scenarios
            </p>
          )}
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Pairwise similarity:
          </p>
          <div className="space-y-2">
            {recommendation_overlap.pairwise_similarities.map((sim: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">
                  {sim.scenario_1} ↔ {sim.scenario_2}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {sim.common_majors}/3 common
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${sim.jaccard_similarity * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-12 text-right">
                    {(sim.jaccard_similarity * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Key Differences */}
      <Card>
        <h3 className="text-xl font-bold mb-4">
          🔍 Key Differences
        </h3>
        
        {key_differences.map((diff: any, idx: number) => (
          <div key={idx} className="mb-4 last:mb-0">
            <h4 className="font-semibold mb-2">{diff.scenario_name}</h4>
            <div className="space-y-1">
              {diff.parameter_changes.map((change: any, changeIdx: number) => (
                <div key={changeIdx} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                  <span className="font-medium">{change.parameter}</span>
                  <span>
                    {change.base_value} → {change.scenario_value}
                    <span className="ml-2 text-gray-500">
                      (Δ {change.change_magnitude.toFixed(2)})
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
```

---

## 🔮 MODULE 5: PREDICTIVE OUTCOME MODELING

### 5.1 Monte Carlo Simulation for Outcome Prediction

```php
// app/Services/ScenarioLab/MonteCarloSimulator.php
<?php

namespace App\Services\ScenarioLab;

class MonteCarloSimulator
{
    private const SIMULATION_ITERATIONS = 10000;
    
    public function simulateOutcomes(
        array $userProfile,
        array $majorRecommendations,
        array $uncertaintyFactors
    ): array {
        $simulations = [];
        
        foreach ($majorRecommendations as $major) {
            $outcomes = $this->runSimulations(
                $userProfile,
                $major,
                $uncertaintyFactors
            );
            
            $simulations[$major['major_id']] = [
                'major_name' => $major['major']['name'],
                'success_probability_distribution' => $this->calculateDistribution($outcomes['success']),
                'gpa_distribution' => $this->calculateDistribution($outcomes['gpa']),
                'completion_time_distribution' => $this->calculateDistribution($outcomes['completion_time']),
                'dropout_probability' => $this->calculateDropoutProbability($outcomes),
                'expected_value' => $this->calculateExpectedValue($outcomes),
                'confidence_intervals' => $this->calculateConfidenceIntervals($outcomes)
            ];
        }
        
        return $simulations;
    }
    
    private function runSimulations(
        array $userProfile,
        array $major,
        array $uncertaintyFactors
    ): array {
        $outcomes = [
            'success' => [],
            'gpa' => [],
            'completion_time' => [],
            'dropout' => []
        ];
        
        for ($i = 0; $i < self::SIMULATION_ITERATIONS; $i++) {
            // Add random variation based on uncertainty factors
            $simulatedProfile = $this->addRandomVariation($userProfile, $uncertaintyFactors);
            
            // Predict outcome for this iteration
            $outcome = $this->predictOutcome($simulatedProfile, $major);
            
            $outcomes['success'][] = $outcome['success_score'];
            $outcomes['gpa'][] = $outcome['predicted_gpa'];
            $outcomes['completion_time'][] = $outcome['completion_years'];
            $outcomes['dropout'][] = $outcome['dropout_risk'];
        }
        
        return $outcomes;
    }
    
    private function addRandomVariation(array $profile, array $uncertaintyFactors): array
    {
        $varied = $profile;
        
        foreach ($uncertaintyFactors as $factor => $stdDev) {
            if (isset($varied[$factor])) {
                // Add Gaussian noise
                $noise = $this->gaussianRandom(0, $stdDev);
                $varied[$factor] = max(0, min(100, $varied[$factor] + $noise));
            }
        }
        
        return $varied;
    }
    
    private function gaussianRandom(float $mean, float $stdDev): float
    {
        // Box-Muller transform
        $u1 = mt_rand() / mt_getrandmax();
        $u2 = mt_rand() / mt_getrandmax();
        
        $z0 = sqrt(-2 * log($u1)) * cos(2 * pi() * $u2);
        
        return $mean + $stdDev * $z0;
    }
    
    private function calculateDistribution(array $values): array
    {
        sort($values);
        
        return [
            'mean' => array_sum($values) / count($values),
            'median' => $values[intval(count($values) / 2)],
            'std_dev' => $this->calculateStdDev($values),
            'percentile_10' => $values[intval(count($values) * 0.10)],
            'percentile_25' => $values[intval(count($values) * 0.25)],
            'percentile_75' => $values[intval(count($values) * 0.75)],
            'percentile_90' => $values[intval(count($values) * 0.90)],
            'min' => min($values),
            'max' => max($values)
        ];
    }
}
```

