# 🔬 MAJORMIND COMPARISON MODULE: ULTIMATE MASTER PROMPT
## Advanced Multi-Dimensional Major Comparison & Analysis Platform

---

## 📖 DOCUMENT PURPOSE

This is the **SINGLE COMPREHENSIVE PROMPT** for implementing the MajorMind Comparison Module - an advanced analytical platform that allows users to compare multiple majors side-by-side across dozens of dimensions, understand trade-offs, visualize differences, and make informed decisions through data-driven comparative analysis with algorithmic precision.

---

## 🎯 SYSTEM OBJECTIVES

Transform Comparison Module to achieve:

1. **Multi-Dimensional Analysis**: Compare up to 5 majors across 50+ attributes simultaneously
2. **Algorithmic Transparency**: Show how each algorithm ranks each major differently
3. **Trade-Off Visualization**: Interactive Pareto frontier and spider charts
4. **Gap Analysis**: Detailed competency gap breakdown per major
5. **Evidence-Based Comparison**: Curriculum data, career outcomes, salary projections
6. **Predictive Modeling**: Success probability distributions per major
7. **Decision Support**: Weighted scoring with user-adjustable priorities

---

## 🏗️ COMPARISON MODULE ARCHITECTURE: 6-COMPONENT SYSTEM

### COMPONENT 1: MAJOR SELECTION & FILTERING
### COMPONENT 2: MULTI-DIMENSIONAL COMPARISON MATRIX
### COMPONENT 3: ALGORITHMIC BREAKDOWN ANALYSIS
### COMPONENT 4: TRADE-OFF & PARETO VISUALIZATION
### COMPONENT 5: PREDICTIVE OUTCOME COMPARISON
### COMPONENT 6: DECISION RECOMMENDATION ENGINE

---

## 🎯 COMPONENT 1: MAJOR SELECTION & FILTERING

### 1.1 Intelligent Major Selection Interface

```typescript
// resources/js/Pages/Comparison/MajorSelector.tsx

import React, { useState, useEffect } from 'react';
import { Combobox, Badge, Card } from '@/Components';

interface MajorSelectorProps {
  availableMajors: Major[];
  userRecommendations: RecommendationResult[];
  onSelectionChange: (selectedMajors: Major[]) => void;
  maxSelection?: number;
}

export default function MajorSelector({
  availableMajors,
  userRecommendations,
  onSelectionChange,
  maxSelection = 5
}: MajorSelectorProps) {
  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Smart suggestions based on user profile
  const suggestedMajors = useMemo(() => {
    return [
      ...userRecommendations.slice(0, 3).map(r => r.major),
      ...getSimilarMajors(userRecommendations[0]?.major, 2)
    ];
  }, [userRecommendations]);
  
  const handleAddMajor = (major: Major) => {
    if (selectedMajors.length >= maxSelection) {
      toast.error(`Maximum ${maxSelection} majors can be compared`);
      return;
    }
    
    const newSelection = [...selectedMajors, major];
    setSelectedMajors(newSelection);
    onSelectionChange(newSelection);
  };
  
  const handleRemoveMajor = (majorId: number) => {
    const newSelection = selectedMajors.filter(m => m.id !== majorId);
    setSelectedMajors(newSelection);
    onSelectionChange(newSelection);
  };
  
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">
        🎓 Select Majors to Compare
      </h3>
      
      {/* Quick Add: Suggested Majors */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          💡 Suggested based on your profile:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedMajors.map(major => (
            <button
              key={major.id}
              onClick={() => handleAddMajor(major)}
              disabled={selectedMajors.some(m => m.id === major.id)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${selectedMajors.some(m => m.id === major.id)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer'
                }
              `}
            >
              {selectedMajors.some(m => m.id === major.id) ? '✓ ' : '+ '}
              {major.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Search & Add */}
      <div className="mb-4">
        <Combobox
          value={searchQuery}
          onChange={setSearchQuery}
          options={availableMajors
            .filter(m => !selectedMajors.some(sm => sm.id === m.id))
            .map(m => ({ value: m.id, label: m.name }))
          }
          onSelect={(majorId) => {
            const major = availableMajors.find(m => m.id === majorId);
            if (major) handleAddMajor(major);
          }}
          placeholder="Search for majors..."
        />
      </div>
      
      {/* Selected Majors */}
      <div>
        <p className="text-sm font-medium mb-2">
          Selected ({selectedMajors.length}/{maxSelection}):
        </p>
        {selectedMajors.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No majors selected yet. Add at least 2 majors to compare.
          </p>
        ) : (
          <div className="space-y-2">
            {selectedMajors.map((major, index) => (
              <div
                key={major.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{major.name}</p>
                    <p className="text-xs text-gray-600">
                      {major.category} • {major.university_count} universities
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMajor(major.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕ Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Action Button */}
      {selectedMajors.length >= 2 && (
        <button
          onClick={() => onSelectionChange(selectedMajors)}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Compare {selectedMajors.length} Majors →
        </button>
      )}
    </Card>
  );
}
```

---

## 📊 COMPONENT 2: MULTI-DIMENSIONAL COMPARISON MATRIX

### 2.1 Comprehensive Comparison Table

```php
// app/Services/Comparison/ComparisonMatrixBuilder.php
<?php

namespace App\Services\Comparison;

class ComparisonMatrixBuilder
{
    private array $comparisonDimensions = [
        'academic' => [
            'kesiapan_akademik_threshold' => 'Academic Readiness Required',
            'kemampuan_logika_threshold' => 'Logic Ability Required',
            'kemampuan_analitis_threshold' => 'Analytical Ability Required',
            'rata_rata_nilai_masuk' => 'Average Entry Score',
            'tingkat_kesulitan' => 'Difficulty Level'
        ],
        'career' => [
            'prospek_karir_score' => 'Career Outlook',
            'rata_rata_gaji_awal' => 'Starting Salary',
            'rata_rata_gaji_5_tahun' => '5-Year Salary',
            'tingkat_employment' => 'Employment Rate',
            'pertumbuhan_karir' => 'Career Growth Rate'
        ],
        'financial' => [
            'biaya_kuliah_per_tahun' => 'Annual Tuition',
            'total_biaya_4_tahun' => 'Total 4-Year Cost',
            'ketersediaan_beasiswa' => 'Scholarship Availability',
            'roi_5_tahun' => 'Return on Investment (5 years)',
            'break_even_point' => 'Break-Even Point (years)'
        ],
        'institutional' => [
            'jumlah_universitas' => 'Number of Universities',
            'akreditasi_rata_rata' => 'Average Accreditation',
            'rasio_dosen_mahasiswa' => 'Faculty-Student Ratio',
            'fasilitas_score' => 'Facilities Score',
            'reputasi_score' => 'Reputation Score'
        ],
        'curriculum' => [
            'persentase_sks_teori' => 'Theory Credits %',
            'persentase_sks_praktik' => 'Practical Credits %',
            'persentase_sks_kuantitatif' => 'Quantitative Credits %',
            'durasi_magang' => 'Internship Duration (months)',
            'skripsi_required' => 'Thesis Required'
        ],
        'workload' => [
            'jam_belajar_per_minggu' => 'Study Hours/Week',
            'tingkat_stress' => 'Stress Level',
            'work_life_balance' => 'Work-Life Balance',
            'tingkat_dropout' => 'Dropout Rate',
            'rata_rata_lama_studi' => 'Average Study Duration'
        ],
        'personality_fit' => [
            'riasec_realistic_fit' => 'Realistic Fit',
            'riasec_investigative_fit' => 'Investigative Fit',
            'riasec_artistic_fit' => 'Artistic Fit',
            'riasec_social_fit' => 'Social Fit',
            'riasec_enterprising_fit' => 'Enterprising Fit',
            'riasec_conventional_fit' => 'Conventional Fit'
        ]
    ];
    
    public function buildComparisonMatrix(
        array $majorIds,
        array $userProfile
    ): array {
        $majors = Major::with(['criteria', 'universities', 'curriculum'])
            ->whereIn('id', $majorIds)
            ->get();
        
        $matrix = [];
        
        foreach ($this->comparisonDimensions as $category => $dimensions) {
            $matrix[$category] = [
                'category_name' => $this->getCategoryName($category),
                'dimensions' => []
            ];
            
            foreach ($dimensions as $key => $label) {
                $dimensionData = [
                    'label' => $label,
                    'values' => [],
                    'user_value' => $this->getUserValue($key, $userProfile),
                    'best_major' => null,
                    'worst_major' => null,
                    'range' => null,
                    'variance' => null
                ];
                
                foreach ($majors as $major) {
                    $value = $this->getMajorValue($major, $key);
                    $dimensionData['values'][$major->id] = [
                        'raw' => $value,
                        'formatted' => $this->formatValue($value, $key),
                        'gap' => $this->calculateGap($value, $dimensionData['user_value']),
                        'percentile' => $this->calculatePercentile($value, $key)
                    ];
                }
                
                // Calculate statistics
                $values = array_column($dimensionData['values'], 'raw');
                $dimensionData['best_major'] = $majors->find(
                    array_search($this->getBestValue($values, $key), $values)
                )->name;
                $dimensionData['worst_major'] = $majors->find(
                    array_search($this->getWorstValue($values, $key), $values)
                )->name;
                $dimensionData['range'] = max($values) - min($values);
                $dimensionData['variance'] = $this->calculateVariance($values);
                
                $matrix[$category]['dimensions'][$key] = $dimensionData;
            }
        }
        
        return [
            'matrix' => $matrix,
            'summary' => $this->generateSummary($matrix, $majors),
            'highlights' => $this->identifyHighlights($matrix, $majors, $userProfile)
        ];
    }
    
    private function calculateGap($majorValue, $userValue): array
    {
        if ($userValue === null) {
            return ['value' => null, 'status' => 'unknown'];
        }
        
        $gap = $userValue - $majorValue;
        
        return [
            'value' => $gap,
            'status' => $gap >= 0 ? 'exceed' : 'deficit',
            'magnitude' => abs($gap),
            'severity' => $this->getGapSeverity($gap)
        ];
    }
    
    private function getGapSeverity(float $gap): string
    {
        $absGap = abs($gap);
        
        if ($gap >= 0) return 'exceed';
        if ($absGap <= 5) return 'minor';
        if ($absGap <= 15) return 'moderate';
        if ($absGap <= 25) return 'significant';
        return 'critical';
    }
    
    private function identifyHighlights(array $matrix, $majors, array $userProfile): array
    {
        $highlights = [];
        
        // Find major with best overall fit
        $fitScores = [];
        foreach ($majors as $major) {
            $fitScores[$major->id] = $this->calculateOverallFit($major, $userProfile);
        }
        arsort($fitScores);
        
        $highlights['best_fit'] = [
            'major' => $majors->find(array_key_first($fitScores))->name,
            'score' => round(reset($fitScores), 1),
            'reason' => 'Highest overall compatibility with your profile'
        ];
        
        // Find major with best career prospects
        $careerScores = array_map(
            fn($m) => $m->prospek_karir_score,
            $majors->toArray()
        );
        $bestCareerMajor = $majors->toArray()[array_search(max($careerScores), $careerScores)];
        
        $highlights['best_career'] = [
            'major' => $bestCareerMajor['name'],
            'score' => max($careerScores),
            'reason' => 'Highest career outlook and salary potential'
        ];
        
        // Find most affordable major
        $costs = array_map(
            fn($m) => $m->biaya_kuliah_per_tahun,
            $majors->toArray()
        );
        $cheapestMajor = $majors->toArray()[array_search(min($costs), $costs)];
        
        $highlights['most_affordable'] = [
            'major' => $cheapestMajor['name'],
            'cost' => min($costs),
            'reason' => 'Lowest tuition cost'
        ];
        
        // Find major with smallest competency gap
        $gapScores = [];
        foreach ($majors as $major) {
            $gapScores[$major->id] = $this->calculateTotalGap($major, $userProfile);
        }
        asort($gapScores);
        
        $highlights['easiest_entry'] = [
            'major' => $majors->find(array_key_first($gapScores))->name,
            'gap' => round(reset($gapScores), 1),
            'reason' => 'Smallest gap between your abilities and requirements'
        ];
        
        return $highlights;
    }
}
```

### 2.2 Interactive Comparison Table UI

```typescript
// resources/js/Pages/Comparison/ComparisonTable.tsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ComparisonTableProps {
  comparisonData: ComparisonMatrix;
  selectedMajors: Major[];
}

export default function ComparisonTable({
  comparisonData,
  selectedMajors
}: ComparisonTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['academic', 'career']);
  const [highlightMode, setHighlightMode] = useState<'best' | 'worst' | 'gap' | 'none'>('best');
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const getCellColor = (dimension: any, majorId: number) => {
    const value = dimension.values[majorId];
    
    if (highlightMode === 'best') {
      return value.raw === Math.max(...Object.values(dimension.values).map((v: any) => v.raw))
        ? 'bg-green-100 border-green-500'
        : '';
    }
    
    if (highlightMode === 'worst') {
      return value.raw === Math.min(...Object.values(dimension.values).map((v: any) => v.raw))
        ? 'bg-red-100 border-red-500'
        : '';
    }
    
    if (highlightMode === 'gap' && value.gap) {
      if (value.gap.severity === 'exceed') return 'bg-green-50';
      if (value.gap.severity === 'minor') return 'bg-yellow-50';
      if (value.gap.severity === 'moderate') return 'bg-orange-50';
      if (value.gap.severity === 'significant') return 'bg-red-50';
      if (value.gap.severity === 'critical') return 'bg-red-100';
    }
    
    return '';
  };
  
  return (
    <div className="space-y-4">
      {/* Highlight Mode Selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Highlight:</span>
        <div className="flex gap-2">
          {[
            { value: 'best', label: 'Best Values', color: 'green' },
            { value: 'worst', label: 'Worst Values', color: 'red' },
            { value: 'gap', label: 'Your Gaps', color: 'orange' },
            { value: 'none', label: 'None', color: 'gray' }
          ].map(mode => (
            <button
              key={mode.value}
              onClick={() => setHighlightMode(mode.value as any)}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors
                ${highlightMode === mode.value
                  ? `bg-${mode.color}-600 text-white`
                  : `bg-${mode.color}-100 text-${mode.color}-800 hover:bg-${mode.color}-200`
                }
              `}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Comparison Matrix */}
      <div className="overflow-x-auto">
        {Object.entries(comparisonData.matrix).map(([categoryKey, category]: [string, any]) => (
          <div key={categoryKey} className="mb-6 border rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full bg-gray-100 px-4 py-3 flex items-center justify-between hover:bg-gray-200 transition-colors"
            >
              <h3 className="text-lg font-bold">{category.category_name}</h3>
              {expandedCategories.includes(categoryKey) ? <ChevronUp /> : <ChevronDown />}
            </button>
            
            {/* Category Content */}
            {expandedCategories.includes(categoryKey) && (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-3 font-semibold sticky left-0 bg-gray-50 z-10">
                      Dimension
                    </th>
                    {highlightMode === 'gap' && (
                      <th className="text-center p-3 font-semibold bg-blue-50">
                        Your Value
                      </th>
                    )}
                    {selectedMajors.map(major => (
                      <th key={major.id} className="text-center p-3 font-semibold">
                        {major.name}
                      </th>
                    ))}
                    <th className="text-center p-3 font-semibold bg-gray-50">
                      Best
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(category.dimensions).map(([dimKey, dimension]: [string, any]) => (
                    <tr key={dimKey} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-2">
                          {dimension.label}
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                        </div>
                      </td>
                      
                      {highlightMode === 'gap' && dimension.user_value !== null && (
                        <td className="text-center p-3 bg-blue-50 font-semibold">
                          {dimension.user_value}
                        </td>
                      )}
                      
                      {selectedMajors.map(major => {
                        const value = dimension.values[major.id];
                        return (
                          <td
                            key={major.id}
                            className={`text-center p-3 border-2 border-transparent ${getCellColor(dimension, major.id)}`}
                          >
                            <div>
                              <div className="font-semibold">{value.formatted}</div>
                              {highlightMode === 'gap' && value.gap && value.gap.value !== null && (
                                <div className={`text-xs mt-1 ${
                                  value.gap.status === 'exceed' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {value.gap.status === 'exceed' ? '+' : ''}{value.gap.value}
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                {value.percentile}th percentile
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      
                      <td className="text-center p-3 bg-gray-50 font-semibold">
                        {dimension.best_major}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```


---

## 🔍 COMPONENT 3: ALGORITHMIC BREAKDOWN ANALYSIS

### 3.1 Algorithm-Specific Ranking Comparison

```php
// app/Services/Comparison/AlgorithmBreakdownAnalyzer.php
<?php

namespace App\Services\Comparison;

class AlgorithmBreakdownAnalyzer
{
    public function analyzeAlgorithmicDifferences(
        array $selectedMajors,
        array $userProfile
    ): array {
        $breakdown = [];
        
        // Run each algorithm independently
        $algorithms = [
            'topsis_euclidean' => $this->runTopsisEuclidean($selectedMajors, $userProfile),
            'topsis_mahalanobis' => $this->runTopsisMahalanobis($selectedMajors, $userProfile),
            'profile_matching' => $this->runProfileMatching($selectedMajors, $userProfile),
            'ml_prediction' => $this->runMLPrediction($selectedMajors, $userProfile)
        ];
        
        foreach ($selectedMajors as $major) {
            $breakdown[$major['id']] = [
                'major_name' => $major['name'],
                'algorithm_scores' => [],
                'algorithm_ranks' => [],
                'consensus_score' => 0,
                'disagreement_level' => 0
            ];
            
            foreach ($algorithms as $algoName => $results) {
                $result = collect($results)->firstWhere('major_id', $major['id']);
                
                $breakdown[$major['id']]['algorithm_scores'][$algoName] = [
                    'score' => round($result['score'], 4),
                    'rank' => $result['rank'],
                    'normalized_score' => round($result['normalized_score'], 4)
                ];
                
                $breakdown[$major['id']]['algorithm_ranks'][$algoName] = $result['rank'];
            }
            
            // Calculate consensus metrics
            $ranks = array_values($breakdown[$major['id']]['algorithm_ranks']);
            $breakdown[$major['id']]['consensus_score'] = $this->calculateConsensusScore($ranks);
            $breakdown[$major['id']]['disagreement_level'] = $this->calculateDisagreementLevel($ranks);
            $breakdown[$major['id']]['rank_variance'] = $this->calculateVariance($ranks);
        }
        
        return [
            'breakdown' => $breakdown,
            'algorithm_weights' => $this->getHybridWeights(),
            'consensus_analysis' => $this->analyzeOverallConsensus($breakdown)
        ];
    }

    
    private function calculateConsensusScore(array $ranks): float
    {
        // High consensus = low variance in ranks
        $variance = $this->calculateVariance($ranks);
        $maxVariance = pow(count($ranks), 2);
        
        return (1 - ($variance / $maxVariance)) * 100;
    }
    
    private function calculateDisagreementLevel(array $ranks): string
    {
        $variance = $this->calculateVariance($ranks);
        
        if ($variance < 1) return 'Very Low - Strong Consensus';
        if ($variance < 4) return 'Low - General Agreement';
        if ($variance < 9) return 'Moderate - Some Disagreement';
        if ($variance < 16) return 'High - Significant Disagreement';
        return 'Very High - Major Disagreement';
    }
    
    private function analyzeOverallConsensus(array $breakdown): array
    {
        $consensusScores = array_column($breakdown, 'consensus_score');
        
        return [
            'average_consensus' => round(array_sum($consensusScores) / count($consensusScores), 1),
            'min_consensus' => round(min($consensusScores), 1),
            'max_consensus' => round(max($consensusScores), 1),
            'interpretation' => $this->interpretConsensus(
                array_sum($consensusScores) / count($consensusScores)
            )
        ];
    }
    
    private function getHybridWeights(): array
    {
        return [
            'topsis_euclidean' => 0.30,
            'profile_matching' => 0.25,
            'topsis_mahalanobis' => 0.20,
            'ml_prediction' => 0.25
        ];
    }
}
```

### 3.2 Algorithm Breakdown Visualization

```typescript
// resources/js/Pages/Comparison/AlgorithmBreakdown.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AlgorithmBreakdownProps {
  breakdownData: AlgorithmBreakdown;
  selectedMajors: Major[];
}

export default function AlgorithmBreakdown({
  breakdownData,
  selectedMajors
}: AlgorithmBreakdownProps) {
  const algorithmColors = {
    topsis_euclidean: '#3B82F6',
    topsis_mahalanobis: '#8B5CF6',
    profile_matching: '#10B981',
    ml_prediction: '#F59E0B'
  };
  
  const algorithmLabels = {
    topsis_euclidean: 'TOPSIS (Euclidean)',
    topsis_mahalanobis: 'TOPSIS (Mahalanobis)',
    profile_matching: 'Profile Matching',
    ml_prediction: 'ML Prediction'
  };

  
  // Prepare data for stacked bar chart
  const chartData = selectedMajors.map(major => {
    const majorBreakdown = breakdownData.breakdown[major.id];
    const data: any = { major: major.name };
    
    Object.entries(majorBreakdown.algorithm_scores).forEach(([algo, scoreData]: [string, any]) => {
      data[algo] = scoreData.normalized_score * 100;
    });
    
    return data;
  });
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">
          🔬 Algorithmic Breakdown Analysis
        </h3>
        <p className="text-gray-700">
          See how each algorithm ranks these majors differently. High consensus indicates 
          robust recommendations, while disagreement reveals nuanced trade-offs.
        </p>
      </div>
      
      {/* Overall Consensus Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Average Consensus</p>
          <p className="text-3xl font-bold text-blue-600">
            {breakdownData.consensus_analysis.average_consensus}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Consensus Range</p>
          <p className="text-lg font-semibold">
            {breakdownData.consensus_analysis.min_consensus}% - {breakdownData.consensus_analysis.max_consensus}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Interpretation</p>
          <p className="text-sm font-medium text-gray-800">
            {breakdownData.consensus_analysis.interpretation}
          </p>
        </div>
      </div>
      
      {/* Algorithm Score Comparison Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">
          Algorithm Score Comparison
        </h4>
        <BarChart width={800} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="major" angle={-15} textAnchor="end" height={100} />
          <YAxis label={{ value: 'Normalized Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {Object.entries(algorithmColors).map(([algo, color]) => (
            <Bar
              key={algo}
              dataKey={algo}
              name={algorithmLabels[algo]}
              fill={color}
              stackId="a"
            />
          ))}
        </BarChart>
      </div>

      
      {/* Detailed Breakdown Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-semibold">Major</th>
              {Object.entries(algorithmLabels).map(([algo, label]) => (
                <th key={algo} className="text-center p-3 font-semibold">
                  {label}
                </th>
              ))}
              <th className="text-center p-3 font-semibold bg-blue-50">Consensus</th>
              <th className="text-center p-3 font-semibold bg-blue-50">Disagreement</th>
            </tr>
          </thead>
          <tbody>
            {selectedMajors.map(major => {
              const breakdown = breakdownData.breakdown[major.id];
              return (
                <tr key={major.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{major.name}</td>
                  {Object.entries(breakdown.algorithm_scores).map(([algo, scoreData]: [string, any]) => (
                    <td key={algo} className="text-center p-3">
                      <div>
                        <div className="font-semibold">
                          Rank #{scoreData.rank}
                        </div>
                        <div className="text-xs text-gray-600">
                          Score: {(scoreData.normalized_score * 100).toFixed(1)}
                        </div>
                      </div>
                    </td>
                  ))}
                  <td className="text-center p-3 bg-blue-50">
                    <div className="font-bold text-blue-600">
                      {breakdown.consensus_score.toFixed(1)}%
                    </div>
                  </td>
                  <td className="text-center p-3 bg-blue-50">
                    <div className="text-sm">
                      {breakdown.disagreement_level}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Algorithm Weights Explanation */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-semibold mb-2">📊 Hybrid Algorithm Weights</h4>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(breakdownData.algorithm_weights).map(([algo, weight]) => (
            <div key={algo} className="text-center">
              <div className="text-2xl font-bold" style={{ color: algorithmColors[algo] }}>
                {(weight * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-700">{algorithmLabels[algo]}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-700 mt-3">
          Final recommendation scores are calculated using these weighted contributions from each algorithm.
        </p>
      </div>
    </div>
  );
}
```

---

## 📈 COMPONENT 4: TRADE-OFF & PARETO VISUALIZATION

### 4.1 Pareto Frontier Analysis

```php
// app/Services/Comparison/ParetoAnalyzer.php
<?php

namespace App\Services\Comparison;

class ParetoAnalyzer
{
    public function calculateParetoFrontier(
        array $majors,
        string $dimension1,
        string $dimension2
    ): array {
        $points = [];
        
        foreach ($majors as $major) {
            $points[] = [
                'major_id' => $major['id'],
                'major_name' => $major['name'],
                'x' => $this->getDimensionValue($major, $dimension1),
                'y' => $this->getDimensionValue($major, $dimension2),
                'is_dominated' => false
            ];
        }

        
        // Identify dominated points
        foreach ($points as $i => $pointA) {
            foreach ($points as $j => $pointB) {
                if ($i === $j) continue;
                
                // Point A is dominated if Point B is better in both dimensions
                if ($pointB['x'] >= $pointA['x'] && $pointB['y'] >= $pointA['y'] &&
                    ($pointB['x'] > $pointA['x'] || $pointB['y'] > $pointA['y'])) {
                    $points[$i]['is_dominated'] = true;
                    break;
                }
            }
        }
        
        // Pareto frontier = non-dominated points
        $paretoFrontier = array_filter($points, fn($p) => !$p['is_dominated']);
        
        // Sort by x-axis for visualization
        usort($paretoFrontier, fn($a, $b) => $a['x'] <=> $b['x']);
        
        return [
            'all_points' => $points,
            'pareto_frontier' => array_values($paretoFrontier),
            'dimension_1' => [
                'name' => $dimension1,
                'label' => $this->getDimensionLabel($dimension1)
            ],
            'dimension_2' => [
                'name' => $dimension2,
                'label' => $this->getDimensionLabel($dimension2)
            ],
            'trade_off_analysis' => $this->analyzeTradeOffs($paretoFrontier, $dimension1, $dimension2)
        ];
    }
    
    private function analyzeTradeOffs(array $paretoFrontier, string $dim1, string $dim2): array
    {
        $tradeOffs = [];
        
        for ($i = 0; $i < count($paretoFrontier) - 1; $i++) {
            $current = $paretoFrontier[$i];
            $next = $paretoFrontier[$i + 1];
            
            $xGain = $next['x'] - $current['x'];
            $yLoss = $current['y'] - $next['y'];
            
            $tradeOffs[] = [
                'from_major' => $current['major_name'],
                'to_major' => $next['major_name'],
                'gain_dimension' => $dim1,
                'gain_amount' => round($xGain, 2),
                'loss_dimension' => $dim2,
                'loss_amount' => round($yLoss, 2),
                'trade_off_ratio' => $yLoss > 0 ? round($xGain / $yLoss, 2) : null,
                'interpretation' => $this->interpretTradeOff($xGain, $yLoss, $dim1, $dim2)
            ];
        }
        
        return $tradeOffs;
    }
    
    private function interpretTradeOff(float $gain, float $loss, string $dim1, string $dim2): string
    {
        $dim1Label = $this->getDimensionLabel($dim1);
        $dim2Label = $this->getDimensionLabel($dim2);
        
        return sprintf(
            "Gaining %.1f points in %s costs %.1f points in %s",
            $gain,
            $dim1Label,
            $loss,
            $dim2Label
        );
    }
}
```

### 4.2 Interactive Pareto Chart

```typescript
// resources/js/Pages/Comparison/ParetoVisualization.tsx

import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from 'recharts';

interface ParetoVisualizationProps {
  paretoData: ParetoAnalysis;
  selectedMajors: Major[];
}

export default function ParetoVisualization({
  paretoData,
  selectedMajors
}: ParetoVisualizationProps) {
  const [selectedDimensions, setSelectedDimensions] = useState({
    x: 'prospek_karir_score',
    y: 'biaya_kuliah_per_tahun'
  });
  
  const dimensionOptions = [
    { value: 'prospek_karir_score', label: 'Career Outlook' },
    { value: 'rata_rata_gaji_awal', label: 'Starting Salary' },
    { value: 'biaya_kuliah_per_tahun', label: 'Annual Tuition (inverted)' },
    { value: 'tingkat_kesulitan', label: 'Difficulty Level (inverted)' },
    { value: 'kesiapan_akademik_threshold', label: 'Academic Readiness Required' },
    { value: 'work_life_balance', label: 'Work-Life Balance' }
  ];

  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">
          📈 Pareto Frontier & Trade-Off Analysis
        </h3>
        <p className="text-gray-700">
          Visualize the optimal trade-offs between competing objectives. Majors on the 
          Pareto frontier represent the best possible compromises - improving one dimension 
          requires sacrificing another.
        </p>
      </div>
      
      {/* Dimension Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">X-Axis (Horizontal)</label>
          <select
            value={selectedDimensions.x}
            onChange={(e) => setSelectedDimensions({ ...selectedDimensions, x: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {dimensionOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Y-Axis (Vertical)</label>
          <select
            value={selectedDimensions.y}
            onChange={(e) => setSelectedDimensions({ ...selectedDimensions, y: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {dimensionOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Pareto Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <ScatterChart width={800} height={500}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name={paretoData.dimension_1.label}
            label={{ value: paretoData.dimension_1.label, position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={paretoData.dimension_2.label}
            label={{ value: paretoData.dimension_2.label, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-lg">
                    <p className="font-semibold">{data.major_name}</p>
                    <p className="text-sm">{paretoData.dimension_1.label}: {data.x}</p>
                    <p className="text-sm">{paretoData.dimension_2.label}: {data.y}</p>
                    {data.is_dominated ? (
                      <p className="text-xs text-red-600 mt-1">⚠️ Dominated (suboptimal)</p>
                    ) : (
                      <p className="text-xs text-green-600 mt-1">✓ Pareto Optimal</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          
          {/* Dominated points */}
          <Scatter
            name="Dominated Majors"
            data={paretoData.all_points.filter(p => p.is_dominated)}
            fill="#9CA3AF"
            shape="circle"
          />
          
          {/* Pareto frontier points */}
          <Scatter
            name="Pareto Optimal Majors"
            data={paretoData.pareto_frontier}
            fill="#10B981"
            shape="star"
            line={{ stroke: '#10B981', strokeWidth: 2 }}
          />
        </ScatterChart>
      </div>
      
      {/* Trade-Off Analysis Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="bg-gray-100 p-4">
          <h4 className="font-semibold">🔄 Trade-Off Analysis</h4>
          <p className="text-sm text-gray-600 mt-1">
            Moving along the Pareto frontier shows the cost-benefit of choosing one major over another
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">From Major</th>
              <th className="text-left p-3">To Major</th>
              <th className="text-center p-3 text-green-700">Gain</th>
              <th className="text-center p-3 text-red-700">Loss</th>
              <th className="text-center p-3">Trade-Off Ratio</th>
            </tr>
          </thead>
          <tbody>
            {paretoData.trade_off_analysis.map((tradeOff, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{tradeOff.from_major}</td>
                <td className="p-3 font-medium">{tradeOff.to_major}</td>
                <td className="text-center p-3 text-green-700">
                  +{tradeOff.gain_amount} {tradeOff.gain_dimension}
                </td>
                <td className="text-center p-3 text-red-700">
                  -{tradeOff.loss_amount} {tradeOff.loss_dimension}
                </td>
                <td className="text-center p-3 font-semibold">
                  {tradeOff.trade_off_ratio ? `1:${tradeOff.trade_off_ratio}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 🎯 COMPONENT 5: PREDICTIVE OUTCOME COMPARISON

### 5.1 Success Probability Distribution

```php
// app/Services/Comparison/OutcomePredictor.php
<?php

namespace App\Services\Comparison;

use App\Services\MachineLearning\SuccessPredictionService;

class OutcomePredictor
{
    public function __construct(
        private SuccessPredictionService $mlService
    ) {}
    
    public function predictOutcomes(
        array $selectedMajors,
        array $userProfile
    ): array {
        $predictions = [];
        
        foreach ($selectedMajors as $major) {
            $predictions[$major['id']] = [
                'major_name' => $major['name'],
                'success_probability' => $this->mlService->predictSuccess($userProfile, $major),
                'expected_gpa' => $this->predictGPA($userProfile, $major),
                'dropout_risk' => $this->predictDropoutRisk($userProfile, $major),
                'time_to_graduate' => $this->predictGraduationTime($userProfile, $major),
                'career_success_score' => $this->predictCareerSuccess($userProfile, $major),
                'satisfaction_score' => $this->predictSatisfaction($userProfile, $major),
                'confidence_interval' => $this->calculateConfidenceInterval($userProfile, $major)
            ];
        }
        
        return [
            'predictions' => $predictions,
            'comparison_summary' => $this->generateComparisonSummary($predictions),
            'risk_analysis' => $this->analyzeRisks($predictions)
        ];
    }

    
    private function predictGPA(array $userProfile, array $major): array
    {
        // ML model prediction
        $expectedGPA = $this->mlService->predictGPA($userProfile, $major);
        
        return [
            'expected_value' => round($expectedGPA, 2),
            'confidence_interval_95' => [
                'lower' => round($expectedGPA - 0.3, 2),
                'upper' => round($expectedGPA + 0.3, 2)
            ],
            'percentile' => $this->calculatePercentile($expectedGPA, $major['historical_gpa_distribution'])
        ];
    }
    
    private function predictDropoutRisk(array $userProfile, array $major): array
    {
        $riskScore = $this->mlService->predictDropoutProbability($userProfile, $major);
        
        return [
            'probability' => round($riskScore * 100, 1),
            'risk_level' => $this->getRiskLevel($riskScore),
            'key_risk_factors' => $this->identifyRiskFactors($userProfile, $major),
            'mitigation_strategies' => $this->suggestMitigationStrategies($riskScore, $major)
        ];
    }
    
    private function getRiskLevel(float $probability): array
    {
        if ($probability < 0.10) {
            return ['level' => 'Very Low', 'color' => 'green', 'icon' => '🟢'];
        } elseif ($probability < 0.20) {
            return ['level' => 'Low', 'color' => 'blue', 'icon' => '🔵'];
        } elseif ($probability < 0.35) {
            return ['level' => 'Moderate', 'color' => 'yellow', 'icon' => '🟡'];
        } elseif ($probability < 0.50) {
            return ['level' => 'High', 'color' => 'orange', 'icon' => '🟠'];
        } else {
            return ['level' => 'Very High', 'color' => 'red', 'icon' => '🔴'];
        }
    }
    
    private function identifyRiskFactors(array $userProfile, array $major): array
    {
        $factors = [];
        
        // Academic readiness gap
        $academicGap = $userProfile['academic_readiness'] - $major['academic_threshold'];
        if ($academicGap < -15) {
            $factors[] = [
                'factor' => 'Academic Readiness Gap',
                'severity' => 'high',
                'description' => "Your academic readiness ({$userProfile['academic_readiness']}) is significantly below the major's requirement ({$major['academic_threshold']})"
            ];
        }
        
        // Low grit score for high-difficulty major
        if ($userProfile['grit_score'] < 70 && $major['difficulty_level'] > 80) {
            $factors[] = [
                'factor' => 'Persistence Concern',
                'severity' => 'moderate',
                'description' => 'This major requires high persistence, but your grit score is moderate'
            ];
        }
        
        // Interest misalignment
        $interestAlignment = $this->calculateInterestAlignment($userProfile['riasec'], $major['interest_profile']);
        if ($interestAlignment < 60) {
            $factors[] = [
                'factor' => 'Interest Misalignment',
                'severity' => 'moderate',
                'description' => 'Your personality profile shows limited alignment with this major\'s typical interests'
            ];
        }
        
        return $factors;
    }
    
    private function generateComparisonSummary(array $predictions): array
    {
        $successRates = array_column($predictions, 'success_probability');
        $gpaExpectations = array_map(fn($p) => $p['expected_gpa']['expected_value'], $predictions);
        $dropoutRisks = array_map(fn($p) => $p['dropout_risk']['probability'], $predictions);
        
        return [
            'highest_success_rate' => [
                'major' => $this->getMajorByMaxValue($predictions, 'success_probability'),
                'value' => round(max($successRates) * 100, 1) . '%'
            ],
            'highest_expected_gpa' => [
                'major' => $this->getMajorByMaxValue($predictions, 'expected_gpa.expected_value'),
                'value' => max($gpaExpectations)
            ],
            'lowest_dropout_risk' => [
                'major' => $this->getMajorByMinValue($predictions, 'dropout_risk.probability'),
                'value' => round(min($dropoutRisks) * 100, 1) . '%'
            ]
        ];
    }
}
```

### 5.2 Outcome Comparison Visualization

```typescript
// resources/js/Pages/Comparison/OutcomeComparison.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

interface OutcomeComparisonProps {
  outcomeData: OutcomePredictions;
  selectedMajors: Major[];
}

export default function OutcomeComparison({
  outcomeData,
  selectedMajors
}: OutcomeComparisonProps) {
  const successData = selectedMajors.map(major => {
    const prediction = outcomeData.predictions[major.id];
    return {
      major: major.name,
      success_rate: prediction.success_probability * 100,
      expected_gpa: prediction.expected_gpa.expected_value,
      dropout_risk: prediction.dropout_risk.probability * 100
    };
  });
  
  const getRiskColor = (risk: number) => {
    if (risk < 10) return '#10B981';
    if (risk < 20) return '#3B82F6';
    if (risk < 35) return '#F59E0B';
    return '#EF4444';
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">
          🎯 Predictive Outcome Comparison
        </h3>
        <p className="text-gray-700">
          Machine learning predictions based on historical data from 2,847+ students with 
          similar profiles. These probabilities help you understand expected outcomes.
        </p>
      </div>

      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border-2 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Highest Success Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {outcomeData.comparison_summary.highest_success_rate.value}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {outcomeData.comparison_summary.highest_success_rate.major}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Highest Expected GPA</p>
          <p className="text-2xl font-bold text-blue-600">
            {outcomeData.comparison_summary.highest_expected_gpa.value}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {outcomeData.comparison_summary.highest_expected_gpa.major}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Lowest Dropout Risk</p>
          <p className="text-2xl font-bold text-purple-600">
            {outcomeData.comparison_summary.lowest_dropout_risk.value}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {outcomeData.comparison_summary.lowest_dropout_risk.major}
          </p>
        </div>
      </div>
      
      {/* Success Probability Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">Success Probability Comparison</h4>
        <BarChart width={800} height={300} data={successData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="major" angle={-15} textAnchor="end" height={100} />
          <YAxis label={{ value: 'Success Probability (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="success_rate" name="Success Rate">
            {successData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.success_rate > 75 ? '#10B981' : '#3B82F6'} />
            ))}
          </Bar>
        </BarChart>
      </div>
      
      {/* Detailed Predictions Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-semibold">Major</th>
              <th className="text-center p-3 font-semibold">Success Rate</th>
              <th className="text-center p-3 font-semibold">Expected GPA</th>
              <th className="text-center p-3 font-semibold">Dropout Risk</th>
              <th className="text-center p-3 font-semibold">Time to Graduate</th>
              <th className="text-center p-3 font-semibold">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {selectedMajors.map(major => {
              const prediction = outcomeData.predictions[major.id];
              return (
                <tr key={major.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{major.name}</td>
                  <td className="text-center p-3">
                    <div className="font-semibold text-green-600">
                      {(prediction.success_probability * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      CI: {(prediction.confidence_interval.lower * 100).toFixed(0)}-
                      {(prediction.confidence_interval.upper * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <div className="font-semibold">
                      {prediction.expected_gpa.expected_value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {prediction.expected_gpa.percentile}th percentile
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <div className="flex items-center justify-center gap-2">
                      <span>{prediction.dropout_risk.risk_level.icon}</span>
                      <span className="font-semibold">
                        {prediction.dropout_risk.probability}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {prediction.dropout_risk.risk_level.level}
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <div className="font-semibold">
                      {prediction.time_to_graduate.expected_years} years
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <div className="font-semibold">
                      {prediction.satisfaction_score}/10
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Risk Factor Analysis */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">⚠️ Risk Factor Analysis</h4>
        {selectedMajors.map(major => {
          const prediction = outcomeData.predictions[major.id];
          if (prediction.dropout_risk.key_risk_factors.length === 0) return null;
          
          return (
            <div key={major.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 className="font-semibold mb-2">{major.name}</h5>
              <ul className="space-y-2">
                {prediction.dropout_risk.key_risk_factors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${factor.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
                    `}>
                      {factor.severity}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{factor.factor}</p>
                      <p className="text-sm text-gray-700">{factor.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 🎲 COMPONENT 6: DECISION RECOMMENDATION ENGINE

### 6.1 Weighted Decision Scoring

```php
// app/Services/Comparison/DecisionRecommendationEngine.php
<?php

namespace App\Services\Comparison;

class DecisionRecommendationEngine
{
    public function generateFinalRecommendation(
        array $selectedMajors,
        array $userProfile,
        array $userPriorities
    ): array {
        $scoringDimensions = [
            'algorithmic_fit' => [
                'weight' => $userPriorities['algorithmic_fit'] ?? 0.30,
                'description' => 'Overall compatibility based on hybrid algorithm'
            ],
            'success_probability' => [
                'weight' => $userPriorities['success_probability'] ?? 0.25,
                'description' => 'Likelihood of successful completion'
            ],
            'career_prospects' => [
                'weight' => $userPriorities['career_prospects'] ?? 0.20,
                'description' => 'Career outlook and salary potential'
            ],
            'financial_feasibility' => [
                'weight' => $userPriorities['financial_feasibility'] ?? 0.15,
                'description' => 'Affordability and ROI'
            ],
            'personal_satisfaction' => [
                'weight' => $userPriorities['personal_satisfaction'] ?? 0.10,
                'description' => 'Interest alignment and predicted satisfaction'
            ]
        ];

        
        $finalScores = [];
        
        foreach ($selectedMajors as $major) {
            $dimensionScores = [
                'algorithmic_fit' => $this->getAlgorithmicFitScore($major, $userProfile),
                'success_probability' => $this->getSuccessProbabilityScore($major, $userProfile),
                'career_prospects' => $this->getCareerProspectsScore($major),
                'financial_feasibility' => $this->getFinancialFeasibilityScore($major, $userProfile),
                'personal_satisfaction' => $this->getPersonalSatisfactionScore($major, $userProfile)
            ];
            
            // Calculate weighted final score
            $weightedScore = 0;
            $scoreBreakdown = [];
            
            foreach ($scoringDimensions as $dimension => $config) {
                $score = $dimensionScores[$dimension];
                $contribution = $score * $config['weight'];
                $weightedScore += $contribution;
                
                $scoreBreakdown[$dimension] = [
                    'raw_score' => round($score, 2),
                    'weight' => $config['weight'],
                    'contribution' => round($contribution, 2),
                    'description' => $config['description']
                ];
            }
            
            $finalScores[$major['id']] = [
                'major_id' => $major['id'],
                'major_name' => $major['name'],
                'final_score' => round($weightedScore, 4),
                'score_breakdown' => $scoreBreakdown,
                'strengths' => $this->identifyStrengths($dimensionScores),
                'weaknesses' => $this->identifyWeaknesses($dimensionScores),
                'recommendation_confidence' => $this->calculateConfidence($dimensionScores)
            ];
        }
        
        // Sort by final score
        usort($finalScores, fn($a, $b) => $b['final_score'] <=> $a['final_score']);
        
        return [
            'ranked_recommendations' => $finalScores,
            'top_recommendation' => $finalScores[0],
            'scoring_dimensions' => $scoringDimensions,
            'decision_narrative' => $this->generateDecisionNarrative($finalScores[0], $userPriorities),
            'sensitivity_to_priorities' => $this->analyzePrioritySensitivity($selectedMajors, $userProfile)
        ];
    }
    
    private function identifyStrengths(array $dimensionScores): array
    {
        $strengths = [];
        
        foreach ($dimensionScores as $dimension => $score) {
            if ($score >= 80) {
                $strengths[] = [
                    'dimension' => $this->formatDimensionName($dimension),
                    'score' => $score,
                    'level' => 'Excellent'
                ];
            } elseif ($score >= 70) {
                $strengths[] = [
                    'dimension' => $this->formatDimensionName($dimension),
                    'score' => $score,
                    'level' => 'Strong'
                ];
            }
        }
        
        return $strengths;
    }
    
    private function identifyWeaknesses(array $dimensionScores): array
    {
        $weaknesses = [];
        
        foreach ($dimensionScores as $dimension => $score) {
            if ($score < 60) {
                $weaknesses[] = [
                    'dimension' => $this->formatDimensionName($dimension),
                    'score' => $score,
                    'severity' => $score < 50 ? 'High Concern' : 'Moderate Concern',
                    'mitigation' => $this->suggestMitigation($dimension, $score)
                ];
            }
        }
        
        return $weaknesses;
    }
    
    private function generateDecisionNarrative(array $topRecommendation, array $priorities): string
    {
        $major = $topRecommendation['major_name'];
        $score = round($topRecommendation['final_score'] * 100, 1);
        
        $narrative = "Based on your personalized priorities and comprehensive analysis, ";
        $narrative .= "**{$major}** emerges as the strongest choice with a decision score of **{$score}%**.\n\n";
        
        // Highlight top strengths
        if (!empty($topRecommendation['strengths'])) {
            $narrative .= "**Key Strengths:**\n";
            foreach (array_slice($topRecommendation['strengths'], 0, 3) as $strength) {
                $narrative .= "• {$strength['dimension']}: {$strength['level']} ({$strength['score']}/100)\n";
            }
            $narrative .= "\n";
        }
        
        // Address weaknesses if any
        if (!empty($topRecommendation['weaknesses'])) {
            $narrative .= "**Areas to Consider:**\n";
            foreach ($topRecommendation['weaknesses'] as $weakness) {
                $narrative .= "• {$weakness['dimension']} ({$weakness['score']}/100): {$weakness['mitigation']}\n";
            }
            $narrative .= "\n";
        }
        
        // Confidence statement
        $confidence = $topRecommendation['recommendation_confidence'];
        $narrative .= "**Recommendation Confidence:** {$confidence['level']} ({$confidence['score']}%)\n";
        $narrative .= $confidence['interpretation'];
        
        return $narrative;
    }
    
    private function analyzePrioritySensitivity(array $majors, array $userProfile): array
    {
        $scenarios = [
            'career_focused' => ['career_prospects' => 0.50, 'success_probability' => 0.20, 'algorithmic_fit' => 0.15, 'financial_feasibility' => 0.10, 'personal_satisfaction' => 0.05],
            'safety_focused' => ['success_probability' => 0.50, 'algorithmic_fit' => 0.25, 'personal_satisfaction' => 0.15, 'career_prospects' => 0.05, 'financial_feasibility' => 0.05],
            'passion_focused' => ['personal_satisfaction' => 0.50, 'algorithmic_fit' => 0.25, 'success_probability' => 0.15, 'career_prospects' => 0.05, 'financial_feasibility' => 0.05],
            'financial_focused' => ['financial_feasibility' => 0.50, 'career_prospects' => 0.25, 'success_probability' => 0.15, 'algorithmic_fit' => 0.05, 'personal_satisfaction' => 0.05]
        ];
        
        $sensitivityResults = [];
        
        foreach ($scenarios as $scenarioName => $priorities) {
            $results = $this->generateFinalRecommendation($majors, $userProfile, $priorities);
            $sensitivityResults[$scenarioName] = [
                'top_major' => $results['top_recommendation']['major_name'],
                'score' => $results['top_recommendation']['final_score']
            ];
        }
        
        return [
            'scenarios' => $sensitivityResults,
            'stability_analysis' => $this->analyzeRecommendationStability($sensitivityResults)
        ];
    }
}
```

### 6.2 Decision Recommendation UI

```typescript
// resources/js/Pages/Comparison/DecisionRecommendation.tsx

import React, { useState } from 'react';
import { Slider } from '@/Components';

interface DecisionRecommendationProps {
  recommendationData: DecisionRecommendation;
  selectedMajors: Major[];
}

export default function DecisionRecommendation({
  recommendationData,
  selectedMajors
}: DecisionRecommendationProps) {
  const [priorities, setPriorities] = useState({
    algorithmic_fit: 30,
    success_probability: 25,
    career_prospects: 20,
    financial_feasibility: 15,
    personal_satisfaction: 10
  });
  
  const handlePriorityChange = (dimension: string, value: number) => {
    // Normalize to ensure sum = 100
    const newPriorities = { ...priorities, [dimension]: value };
    const sum = Object.values(newPriorities).reduce((a, b) => a + b, 0);
    
    Object.keys(newPriorities).forEach(key => {
      newPriorities[key] = (newPriorities[key] / sum) * 100;
    });
    
    setPriorities(newPriorities);
  };

  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">
          🎯 Final Decision Recommendation
        </h3>
        <p className="text-gray-700">
          Adjust your priorities to see how the recommendation changes. The system weighs 
          multiple dimensions to provide a personalized final recommendation.
        </p>
      </div>
      
      {/* Priority Adjustment Panel */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">⚖️ Adjust Your Decision Priorities</h4>
        <div className="space-y-4">
          {Object.entries(recommendationData.scoring_dimensions).map(([key, config]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">{config.description}</label>
                <span className="text-sm font-semibold">{Math.round(priorities[key])}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                value={priorities[key]}
                onChange={(val) => handlePriorityChange(key, val)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            💡 Total: {Object.values(priorities).reduce((a, b) => a + b, 0).toFixed(0)}% 
            (automatically normalized to 100%)
          </p>
        </div>
      </div>
      
      {/* Top Recommendation Card */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-300">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-bold text-green-800">
            🏆 Top Recommendation
          </h4>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">
              {(recommendationData.top_recommendation.final_score * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Decision Score</div>
          </div>
        </div>
        
        <h5 className="text-3xl font-bold text-gray-800 mb-4">
          {recommendationData.top_recommendation.major_name}
        </h5>
        
        {/* Score Breakdown */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {Object.entries(recommendationData.top_recommendation.score_breakdown).map(([dim, data]) => (
            <div key={dim} className="bg-white p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.raw_score}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {data.description}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Weight: {(data.weight * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Strengths */}
        {recommendationData.top_recommendation.strengths.length > 0 && (
          <div className="mb-4">
            <h6 className="font-semibold text-green-800 mb-2">✓ Key Strengths</h6>
            <div className="grid grid-cols-2 gap-2">
              {recommendationData.top_recommendation.strengths.map((strength, idx) => (
                <div key={idx} className="bg-green-100 p-2 rounded flex items-center justify-between">
                  <span className="text-sm font-medium">{strength.dimension}</span>
                  <span className="text-sm font-bold text-green-700">
                    {strength.level} ({strength.score})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Weaknesses */}
        {recommendationData.top_recommendation.weaknesses.length > 0 && (
          <div className="mb-4">
            <h6 className="font-semibold text-orange-800 mb-2">⚠️ Areas to Consider</h6>
            <div className="space-y-2">
              {recommendationData.top_recommendation.weaknesses.map((weakness, idx) => (
                <div key={idx} className="bg-orange-50 p-3 rounded border border-orange-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{weakness.dimension}</span>
                    <span className="text-sm font-bold text-orange-700">
                      {weakness.severity} ({weakness.score})
                    </span>
                  </div>
                  <p className="text-xs text-gray-700">{weakness.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Confidence */}
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Recommendation Confidence</span>
            <span className="text-xl font-bold text-blue-600">
              {recommendationData.top_recommendation.recommendation_confidence.score}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${recommendationData.top_recommendation.recommendation_confidence.score}%` }}
            />
          </div>
          <p className="text-sm text-gray-700 mt-2">
            {recommendationData.top_recommendation.recommendation_confidence.interpretation}
          </p>
        </div>
      </div>
      
      {/* Decision Narrative */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-semibold mb-3">📝 Decision Explanation</h4>
        <div className="prose prose-sm max-w-none">
          {recommendationData.decision_narrative.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-2">{paragraph}</p>
          ))}
        </div>
      </div>
      
      {/* All Rankings */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="bg-gray-100 p-4">
          <h4 className="font-semibold">📊 Complete Rankings</h4>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Rank</th>
              <th className="text-left p-3">Major</th>
              <th className="text-center p-3">Final Score</th>
              <th className="text-center p-3">Algorithmic Fit</th>
              <th className="text-center p-3">Success Probability</th>
              <th className="text-center p-3">Career Prospects</th>
              <th className="text-center p-3">Financial</th>
              <th className="text-center p-3">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {recommendationData.ranked_recommendations.map((rec, idx) => (
              <tr key={rec.major_id} className={`border-t ${idx === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                <td className="p-3 font-bold">#{idx + 1}</td>
                <td className="p-3 font-medium">{rec.major_name}</td>
                <td className="text-center p-3 font-bold text-blue-600">
                  {(rec.final_score * 100).toFixed(1)}%
                </td>
                {Object.entries(rec.score_breakdown).map(([dim, data]) => (
                  <td key={dim} className="text-center p-3">
                    {data.raw_score}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Priority Sensitivity Analysis */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-lg font-semibold mb-4">🔄 Priority Sensitivity Analysis</h4>
        <p className="text-sm text-gray-600 mb-4">
          See how the top recommendation changes under different priority scenarios
        </p>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(recommendationData.sensitivity_to_priorities.scenarios).map(([scenario, result]) => (
            <div key={scenario} className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold mb-2 capitalize">
                {scenario.replace('_', ' ')}
              </h5>
              <p className="text-lg font-bold text-blue-600">{result.top_major}</p>
              <p className="text-sm text-gray-600">Score: {(result.score * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 IMPLEMENTATION SUMMARY

### Complete Feature Set

1. **Major Selection & Filtering** ✓
   - Intelligent suggestions based on user profile
   - Search and filter capabilities
   - Maximum 5 majors for comparison

2. **Multi-Dimensional Comparison Matrix** ✓
   - 50+ attributes across 7 categories
   - Gap analysis with user profile
   - Interactive highlighting modes
   - Statistical summaries

3. **Algorithmic Breakdown Analysis** ✓
   - Individual algorithm rankings
   - Consensus scoring
   - Disagreement detection
   - Hybrid weight visualization

4. **Trade-Off & Pareto Visualization** ✓
   - Pareto frontier identification
   - Interactive dimension selection
   - Trade-off ratio calculation
   - Dominated vs optimal points

5. **Predictive Outcome Comparison** ✓
   - ML-based success prediction
   - GPA expectations with confidence intervals
   - Dropout risk assessment
   - Risk factor identification

6. **Decision Recommendation Engine** ✓
   - Weighted multi-dimensional scoring
   - Adjustable user priorities
   - Strength/weakness analysis
   - Priority sensitivity testing

### Technical Architecture

**Backend (PHP/Laravel)**
- `ComparisonMatrixBuilder`: 50+ dimension comparison
- `AlgorithmBreakdownAnalyzer`: Multi-algorithm analysis
- `ParetoAnalyzer`: Optimal trade-off identification
- `OutcomePredictor`: ML-based predictions
- `DecisionRecommendationEngine`: Final scoring

**Frontend (React/TypeScript)**
- `MajorSelector`: Interactive selection UI
- `ComparisonTable`: Dynamic matrix display
- `AlgorithmBreakdown`: Consensus visualization
- `ParetoVisualization`: Interactive charts
- `OutcomeComparison`: Prediction display
- `DecisionRecommendation`: Priority adjustment

### Integration Points

1. **Assessment Module**: Receives user profile and psychometric data
2. **Dashboard Module**: Provides recommendation results
3. **Scenario Lab**: Shares sensitivity analysis logic
4. **ML Service**: Success prediction models

### Performance Targets

- Matrix generation: < 500ms
- Algorithm breakdown: < 800ms
- Pareto calculation: < 300ms
- ML predictions: < 1s per major
- Total page load: < 2s

### Validation Metrics

- Comparison accuracy: > 95%
- Pareto frontier correctness: 100%
- ML prediction accuracy: > 75%
- User satisfaction: > 8.5/10
- Decision confidence increase: > 30%

---

## 🎓 USE CASES

### Use Case 1: Career-Focused Student
**Profile**: High logic ability, prioritizes salary
**Workflow**:
1. Select top 5 career-oriented majors
2. Compare career prospects dimension
3. View Pareto frontier (salary vs difficulty)
4. Check ML success predictions
5. Adjust priorities to 50% career focus
6. Get final recommendation

### Use Case 2: Risk-Averse Student
**Profile**: Moderate abilities, wants safety
**Workflow**:
1. Select majors with high success rates
2. Compare dropout risk across majors
3. Analyze risk factors
4. View algorithmic consensus
5. Prioritize success probability (50%)
6. Choose major with lowest risk

### Use Case 3: Passion-Driven Student
**Profile**: Strong interests, flexible on outcomes
**Workflow**:
1. Select majors matching RIASEC profile
2. Compare personality fit dimension
3. Check satisfaction predictions
4. Analyze interest alignment
5. Prioritize personal satisfaction (50%)
6. Accept trade-offs for passion

---

## ✅ SUCCESS CRITERIA

### Quantitative Metrics
- Users compare average 3.5 majors
- 85%+ complete full comparison workflow
- Decision confidence increases 35%+
- 90%+ find comparison helpful
- < 2s total load time

### Qualitative Goals
- Users understand trade-offs clearly
- Pareto visualization aids decision-making
- Algorithm transparency builds trust
- Risk analysis reduces anxiety
- Final recommendation feels personalized

---

*This comprehensive prompt provides complete implementation specifications for the MajorMind Comparison Module - enabling data-driven, transparent, and personalized major comparison with advanced analytical capabilities.*
