# 🧪 MAJORMIND SCENARIO LAB: ULTIMATE MASTER PROMPT
## Advanced What-If Analysis & Sensitivity Testing Platform

---

## 📖 DOCUMENT PURPOSE

This is the **SINGLE COMPREHENSIVE PROMPT** for implementing the MajorMind Scenario Lab - an advanced interactive simulation environment where users can explore "what-if" scenarios, test recommendation stability, conduct sensitivity analysis, and understand how different life circumstances affect their major recommendations through real-time algorithmic recalculation.

---

## 🎯 SYSTEM OBJECTIVES

Transform Scenario Lab to achieve:

1. **Real-Time Sensitivity Analysis**: Instant recalculation as users adjust parameters
2. **Multi-Dimensional Simulation**: Test changes across psychometric, academic, financial, and preference dimensions
3. **Stability Visualization**: Show how robust recommendations are to parameter changes
4. **Rank Reversal Detection**: Identify critical thresholds where top recommendations change
5. **Comparative Scenario Analysis**: Save and compare multiple scenarios side-by-side
6. **Predictive Modeling**: Show probability distributions of outcomes under different scenarios
7. **Evidence-Based Insights**: Explain why changes occur with mathematical precision

---

## 🏗️ SCENARIO LAB ARCHITECTURE: 5-MODULE SYSTEM

### MODULE 1: INTERACTIVE PARAMETER ADJUSTMENT
### MODULE 2: REAL-TIME ALGORITHMIC RECALCULATION
### MODULE 3: STABILITY & SENSITIVITY ANALYSIS
### MODULE 4: COMPARATIVE SCENARIO MANAGEMENT
### MODULE 5: PREDICTIVE OUTCOME MODELING

---

## 🎛️ MODULE 1: INTERACTIVE PARAMETER ADJUSTMENT

### 1.1 Adjustable Parameter Categories

**Category A: Psychometric Profile Adjustments**
```typescript
interface PsychometricAdjustments {
  riasec: {
    realistic: number;        // 0-100
    investigative: number;    // 0-100
    artistic: number;         // 0-100
    social: number;           // 0-100
    enterprising: number;     // 0-100
    conventional: number;     // 0-100
  };
  grit_score: number;         // 0-100
  logic_ability: number;      // 0-100
  academic_readiness: number; // 0-100
}
```

**Category B: AHP Criteria Weight Adjustments**
```typescript
interface CriteriaWeightAdjustments {
  kesiapan_akademik: number;  // 0-1 (sum must = 1)
  persaingan_jurusan: number; // 0-1
  prospek_karir: number;      // 0-1
  biaya_kuliah: number;       // 0-1
}
```

**Category C: Life Circumstance Scenarios**
```typescript
interface LifeCircumstanceScenarios {
  financial_situation: 'very_limited' | 'limited' | 'moderate' | 'comfortable' | 'unlimited';
  scholarship_availability: boolean;
  family_pressure: 'none' | 'mild' | 'moderate' | 'strong' | 'extreme';
  geographic_constraint: 'none' | 'city_only' | 'province_only' | 'specific_university';
  time_constraint: 'standard_4_years' | 'accelerated_3_years' | 'extended_5_years';
  work_while_study: boolean;
}
```

**Category D: Future Goal Adjustments**
```typescript
interface FutureGoalAdjustments {
  career_priority: 'salary' | 'passion' | 'impact' | 'stability' | 'prestige';
  work_environment: 'corporate' | 'startup' | 'government' | 'ngo' | 'academic' | 'freelance';
  international_aspiration: boolean;
  entrepreneurship_interest: number; // 0-100
  research_interest: number;         // 0-100
}
```

### 1.2 Interactive UI Components

```typescript
// resources/js/Pages/ScenarioLab/ParameterAdjustmentPanel.tsx

import React, { useState, useEffect } from 'react';
import { Slider, Switch, Select, Card } from '@/Components';
import { debounce } from 'lodash';

interface ParameterAdjustmentPanelProps {
  baselineProfile: UserProfile;
  onParameterChange: (adjustments: ScenarioAdjustments) => void;
  isRecalculating: boolean;
}

export default function ParameterAdjustmentPanel({
  baselineProfile,
  onParameterChange,
  isRecalculating
}: ParameterAdjustmentPanelProps) {
  const [adjustments, setAdjustments] = useState<ScenarioAdjustments>({
    psychometric: { ...baselineProfile.psychometric },
    criteria_weights: { ...baselineProfile.ahp_weights },
    life_circumstances: {},
    future_goals: {}
  });
  
  // Debounced recalculation (500ms delay)
  const debouncedRecalculate = debounce((newAdjustments) => {
    onParameterChange(newAdjustments);
  }, 500);
  
  const handleSliderChange = (category: string, parameter: string, value: number) => {
    const newAdjustments = {
      ...adjustments,
      [category]: {
        ...adjustments[category],
        [parameter]: value
      }
    };
    
    setAdjustments(newAdjustments);
    debouncedRecalculate(newAdjustments);
  };
  
  return (
    <div className="space-y-6">
      {/* Psychometric Adjustments */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          🧬 Adjust Your Personality Profile
        </h3>
        
        <div className="space-y-4">
          {/* RIASEC Sliders */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Investigative (Analytical & Research-Oriented)
            </label>
            <div className="flex items-center gap-4">
              <Slider
                min={0}
                max={100}
                value={adjustments.psychometric.riasec.investigative}
                onChange={(val) => handleSliderChange('psychometric', 'riasec.investigative', val)}
                className="flex-1"
              />
              <span className="text-lg font-semibold w-12 text-right">
                {adjustments.psychometric.riasec.investigative}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low Interest</span>
              <span>High Interest</span>
            </div>
          </div>
          
          {/* Repeat for other RIASEC dimensions */}
          
          {/* Grit Score */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Grit & Persistence
            </label>
            <Slider
              min={0}
              max={100}
              value={adjustments.psychometric.grit_score}
              onChange={(val) => handleSliderChange('psychometric', 'grit_score', val)}
            />
          </div>
          
          {/* Logic Ability */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Logic & Analytical Ability
            </label>
            <Slider
              min={0}
              max={100}
              value={adjustments.psychometric.logic_ability}
              onChange={(val) => handleSliderChange('psychometric', 'logic_ability', val)}
            />
          </div>
        </div>
      </Card>
      
      {/* Criteria Weight Adjustments */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          ⚖️ Adjust Your Priorities
        </h3>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              💡 Tip: Total must equal 100%. Adjusting one slider will automatically 
              redistribute others proportionally.
            </p>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Prospek Karir & Gaji</label>
              <span className="text-sm font-semibold">
                {Math.round(adjustments.criteria_weights.prospek_karir * 100)}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              value={adjustments.criteria_weights.prospek_karir * 100}
              onChange={(val) => handleWeightChange('prospek_karir', val / 100)}
            />
          </div>
          
          {/* Repeat for other criteria */}
        </div>
      </Card>
      
      {/* Life Circumstances */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">
          🏠 Life Circumstances & Constraints
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Financial Situation
            </label>
            <Select
              value={adjustments.life_circumstances.financial_situation}
              onChange={(val) => handleSelectChange('life_circumstances', 'financial_situation', val)}
              options={[
                { value: 'very_limited', label: 'Very Limited (< Rp 5 juta/tahun)' },
                { value: 'limited', label: 'Limited (Rp 5-15 juta/tahun)' },
                { value: 'moderate', label: 'Moderate (Rp 15-30 juta/tahun)' },
                { value: 'comfortable', label: 'Comfortable (Rp 30-50 juta/tahun)' },
                { value: 'unlimited', label: 'Unlimited (> Rp 50 juta/tahun)' }
              ]}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Scholarship Available?
            </label>
            <Switch
              checked={adjustments.life_circumstances.scholarship_availability}
              onChange={(val) => handleSwitchChange('life_circumstances', 'scholarship_availability', val)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Family Pressure Level
            </label>
            <Select
              value={adjustments.life_circumstances.family_pressure}
              onChange={(val) => handleSelectChange('life_circumstances', 'family_pressure', val)}
              options={[
                { value: 'none', label: 'None - Full Freedom' },
                { value: 'mild', label: 'Mild - Suggestions Only' },
                { value: 'moderate', label: 'Moderate - Strong Preferences' },
                { value: 'strong', label: 'Strong - Limited Options' },
                { value: 'extreme', label: 'Extreme - Specific Major Required' }
              ]}
            />
          </div>
        </div>
      </Card>
      
      {/* Recalculation Indicator */}
      {isRecalculating && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Recalculating...</span>
        </div>
      )}
    </div>
  );
}
```

---

## ⚡ MODULE 2: REAL-TIME ALGORITHMIC RECALCULATION

### 2.1 Scenario Computation Engine

```php
// app/Services/ScenarioLab/ScenarioComputationEngine.php
<?php

namespace App\Services\ScenarioLab;

use App\Services\DecisionSupport\HybridRecommendationEngine;
use App\Services\DecisionSupport\EnhancedAhpService;
use Illuminate\Support\Facades\Cache;

class ScenarioComputationEngine
{
    public function __construct(
        private HybridRecommendationEngine $recommendationEngine,
        private EnhancedAhpService $ahpService
    ) {}
    
    public function recalculateScenario(
        int $baselineAssessmentId,
        array $adjustments
    ): array {
        // Generate cache key based on adjustments
        $cacheKey = $this->generateCacheKey($baselineAssessmentId, $adjustments);
        
        // Check cache first (scenarios are cached for 1 hour)
        return Cache::remember($cacheKey, 3600, function () use ($baselineAssessmentId, $adjustments) {
            return $this->performRecalculation($baselineAssessmentId, $adjustments);
        });
    }
    
    private function performRecalculation(int $baselineAssessmentId, array $adjustments): array
    {
        $startTime = microtime(true);
        
        // 1. Load baseline assessment
        $baseline = Assessment::with(['psychometricProfile', 'ahpWeights'])
            ->findOrFail($baselineAssessmentId);
        
        // 2. Apply adjustments to create scenario profile
        $scenarioProfile = $this->applyAdjustments(
            $baseline->psychometricProfile->toArray(),
            $adjustments['psychometric'] ?? []
        );
        
        // 3. Apply criteria weight adjustments
        $scenarioWeights = $this->applyWeightAdjustments(
            $baseline->ahpWeights->weights,
            $adjustments['criteria_weights'] ?? []
        );
        
        // 4. Apply life circumstance filters
        $filteredMajors = $this->applyLifeCircumstanceFilters(
            Major::all()->toArray(),
            $adjustments['life_circumstances'] ?? []
        );
        
        // 5. Recalculate recommendations with hybrid engine
        $newRecommendations = $this->recommendationEngine->generateRecommendations(
            $scenarioProfile,
            $scenarioWeights,
            $filteredMajors
        );
        
        // 6. Compare with baseline
        $comparison = $this->compareWithBaseline(
            $baseline->recommendationResults->toArray(),
            $newRecommendations
        );
        
        // 7. Calculate stability metrics
        $stabilityMetrics = $this->calculateStabilityMetrics(
            $baseline->recommendationResults->toArray(),
            $newRecommendations,
            $adjustments
        );
        
        $executionTime = round((microtime(true) - $startTime) * 1000, 2);
        
        return [
            'scenario_recommendations' => $newRecommendations,
            'baseline_recommendations' => $baseline->recommendationResults->toArray(),
            'comparison' => $comparison,
            'stability_metrics' => $stabilityMetrics,
            'execution_time_ms' => $executionTime,
            'adjustments_applied' => $adjustments,
            'timestamp' => now()->toIso8601String()
        ];
    }
    
    private function applyAdjustments(array $baseProfile, array $adjustments): array
    {
        $scenarioProfile = $baseProfile;
        
        foreach ($adjustments as $key => $value) {
            if (strpos($key, '.') !== false) {
                // Handle nested keys (e.g., 'riasec.investigative')
                $keys = explode('.', $key);
                $this->setNestedValue($scenarioProfile, $keys, $value);
            } else {
                $scenarioProfile[$key] = $value;
            }
        }
        
        return $scenarioProfile;
    }
    
    private function applyWeightAdjustments(array $baseWeights, array $adjustments): array
    {
        if (empty($adjustments)) {
            return $baseWeights;
        }
        
        $scenarioWeights = array_merge($baseWeights, $adjustments);
        
        // Normalize to ensure sum = 1
        $sum = array_sum($scenarioWeights);
        foreach ($scenarioWeights as $key => $weight) {
            $scenarioWeights[$key] = $weight / $sum;
        }
        
        return $scenarioWeights;
    }
    
    private function applyLifeCircumstanceFilters(array $majors, array $circumstances): array
    {
        $filtered = $majors;
        
        // Filter by financial situation
        if (isset($circumstances['financial_situation'])) {
            $maxCost = $this->getMaxCostByFinancialSituation($circumstances['financial_situation']);
            $filtered = array_filter($filtered, fn($major) => 
                $major['average_annual_cost'] <= $maxCost
            );
        }
        
        // Filter by scholarship availability
        if (isset($circumstances['scholarship_availability']) && $circumstances['scholarship_availability']) {
            // Boost majors with high scholarship availability
            foreach ($filtered as &$major) {
                if ($major['scholarship_availability_score'] > 70) {
                    $major['cost_adjusted'] = $major['average_annual_cost'] * 0.5;
                }
            }
        }
        
        // Filter by geographic constraint
        if (isset($circumstances['geographic_constraint']) && $circumstances['geographic_constraint'] !== 'none') {
            $filtered = $this->applyGeographicFilter($filtered, $circumstances['geographic_constraint']);
        }
        
        // Filter by family pressure
        if (isset($circumstances['family_pressure']) && $circumstances['family_pressure'] !== 'none') {
            $filtered = $this->applyFamilyPressureFilter($filtered, $circumstances);
        }
        
        return array_values($filtered);
    }
    
    private function compareWithBaseline(array $baseline, array $scenario): array
    {
        $baselineTop3 = array_slice($baseline, 0, 3);
        $scenarioTop3 = array_slice($scenario, 0, 3);
        
        $comparison = [
            'rank_changes' => [],
            'new_entries' => [],
            'dropped_out' => [],
            'score_changes' => [],
            'rank_reversal_detected' => false
        ];
        
        // Detect rank changes
        foreach ($baselineTop3 as $baseRec) {
            $scenarioRec = collect($scenario)->firstWhere('major_id', $baseRec['major_id']);
            
            if ($scenarioRec) {
                $rankChange = $baseRec['rank'] - $scenarioRec['rank'];
                $scoreChange = $scenarioRec['final_score'] - $baseRec['final_score'];
                
                if ($rankChange != 0) {
                    $comparison['rank_changes'][] = [
                        'major_id' => $baseRec['major_id'],
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
                    'major_id' => $baseRec['major_id'],
                    'major_name' => $baseRec['major']['name'],
                    'baseline_rank' => $baseRec['rank']
                ];
            }
        }
        
        // Detect new entries in top 3
        foreach ($scenarioTop3 as $scenRec) {
            $inBaseline = collect($baselineTop3)->contains('major_id', $scenRec['major_id']);
            
            if (!$inBaseline) {
                $comparison['new_entries'][] = [
                    'major_id' => $scenRec['major_id'],
                    'major_name' => $scenRec['major']['name'],
                    'scenario_rank' => $scenRec['rank'],
                    'final_score' => round($scenRec['final_score'], 4)
                ];
            }
        }
        
        return $comparison;
    }
    
    private function calculateStabilityMetrics(
        array $baseline,
        array $scenario,
        array $adjustments
    ): array {
        $baselineTop = $baseline[0];
        $scenarioTop = $scenario[0];
        
        // Calculate Kendall's Tau (rank correlation)
        $kendallTau = $this->calculateKendallTau($baseline, $scenario);
        
        // Calculate Spearman's Rho
        $spearmanRho = $this->calculateSpearmanRho($baseline, $scenario);
        
        // Calculate score volatility
        $scoreVolatility = $this->calculateScoreVolatility($baseline, $scenario);
        
        // Determine stability level
        $stabilityScore = ($kendallTau + $spearmanRho) / 2 * 100;
        
        return [
            'stability_score' => round($stabilityScore, 1),
            'stability_level' => $this->getStabilityLevel($stabilityScore),
            'kendall_tau' => round($kendallTau, 3),
            'spearman_rho' => round($spearmanRho, 3),
            'score_volatility' => round($scoreVolatility, 3),
            'top_recommendation_changed' => $baselineTop['major_id'] !== $scenarioTop['major_id'],
            'adjustment_magnitude' => $this->calculateAdjustmentMagnitude($adjustments)
        ];
    }
    
    private function calculateKendallTau(array $baseline, array $scenario): float
    {
        $n = min(count($baseline), count($scenario));
        $concordant = 0;
        $discordant = 0;
        
        for ($i = 0; $i < $n - 1; $i++) {
            for ($j = $i + 1; $j < $n; $j++) {
                $baselineOrder = $baseline[$i]['rank'] < $baseline[$j]['rank'];
                $scenarioOrder = $scenario[$i]['rank'] < $scenario[$j]['rank'];
                
                if ($baselineOrder === $scenarioOrder) {
                    $concordant++;
                } else {
                    $discordant++;
                }
            }
        }
        
        $totalPairs = ($n * ($n - 1)) / 2;
        return ($concordant - $discordant) / $totalPairs;
    }
    
    private function getStabilityLevel(float $score): array
    {
        if ($score >= 90) {
            return [
                'level' => 'Very Stable',
                'color' => 'green',
                'description' => 'Recommendations are highly robust to parameter changes',
                'icon' => '🟢'
            ];
        } elseif ($score >= 75) {
            return [
                'level' => 'Stable',
                'color' => 'blue',
                'description' => 'Recommendations are generally stable',
                'icon' => '🔵'
            ];
        } elseif ($score >= 60) {
            return [
                'level' => 'Moderately Stable',
                'color' => 'yellow',
                'description' => 'Some sensitivity to parameter changes',
                'icon' => '🟡'
            ];
        } else {
            return [
                'level' => 'Unstable',
                'color' => 'red',
                'description' => 'Recommendations are highly sensitive to changes',
                'icon' => '🔴'
            ];
        }
    }
}
```

