# 🎯 ASSESSMENT PHASES 3-7: ADVANCED IMPLEMENTATION

## 🔄 PHASE 3: AHP PAIRWISE COMPARISON WITH REAL-TIME VALIDATION

### 3.1 Enhanced AHP Engine with Consistency Monitoring

```php
// app/Services/DecisionSupport/EnhancedAhpService.php
<?php

namespace App\Services\DecisionSupport;

class EnhancedAhpService
{
    private array $criteria = [
        'kesiapan_akademik' => 'Kesiapan Akademik',
        'persaingan_jurusan' => 'Tingkat Persaingan',
        'prospek_karir' => 'Prospek Karir & Gaji',
        'biaya_kuliah' => 'Biaya Kuliah'
    ];
    
    private array $randomIndex = [
        3 => 0.58, 4 => 0.90, 5 => 1.12, 6 => 1.24,
        7 => 1.32, 8 => 1.41, 9 => 1.45, 10 => 1.49
    ];
    
    public function calculateWeightsWithValidation(array $comparisonMatrix): array
    {
        $n = count($comparisonMatrix);
        
        // Step 1: Normalize matrix
        $normalizedMatrix = $this->normalizeMatrix($comparisonMatrix);
        
        // Step 2: Calculate priority vector (eigenvector)
        $weights = $this->calculatePriorityVector($normalizedMatrix);
        
        // Step 3: Calculate lambda max
        $lambdaMax = $this->calculateLambdaMax($comparisonMatrix, $weights);
        
        // Step 4: Calculate Consistency Index (CI)
        $ci = ($lambdaMax - $n) / ($n - 1);
        
        // Step 5: Calculate Consistency Ratio (CR)
        $ri = $this->randomIndex[$n] ?? 1.49;
        $cr = $ci / $ri;
        
        // Step 6: Detect specific inconsistencies
        $inconsistencies = $this->detectInconsistencies($comparisonMatrix, $weights);
        
        // Step 7: Suggest improvements if CR > 0.1
        $suggestions = [];
        if ($cr > 0.1) {
            $suggestions = $this->generateImprovementSuggestions($comparisonMatrix, $inconsistencies);
        }
        
        return [
            'weights' => $weights,
            'lambda_max' => round($lambdaMax, 4),
            'consistency_index' => round($ci, 4),
            'consistency_ratio' => round($cr, 4),
            'is_consistent' => $cr <= 0.1,
            'consistency_level' => $this->getConsistencyLevel($cr),
            'inconsistencies' => $inconsistencies,
            'improvement_suggestions' => $suggestions,
            'confidence_score' => $this->calculateConfidenceScore($cr)
        ];
    }
    
    private function normalizeMatrix(array $matrix): array
    {
        $n = count($matrix);
        $columnSums = array_fill(0, $n, 0);
        
        // Calculate column sums
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                $columnSums[$j] += $matrix[$i][$j];
            }
        }
        
        // Normalize
        $normalized = [];
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                $normalized[$i][$j] = $matrix[$i][$j] / $columnSums[$j];
            }
        }
        
        return $normalized;
    }
    
    private function calculatePriorityVector(array $normalizedMatrix): array
    {
        $n = count($normalizedMatrix);
        $weights = [];
        
        // Average across rows
        for ($i = 0; $i < $n; $i++) {
            $rowSum = array_sum($normalizedMatrix[$i]);
            $weights[] = $rowSum / $n;
        }
        
        return $weights;
    }
    
    private function calculateLambdaMax(array $matrix, array $weights): float
    {
        $n = count($matrix);
        $weightedSum = array_fill(0, $n, 0);
        
        // Matrix multiplication: A * w
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                $weightedSum[$i] += $matrix[$i][$j] * $weights[$j];
            }
        }
        
        // Calculate lambda for each row and average
        $lambdas = [];
        for ($i = 0; $i < $n; $i++) {
            if ($weights[$i] > 0) {
                $lambdas[] = $weightedSum[$i] / $weights[$i];
            }
        }
        
        return array_sum($lambdas) / count($lambdas);
    }
    
    private function detectInconsistencies(array $matrix, array $weights): array
    {
        $n = count($matrix);
        $inconsistencies = [];
        
        // Check transitivity: if A > B and B > C, then A should > C
        for ($i = 0; $i < $n; $i++) {
            for ($j = $i + 1; $j < $n; $j++) {
                for ($k = $j + 1; $k < $n; $k++) {
                    $aij = $matrix[$i][$j];
                    $ajk = $matrix[$j][$k];
                    $aik = $matrix[$i][$k];
                    
                    // Expected: aik ≈ aij * ajk
                    $expected = $aij * $ajk;
                    $deviation = abs($aik - $expected) / $expected;
                    
                    if ($deviation > 0.3) { // 30% deviation threshold
                        $inconsistencies[] = [
                            'type' => 'transitivity_violation',
                            'criteria' => [$i, $j, $k],
                            'actual' => round($aik, 2),
                            'expected' => round($expected, 2),
                            'deviation' => round($deviation * 100, 1) . '%'
                        ];
                    }
                }
            }
        }
        
        return $inconsistencies;
    }
    
    private function generateImprovementSuggestions(array $matrix, array $inconsistencies): array
    {
        $suggestions = [];
        
        if (empty($inconsistencies)) {
            $suggestions[] = [
                'type' => 'general',
                'message' => 'Coba review kembali perbandingan Anda dan pastikan logika konsisten'
            ];
        } else {
            foreach ($inconsistencies as $inc) {
                $criteriaNames = array_values($this->criteria);
                $suggestions[] = [
                    'type' => 'specific',
                    'message' => sprintf(
                        'Perbandingan antara "%s", "%s", dan "%s" tidak konsisten. ' .
                        'Anda menilai %s vs %s = %.1f, tetapi berdasarkan perbandingan lain, ' .
                        'seharusnya sekitar %.1f',
                        $criteriaNames[$inc['criteria'][0]],
                        $criteriaNames[$inc['criteria'][1]],
                        $criteriaNames[$inc['criteria'][2]],
                        $criteriaNames[$inc['criteria'][0]],
                        $criteriaNames[$inc['criteria'][2]],
                        $inc['actual'],
                        $inc['expected']
                    )
                ];
            }
        }
        
        return $suggestions;
    }
    
    private function getConsistencyLevel(float $cr): array
    {
        if ($cr < 0.05) {
            return [
                'level' => 'Excellent',
                'color' => 'green',
                'description' => 'Preferensi Anda sangat konsisten dan logis',
                'icon' => '✅'
            ];
        } elseif ($cr < 0.08) {
            return [
                'level' => 'Very Good',
                'color' => 'blue',
                'description' => 'Preferensi Anda konsisten',
                'icon' => '✓'
            ];
        } elseif ($cr < 0.10) {
            return [
                'level' => 'Good',
                'color' => 'yellow',
                'description' => 'Preferensi Anda cukup konsisten',
                'icon' => '○'
            ];
        } else {
            return [
                'level' => 'Needs Review',
                'color' => 'red',
                'description' => 'Preferensi Anda perlu dikalibrasi ulang',
                'icon' => '⚠'
            ];
        }
    }
    
    private function calculateConfidenceScore(float $cr): float
    {
        // Convert CR to confidence score (0-100)
        // CR = 0 → Confidence = 100
        // CR = 0.1 → Confidence = 90
        // CR = 0.2 → Confidence = 70
        // CR > 0.3 → Confidence < 50
        
        if ($cr <= 0.1) {
            return round(100 - ($cr * 100), 1);
        } else {
            return round(max(0, 90 - ($cr * 200)), 1);
        }
    }
}
```

---

## ⚙️ PHASE 4: HYBRID ALGORITHMIC COMPUTATION

### 4.1 Multi-Algorithm Hybrid Engine

```php
// app/Services/DecisionSupport/HybridRecommendationEngine.php
<?php

namespace App\Services\DecisionSupport;

use App\Services\DecisionSupport\TopsisService;
use App\Services\DecisionSupport\ProfileMatchingService;
use App\Services\DecisionSupport\MahalanobisService;
use App\Services\MachineLearning\SuccessPredictionService;

class HybridRecommendationEngine
{
    public function __construct(
        private TopsisService $topsis,
        private ProfileMatchingService $profileMatching,
        private MahalanobisService $mahalanobis,
        private SuccessPredictionService $mlPredictor
    ) {}
    
    public function generateRecommendations(
        array $userProfile,
        array $ahpWeights,
        array $majors
    ): array {
        // Algorithm 1: TOPSIS with Euclidean Distance
        $topsisResults = $this->topsis->calculate(
            $majors,
            $ahpWeights,
            $userProfile
        );
        
        // Algorithm 2: Profile Matching (Gap Analysis)
        $profileMatchingResults = $this->profileMatching->calculate(
            $userProfile,
            $majors
        );
        
        // Algorithm 3: TOPSIS with Mahalanobis Distance
        $mahalanobisResults = $this->mahalanobis->calculate(
            $majors,
            $ahpWeights,
            $userProfile
        );
        
        // Algorithm 4: Machine Learning Prediction
        $mlResults = $this->mlPredictor->predictSuccess(
            $userProfile,
            $majors
        );
        
        // Hybrid Scoring: Weighted combination
        $hybridScores = $this->combineAlgorithms(
            $topsisResults,
            $profileMatchingResults,
            $mahalanobisResults,
            $mlResults
        );
        
        // Rank and return
        arsort($hybridScores);
        
        return $this->formatResults($hybridScores, [
            'topsis' => $topsisResults,
            'profile_matching' => $profileMatchingResults,
            'mahalanobis' => $mahalanobisResults,
            'ml_prediction' => $mlResults
        ]);
    }
    
    private function combineAlgorithms(
        array $topsis,
        array $profileMatching,
        array $mahalanobis,
        array $ml
    ): array {
        $weights = [
            'topsis' => 0.30,           // 30%
            'profile_matching' => 0.25,  // 25%
            'mahalanobis' => 0.20,      // 20%
            'ml_prediction' => 0.25      // 25%
        ];
        
        $hybridScores = [];
        
        foreach ($topsis as $majorId => $topsisScore) {
            $hybridScores[$majorId] = 
                ($weights['topsis'] * $topsisScore) +
                ($weights['profile_matching'] * $profileMatching[$majorId]) +
                ($weights['mahalanobis'] * $mahalanobis[$majorId]) +
                ($weights['ml_prediction'] * $ml[$majorId]);
        }
        
        return $hybridScores;
    }
    
    private function formatResults(array $hybridScores, array $algorithmResults): array
    {
        $results = [];
        $rank = 1;
        
        foreach ($hybridScores as $majorId => $score) {
            $results[] = [
                'rank' => $rank++,
                'major_id' => $majorId,
                'final_score' => round($score, 4),
                'algorithm_breakdown' => [
                    'topsis' => round($algorithmResults['topsis'][$majorId], 4),
                    'profile_matching' => round($algorithmResults['profile_matching'][$majorId], 4),
                    'mahalanobis' => round($algorithmResults['mahalanobis'][$majorId], 4),
                    'ml_prediction' => round($algorithmResults['ml_prediction'][$majorId], 4)
                ],
                'consensus_score' => $this->calculateConsensus($majorId, $algorithmResults)
            ];
        }
        
        return $results;
    }
    
    private function calculateConsensus(int $majorId, array $algorithmResults): float
    {
        // Calculate how much algorithms agree on this major
        $ranks = [];
        
        foreach ($algorithmResults as $algorithm => $scores) {
            arsort($scores);
            $ranks[$algorithm] = array_search($majorId, array_keys($scores)) + 1;
        }
        
        // Lower average rank = higher consensus
        $avgRank = array_sum($ranks) / count($ranks);
        $consensusScore = max(0, 100 - ($avgRank * 5));
        
        return round($consensusScore, 1);
    }
}
```

### 4.2 Profile Matching Service (Gap Analysis)

```php
// app/Services/DecisionSupport/ProfileMatchingService.php
<?php

namespace App\Services\DecisionSupport;

class ProfileMatchingService
{
    private const CORE_FACTOR_WEIGHT = 0.60;
    private const SECONDARY_FACTOR_WEIGHT = 0.40;
    
    private array $factorDefinitions = [
        'Kedokteran' => [
            'core' => ['kemampuan_analitis', 'kesiapan_akademik', 'konsistensi'],
            'secondary' => ['minat_bidang', 'toleransi_biaya']
        ],
        'Teknik Informatika' => [
            'core' => ['kemampuan_logika', 'kemampuan_analitis'],
            'secondary' => ['minat_bidang', 'kesiapan_akademik', 'konsistensi']
        ],
        'Psikologi' => [
            'core' => ['minat_bidang', 'konsistensi'],
            'secondary' => ['kemampuan_analitis', 'kesiapan_akademik']
        ],
        // ... define for all 38 majors
    ];
    
    public function calculate(array $userProfile, array $majors): array
    {
        $scores = [];
        
        foreach ($majors as $major) {
            $gaps = $this->calculateGaps($userProfile, $major);
            $gapValues = $this->mapGapsToValues($gaps);
            
            $factorTypes = $this->factorDefinitions[$major['name']] ?? [
                'core' => ['kemampuan_analitis', 'kesiapan_akademik'],
                'secondary' => ['minat_bidang', 'konsistensi']
            ];
            
            $scores[$major['id']] = $this->calculateProfileScore($gapValues, $factorTypes);
        }
        
        // Normalize to 0-1 scale
        $max = max($scores);
        $min = min($scores);
        
        foreach ($scores as $id => $score) {
            $scores[$id] = ($score - $min) / ($max - $min);
        }
        
        return $scores;
    }
    
    private function calculateGaps(array $userProfile, array $major): array
    {
        $gaps = [];
        
        foreach ($userProfile as $criterion => $userValue) {
            $requiredValue = $major['thresholds'][$criterion] ?? 70;
            $gaps[$criterion] = $userValue - $requiredValue;
        }
        
        return $gaps;
    }
    
    private function mapGapsToValues(array $gaps): array
    {
        $values = [];
        
        foreach ($gaps as $criterion => $gap) {
            if ($gap >= 0) {
                $values[$criterion] = 5.0;  // Perfect/Exceed
            } elseif ($gap >= -10) {
                $values[$criterion] = 4.5;  // Slight deficit
            } elseif ($gap >= -20) {
                $values[$criterion] = 4.0;  // Moderate deficit
            } elseif ($gap >= -30) {
                $values[$criterion] = 3.5;  // Significant deficit
            } elseif ($gap >= -40) {
                $values[$criterion] = 3.0;  // Major deficit
            } else {
                $values[$criterion] = 2.0;  // Critical deficit
            }
        }
        
        return $values;
    }
    
    private function calculateProfileScore(array $gapValues, array $factorTypes): float
    {
        $coreFactors = array_intersect_key($gapValues, array_flip($factorTypes['core']));
        $secondaryFactors = array_intersect_key($gapValues, array_flip($factorTypes['secondary']));
        
        $ncf = count($coreFactors) > 0 ? array_sum($coreFactors) / count($coreFactors) : 0;
        $nsf = count($secondaryFactors) > 0 ? array_sum($secondaryFactors) / count($secondaryFactors) : 0;
        
        return (self::CORE_FACTOR_WEIGHT * $ncf) + (self::SECONDARY_FACTOR_WEIGHT * $nsf);
    }
}
```

