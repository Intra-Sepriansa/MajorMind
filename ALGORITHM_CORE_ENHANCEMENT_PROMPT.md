# 🧠 MAJORMIND ALGORITHM CORE ENHANCEMENT PROMPT
## Enterprise-Grade Decision Support System: Advanced Algorithmic Architecture

---

## 🎯 OBJECTIVE
Transform MajorMind from a solid AHP-TOPSIS hybrid system into an **unparalleled, enterprise-grade Decision Support System (DSS)** with:
- Psychometric precision eliminating self-reporting bias
- Multi-algorithm hybridization for maximum accuracy
- Evidence-based empirical data foundation
- Explainable AI transparency
- Industrial-scale performance optimization

---

## 📊 PILAR 1: PSYCHOMETRIC PRECISION ENGINE

### 1.1 Eliminate Self-Reporting Bias via Validated Instruments

**Current Limitation**: Manual slider input (1-100) for Minat, Logika, Konsistensi is vulnerable to overestimation bias.

**IMPLEMENTATION REQUIREMENTS**:

#### A. Holland RIASEC Integration for Interest Profiling
```php
// Replace slider with validated psychometric instrument
class RiasecAssessment {
    // 48-item questionnaire mapping to 6 personality types
    private array $dimensions = [
        'Realistic' => ['hands_on', 'mechanical', 'physical'],
        'Investigative' => ['analytical', 'scientific', 'abstract'],
        'Artistic' => ['creative', 'expressive', 'unstructured'],
        'Social' => ['helping', 'teaching', 'collaborative'],
        'Enterprising' => ['persuading', 'leading', 'competitive'],
        'Conventional' => ['organizing', 'detail_oriented', 'systematic']
    ];
    
    public function calculateProfile(array $responses): array {
        // Compute hexagonal RIASEC profile
        // Map to major compatibility matrix
        // Return normalized 1-100 score per dimension
    }
}
```

**Major Mapping Logic**:
- Kedokteran: High Investigative (85+) + Social (80+)
- Teknik Informatika: Investigative (90+) + Realistic (75+)
- Desain Komunikasi Visual: Artistic (90+) + Enterprising (70+)
- Psikologi: Social (85+) + Investigative (80+)

#### B. Computerized Adaptive Testing (CAT) for Logic Assessment
```php
class AdaptiveLogicTest {
    // Item Response Theory (IRT) - 3 Parameter Logistic Model
    public function generateNextItem(float $currentTheta): array {
        // θ (theta) = estimated ability level
        // Select item with maximum information at current θ
        $item = $this->selectOptimalItem($currentTheta);
        
        return [
            'question' => $item->content,
            'difficulty' => $item->b_parameter,  // -3 to +3
            'discrimination' => $item->a_parameter,  // 0 to 2
            'guessing' => $item->c_parameter  // 0 to 0.35
        ];
    }
    
    private function calculateProbability(float $theta, Item $item): float {
        // P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
        $exponent = -$item->a * ($theta - $item->b);
        return $item->c + (1 - $item->c) / (1 + exp($exponent));
    }
    
    public function estimateAbility(array $responses): float {
        // Maximum Likelihood Estimation (MLE)
        // Return θ converted to 1-100 scale
    }
}
```


**Adaptive Testing Flow**:
1. Start with medium difficulty (θ = 0)
2. If correct → increase difficulty, if wrong → decrease
3. Stop after 15-20 items when Standard Error < 0.3
4. Final θ score maps to Kemampuan Logika (1-100)

#### C. Grit Scale for Consistency/Persistence Measurement
```php
class GritScaleAssessment {
    // 12-item Short Grit Scale (Grit-S)
    private array $items = [
        'perseverance_of_effort' => [
            'Saya menyelesaikan apa yang saya mulai',
            'Saya adalah pekerja keras',
            'Saya tekun dalam mencapai tujuan jangka panjang',
            // ... 3 more items
        ],
        'consistency_of_interest' => [
            'Minat saya berubah dari tahun ke tahun (reverse)',
            'Saya fokus pada satu tujuan untuk waktu lama',
            // ... 4 more items
        ]
    ];
    
    public function calculateGritScore(array $responses): float {
        // 5-point Likert scale (1-5)
        // Average across 12 items
        // Convert to 1-100 scale
        $rawScore = array_sum($responses) / count($responses);
        return ($rawScore - 1) * 25; // Maps 1-5 to 0-100
    }
}
```

---

## 🔬 PILAR 2: HYBRID ALGORITHM ARCHITECTURE

### 2.1 Profile Matching Integration (Gap Analysis)

**Enhancement**: Add Profile Matching as parallel evaluation alongside TOPSIS Euclidean distance.

```php
class ProfileMatchingEngine {
    private const CORE_FACTOR_WEIGHT = 0.60;  // 60%
    private const SECONDARY_FACTOR_WEIGHT = 0.40;  // 40%
    
    public function calculateGap(array $userProfile, array $majorThreshold): array {
        $gaps = [];
        foreach ($majorThreshold as $criterion => $required) {
            $gap = $userProfile[$criterion] - $required;
            $gaps[$criterion] = [
                'raw_gap' => $gap,
                'gap_value' => $this->mapGapToValue($gap)
            ];
        }
        return $gaps;
    }
    
    private function mapGapToValue(float $gap): float {
        // Gap Mapping Table
        if ($gap >= 0) return 5.0;      // Perfect/Exceed
        if ($gap >= -10) return 4.5;    // Slight deficit
        if ($gap >= -20) return 4.0;    // Moderate deficit
        if ($gap >= -30) return 3.5;    // Significant deficit
        if ($gap >= -40) return 3.0;    // Major deficit
        return 2.0;                      // Critical deficit
    }
    
    public function calculateProfileScore(array $gaps, array $factorTypes): float {
        $coreFactors = array_filter($gaps, fn($k) => 
            in_array($k, $factorTypes['core']), ARRAY_FILTER_USE_KEY);
        $secondaryFactors = array_filter($gaps, fn($k) => 
            in_array($k, $factorTypes['secondary']), ARRAY_FILTER_USE_KEY);
        
        $NCF = array_sum(array_column($coreFactors, 'gap_value')) / count($coreFactors);
        $NSF = array_sum(array_column($secondaryFactors, 'gap_value')) / count($secondaryFactors);
        
        return (self::CORE_FACTOR_WEIGHT * $NCF) + (self::SECONDARY_FACTOR_WEIGHT * $NSF);
    }
}
```

**Core vs Secondary Factor Definition**:
```php
$factorDefinitions = [
    'Kedokteran' => [
        'core' => ['kemampuan_analitis', 'kesiapan_akademik', 'konsistensi'],
        'secondary' => ['minat_bidang', 'toleransi_biaya']
    ],
    'Teknik Informatika' => [
        'core' => ['kemampuan_logika', 'kemampuan_analitis'],
        'secondary' => ['minat_bidang', 'kesiapan_akademik', 'konsistensi']
    ],
    // ... define for all 38 majors
];
```

### 2.2 Mahalanobis Distance for Rank-Stagnation Prevention

**Problem**: With 38 alternatives, Euclidean distance produces very close scores (0.867 vs 0.865), causing rank instability.

**Solution**: Replace Euclidean with Mahalanobis distance that accounts for correlation and variance.

```php
class MahalanobisDistanceCalculator {
    public function calculate(array $alternative, array $ideal, array $covarianceMatrix): float {
        // D² = (x - μ)ᵀ Σ⁻¹ (x - μ)
        $diff = $this->vectorSubtract($alternative, $ideal);
        $invCov = $this->invertMatrix($covarianceMatrix);
        
        $mahalanobis = $this->matrixMultiply(
            $this->matrixMultiply($diff, $invCov),
            $this->transpose($diff)
        );
        
        return sqrt($mahalanobis);
    }
    
    private function buildCovarianceMatrix(array $decisionMatrix): array {
        // Calculate covariance between all criteria pairs
        // Returns n×n symmetric matrix
    }
}
```

### 2.3 Dynamic Behavioral Matrix Injection

**Enhancement**: Inject behavioral profile (Minat, Logika, Konsistensi) as criteria WITHIN TOPSIS, not just as final multiplier.

```php
class EnhancedTopsisEngine {
    public function buildDecisionMatrix(
        array $majors,
        array $institutionalCriteria,
        array $behavioralProfile
    ): array {
        $matrix = [];
        
        foreach ($majors as $major) {
            $row = [
                // Institutional criteria (from database)
                'kesiapan_akademik' => $major->academic_threshold,
                'persaingan' => $major->competition_level,
                'prospek_karir' => $major->career_outlook,
                'akreditasi' => $major->accreditation_score,
                
                // Behavioral criteria (user-specific)
                'minat_alignment' => $this->calculateInterestAlignment(
                    $behavioralProfile['minat'], 
                    $major->interest_profile
                ),
                'logika_fit' => $this->calculateLogicFit(
                    $behavioralProfile['logika'],
                    $major->logic_requirement
                ),
                'konsistensi_match' => $behavioralProfile['konsistensi']
            ];
            
            $matrix[$major->id] = $row;
        }
        
        return $matrix;
    }
}
```

---

## 📈 PILAR 3: EVIDENCE-BASED DATA FOUNDATION

### 3.1 Curriculum Mining for Threshold Validation

**Objective**: Replace expert judgment with empirical curriculum analysis.

```php
class CurriculumMiningEngine {
    public function analyzeSyllabus(string $majorCode, string $university): array {
        // Scrape or parse curriculum data
        $courses = $this->fetchCourses($majorCode, $university);
        
        $analysis = [
            'total_sks' => 0,
            'quantitative_sks' => 0,
            'qualitative_sks' => 0,
            'practical_sks' => 0,
            'theoretical_sks' => 0
        ];
        
        foreach ($courses as $course) {
            $analysis['total_sks'] += $course->sks;
            
            // Classify course type using keyword matching
            if ($this->isQuantitative($course->name)) {
                $analysis['quantitative_sks'] += $course->sks;
            }
            
            if ($this->isPractical($course->type)) {
                $analysis['practical_sks'] += $course->sks;
            }
        }
        
        return [
            'kemampuan_analitis_score' => 
                ($analysis['quantitative_sks'] / $analysis['total_sks']) * 100,
            'kemampuan_logika_score' => 
                $this->calculateLogicIntensity($courses),
            'practical_orientation' => 
                ($analysis['practical_sks'] / $analysis['total_sks']) * 100
        ];
    }
    
    private function isQuantitative(string $courseName): bool {
        $keywords = ['matematika', 'statistik', 'kalkulus', 'aljabar', 
                     'algoritma', 'komputasi', 'numerik'];
        return $this->containsKeywords($courseName, $keywords);
    }
}
```

**Data Sources**:
- UI: https://academic.ui.ac.id/main/Kurikulum
- ITB: https://www.itb.ac.id/kurikulum
- UGM: https://simaster.ugm.ac.id/kurikulum

### 3.2 Machine Learning Readiness Architecture

**Phase 1: Data Warehouse Design**
```sql
-- Store historical assessment data
CREATE TABLE ml_training_data (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    assessment_date TIMESTAMP,
    
    -- Input features
    riasec_realistic FLOAT,
    riasec_investigative FLOAT,
    riasec_artistic FLOAT,
    riasec_social FLOAT,
    riasec_enterprising FLOAT,
    riasec_conventional FLOAT,
    logic_theta_score FLOAT,
    grit_score FLOAT,
    academic_gpa FLOAT,
    
    -- Criteria weights (AHP output)
    weight_academic JSON,
    weight_competition JSON,
    weight_career JSON,
    weight_cost JSON,
    
    -- Recommendation output
    recommended_major_1 VARCHAR(100),
    recommended_major_2 VARCHAR(100),
    recommended_major_3 VARCHAR(100),
    topsis_score_1 FLOAT,
    
    -- Outcome tracking (collected after 1-2 years)
    actual_major_chosen VARCHAR(100),
    enrollment_status ENUM('enrolled', 'dropped', 'transferred', 'graduated'),
    academic_performance FLOAT,  -- GPA after 2 semesters
    satisfaction_score FLOAT,    -- 1-10 survey
    
    INDEX idx_outcome (enrollment_status, academic_performance)
);
```

**Phase 2: Predictive Model Training**
```python
# Random Forest for dropout prediction
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

class MajorSuccessPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=500,
            max_depth=15,
            min_samples_split=20,
            class_weight='balanced'
        )
    
    def train(self, training_data: pd.DataFrame):
        features = [
            'riasec_realistic', 'riasec_investigative', 'riasec_artistic',
            'riasec_social', 'riasec_enterprising', 'riasec_conventional',
            'logic_theta_score', 'grit_score', 'academic_gpa',
            'major_logic_requirement', 'major_academic_threshold'
        ]
        
        X = training_data[features]
        y = training_data['enrollment_status'].map({
            'graduated': 1,
            'enrolled': 1,
            'transferred': 0,
            'dropped': 0
        })
        
        self.model.fit(X, y)
        
        # Feature importance analysis
        importance = pd.DataFrame({
            'feature': features,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return importance
    
    def predict_success_probability(self, user_profile: dict, major: dict) -> float:
        features = self._prepare_features(user_profile, major)
        return self.model.predict_proba([features])[0][1]  # Probability of success
```


**Phase 3: Hybrid AI-TOPSIS Integration**
```php
class HybridRecommendationEngine {
    public function generateRecommendations(
        array $userProfile,
        TopsisEngine $topsis,
        MLPredictor $mlModel
    ): array {
        // Traditional TOPSIS ranking
        $topsisResults = $topsis->calculate($userProfile);
        
        // ML-based success prediction
        $mlPredictions = [];
        foreach ($topsisResults as $major) {
            $mlPredictions[$major['id']] = $mlModel->predictSuccess(
                $userProfile,
                $major
            );
        }
        
        // Hybrid scoring: 60% TOPSIS + 40% ML prediction
        $hybridScores = [];
        foreach ($topsisResults as $major) {
            $hybridScores[$major['id']] = 
                (0.60 * $major['topsis_score']) + 
                (0.40 * $mlPredictions[$major['id']]);
        }
        
        arsort($hybridScores);
        return $hybridScores;
    }
}
```

---

## 🔍 PILAR 4: EXPLAINABLE AI (XAI) LAYER

### 4.1 Natural Language Generation (NLG) for Result Explanation

```php
class ExplanationGenerator {
    public function generateNarrative(
        array $userProfile,
        array $topRecommendation,
        array $ahpWeights,
        array $criteriaScores
    ): string {
        $major = $topRecommendation['major_name'];
        $score = round($topRecommendation['final_score'] * 100, 1);
        
        // Identify strongest alignment
        $strongestCriterion = $this->findStrongestAlignment($ahpWeights, $criteriaScores);
        $weakestCriterion = $this->findWeakestAlignment($ahpWeights, $criteriaScores);
        
        // Identify compensating factors
        $compensations = $this->findCompensatingFactors(
            $userProfile,
            $topRecommendation,
            $weakestCriterion
        );
        
        $narrative = "MajorMind sangat merekomendasikan jurusan **{$major}** dengan tingkat kesesuaian **{$score}%**.\n\n";
        
        $narrative .= "**Mengapa jurusan ini cocok untuk Anda?**\n";
        $narrative .= "• Prioritas utama Anda pada **{$strongestCriterion['name']}** ";
        $narrative .= "(bobot AHP: {$strongestCriterion['weight']}%) sangat sejalan dengan ";
        $narrative .= "karakteristik jurusan ini (skor: {$strongestCriterion['major_score']}/100).\n\n";
        
        if ($compensations) {
            $narrative .= "• Meskipun Anda memiliki kelemahan minor pada **{$weakestCriterion['name']}** ";
            $narrative .= "(skor Anda: {$weakestCriterion['user_score']}/100), hal ini dikompensasi oleh:\n";
            foreach ($compensations as $comp) {
                $narrative .= "  - {$comp['description']}\n";
            }
        }
        
        $narrative .= "\n**Profil Psikologis Anda:**\n";
        $narrative .= $this->generateRiasecNarrative($userProfile['riasec']);
        
        $narrative .= "\n**Prediksi Keberhasilan:**\n";
        $narrative .= "Berdasarkan analisis data historis dari {$this->getHistoricalSampleSize()} mahasiswa, ";
        $narrative .= "profil Anda memiliki probabilitas keberhasilan **{$topRecommendation['ml_success_rate']}%** ";
        $narrative .= "untuk menyelesaikan studi di jurusan ini dengan performa akademik yang baik.";
        
        return $narrative;
    }
    
    private function generateRiasecNarrative(array $riasec): string {
        $dominant = array_keys($riasec, max($riasec))[0];
        
        $descriptions = [
            'Investigative' => 'Anda memiliki kepribadian **Investigative** yang kuat, menunjukkan ketertarikan pada analisis mendalam, penelitian ilmiah, dan pemecahan masalah kompleks.',
            'Artistic' => 'Profil **Artistic** Anda menunjukkan kecenderungan pada ekspresi kreatif, inovasi, dan pemikiran non-konvensional.',
            'Social' => 'Kepribadian **Social** Anda mengindikasikan kemampuan interpersonal yang baik dan keinginan untuk membantu orang lain.',
            'Enterprising' => 'Tipe **Enterprising** Anda menunjukkan jiwa kepemimpinan, persuasi, dan orientasi pada pencapaian.',
            'Conventional' => 'Profil **Conventional** Anda mencerminkan preferensi pada struktur, organisasi, dan detail.',
            'Realistic' => 'Kepribadian **Realistic** Anda menunjukkan kecenderungan pada aktivitas praktis dan hands-on.'
        ];
        
        return $descriptions[$dominant] ?? '';
    }
}
```

### 4.2 Sensitivity Analysis (What-If Simulation)

```php
class SensitivityAnalyzer {
    public function performWhatIfAnalysis(
        array $userProfile,
        array $currentWeights,
        string $criterionToModify,
        float $percentageChange
    ): array {
        $results = [];
        
        // Simulate weight changes from -20% to +20%
        for ($delta = -20; $delta <= 20; $delta += 5) {
            $modifiedWeights = $this->adjustWeight(
                $currentWeights,
                $criterionToModify,
                $delta
            );
            
            // Recalculate TOPSIS with modified weights
            $newRanking = $this->recalculateTopsis($userProfile, $modifiedWeights);
            
            $results[] = [
                'weight_change' => $delta,
                'modified_weights' => $modifiedWeights,
                'top_3_majors' => array_slice($newRanking, 0, 3),
                'rank_reversal_detected' => $this->detectRankReversal(
                    $this->originalRanking,
                    $newRanking
                )
            ];
        }
        
        return [
            'stability_score' => $this->calculateStabilityScore($results),
            'critical_threshold' => $this->findCriticalThreshold($results),
            'simulation_results' => $results
        ];
    }
    
    private function calculateStabilityScore(array $results): float {
        // Count how many simulations maintain top recommendation
        $stableCount = 0;
        $originalTop = $this->originalRanking[0];
        
        foreach ($results as $result) {
            if ($result['top_3_majors'][0]['id'] === $originalTop['id']) {
                $stableCount++;
            }
        }
        
        return ($stableCount / count($results)) * 100;
    }
    
    private function findCriticalThreshold(array $results): ?array {
        // Find minimum weight change that causes rank reversal
        foreach ($results as $result) {
            if ($result['rank_reversal_detected']) {
                return [
                    'threshold' => $result['weight_change'],
                    'new_top_major' => $result['top_3_majors'][0]['name']
                ];
            }
        }
        return null;
    }
}
```

### 4.3 Visual Explanation Dashboard

```php
class VisualizationEngine {
    public function generateExplanationCharts(array $data): array {
        return [
            'criteria_contribution' => $this->createWaterfallChart($data),
            'profile_radar' => $this->createRadarChart($data),
            'sensitivity_heatmap' => $this->createSensitivityHeatmap($data),
            'decision_tree' => $this->createDecisionTreeVisualization($data),
            'comparison_matrix' => $this->createComparisonMatrix($data)
        ];
    }
    
    private function createWaterfallChart(array $data): array {
        // Show how each criterion contributes to final score
        // Starting from base score, each criterion adds/subtracts
        return [
            'type' => 'waterfall',
            'data' => [
                ['label' => 'Base Score', 'value' => 50],
                ['label' => 'Kesiapan Akademik', 'value' => +15],
                ['label' => 'Prospek Karir', 'value' => +20],
                ['label' => 'Persaingan', 'value' => -5],
                ['label' => 'Biaya', 'value' => -3],
                ['label' => 'Minat Alignment', 'value' => +10],
                ['label' => 'Final Score', 'value' => 87]
            ]
        ];
    }
    
    private function createDecisionTreeVisualization(array $data): array {
        // Simplified decision tree showing key decision points
        return [
            'type' => 'tree',
            'root' => [
                'question' => 'Prioritas utama: Prospek Karir?',
                'user_answer' => 'Ya (bobot 45%)',
                'branches' => [
                    [
                        'question' => 'Kemampuan Logika > 80?',
                        'user_answer' => 'Ya (skor 85)',
                        'branches' => [
                            [
                                'question' => 'Toleransi Biaya Tinggi?',
                                'user_answer' => 'Sedang',
                                'result' => 'Kedokteran (87%)'
                            ]
                        ]
                    ]
                ]
            ]
        ];
    }
}
```

---

## ⚡ PILAR 5: SOFTWARE ENGINEERING & SCALABILITY

### 5.1 Microservice Architecture for Computational Offloading

**Problem**: PHP/Laravel is not optimized for heavy linear algebra operations (matrix multiplication, eigenvalue decomposition).

**Solution**: Decompose computation into Python FastAPI microservice.

```python
# computation_service.py (FastAPI Microservice)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
from scipy.linalg import eig
from typing import List, Dict

app = FastAPI()

class AHPRequest(BaseModel):
    comparison_matrix: List[List[float]]
    
class TOPSISRequest(BaseModel):
    decision_matrix: List[List[float]]
    weights: List[float]
    criteria_types: List[str]  # 'benefit' or 'cost'

@app.post("/ahp/calculate-weights")
async def calculate_ahp_weights(request: AHPRequest):
    try:
        matrix = np.array(request.comparison_matrix)
        
        # Calculate eigenvalues and eigenvectors
        eigenvalues, eigenvectors = eig(matrix)
        
        # Find principal eigenvector (corresponding to max eigenvalue)
        max_eigenvalue_index = np.argmax(eigenvalues.real)
        principal_eigenvector = eigenvectors[:, max_eigenvalue_index].real
        
        # Normalize to get priority weights
        weights = principal_eigenvector / principal_eigenvector.sum()
        
        # Calculate Consistency Ratio
        n = len(matrix)
        lambda_max = eigenvalues[max_eigenvalue_index].real
        ci = (lambda_max - n) / (n - 1)
        
        # Random Index lookup table
        ri_table = {3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41}
        ri = ri_table.get(n, 1.49)
        
        cr = ci / ri if ri > 0 else 0
        
        return {
            "weights": weights.tolist(),
            "lambda_max": float(lambda_max),
            "consistency_index": float(ci),
            "consistency_ratio": float(cr),
            "is_consistent": cr < 0.1
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/topsis/calculate-ranking")
async def calculate_topsis_ranking(request: TOPSISRequest):
    try:
        matrix = np.array(request.decision_matrix)
        weights = np.array(request.weights)
        
        # Normalize decision matrix (vector normalization)
        normalized = matrix / np.sqrt((matrix ** 2).sum(axis=0))
        
        # Apply weights
        weighted = normalized * weights
        
        # Determine ideal solutions
        ideal_positive = np.zeros(weighted.shape[1])
        ideal_negative = np.zeros(weighted.shape[1])
        
        for j, criterion_type in enumerate(request.criteria_types):
            if criterion_type == 'benefit':
                ideal_positive[j] = weighted[:, j].max()
                ideal_negative[j] = weighted[:, j].min()
            else:  # cost
                ideal_positive[j] = weighted[:, j].min()
                ideal_negative[j] = weighted[:, j].max()
        
        # Calculate distances
        distance_positive = np.sqrt(((weighted - ideal_positive) ** 2).sum(axis=1))
        distance_negative = np.sqrt(((weighted - ideal_negative) ** 2).sum(axis=1))
        
        # Calculate closeness coefficient
        closeness = distance_negative / (distance_positive + distance_negative)
        
        # Rank alternatives
        ranking = np.argsort(-closeness)  # Descending order
        
        return {
            "closeness_coefficients": closeness.tolist(),
            "ranking": ranking.tolist(),
            "ideal_positive": ideal_positive.tolist(),
            "ideal_negative": ideal_negative.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mahalanobis/calculate-distance")
async def calculate_mahalanobis_distance(
    alternative: List[float],
    ideal: List[float],
    covariance_matrix: List[List[float]]
):
    try:
        alt = np.array(alternative)
        ideal_arr = np.array(ideal)
        cov = np.array(covariance_matrix)
        
        # Calculate Mahalanobis distance
        diff = alt - ideal_arr
        inv_cov = np.linalg.inv(cov)
        distance = np.sqrt(diff.T @ inv_cov @ diff)
        
        return {"distance": float(distance)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Laravel Integration**:
```php
// app/Services/ComputationService.php
class ComputationService {
    private string $serviceUrl;
    
    public function __construct() {
        $this->serviceUrl = config('services.computation.url', 'http://localhost:8000');
    }
    
    public function calculateAHPWeights(array $comparisonMatrix): array {
        $response = Http::timeout(30)->post("{$this->serviceUrl}/ahp/calculate-weights", [
            'comparison_matrix' => $comparisonMatrix
        ]);
        
        if ($response->failed()) {
            throw new ComputationException('AHP calculation failed');
        }
        
        return $response->json();
    }
    
    public function calculateTOPSISRanking(
        array $decisionMatrix,
        array $weights,
        array $criteriaTypes
    ): array {
        $response = Http::timeout(30)->post("{$this->serviceUrl}/topsis/calculate-ranking", [
            'decision_matrix' => $decisionMatrix,
            'weights' => $weights,
            'criteria_types' => $criteriaTypes
        ]);
        
        if ($response->failed()) {
            throw new ComputationException('TOPSIS calculation failed');
        }
        
        return $response->json();
    }
}
```

### 5.2 Redis Caching Strategy for Performance

```php
class CachedRecommendationEngine {
    private Redis $redis;
    private const CACHE_TTL = 3600; // 1 hour
    
    public function getRecommendations(array $userProfile, array $weights): array {
        // Generate cache key from user profile and weights
        $cacheKey = $this->generateCacheKey($userProfile, $weights);
        
        // Try to get from cache
        $cached = $this->redis->get($cacheKey);
        if ($cached) {
            return json_decode($cached, true);
        }
        
        // Calculate if not cached
        $recommendations = $this->calculateRecommendations($userProfile, $weights);
        
        // Store in cache
        $this->redis->setex($cacheKey, self::CACHE_TTL, json_encode($recommendations));
        
        return $recommendations;
    }
    
    private function generateCacheKey(array $userProfile, array $weights): string {
        // Create deterministic hash from inputs
        $data = [
            'profile' => $userProfile,
            'weights' => $weights,
            'version' => config('app.algorithm_version') // Invalidate on algorithm changes
        ];
        
        return 'recommendation:' . md5(json_encode($data));
    }
    
    public function invalidateMajorCache(int $majorId): void {
        // Use Redis SCAN to find and delete all keys related to this major
        $pattern = "recommendation:*:major:{$majorId}:*";
        $this->redis->del($this->redis->keys($pattern));
    }
}
```

**Static Data Caching**:
```php
class MajorDataCache {
    public function getCachedMajorThresholds(): array {
        return Cache::tags(['majors', 'thresholds'])->remember(
            'major_thresholds_all',
            now()->addHours(24),
            function () {
                return Major::with('criteria')->get()->toArray();
            }
        );
    }
    
    public function invalidateMajorData(int $majorId): void {
        // Selective cache invalidation
        Cache::tags(['majors'])->flush();
    }
}
```

### 5.3 Database Query Optimization

```php
// Eager loading to prevent N+1 queries
class OptimizedAssessmentRepository {
    public function getAssessmentWithRecommendations(int $assessmentId): Assessment {
        return Assessment::with([
            'user:id,name,email',
            'recommendationResults' => function ($query) {
                $query->with('major:id,name,description,career_outlook')
                      ->orderBy('rank')
                      ->limit(10);
            },
            'recommendationResults.major.criteria'
        ])->findOrFail($assessmentId);
    }
    
    public function getMajorsWithCriteria(): Collection {
        // Use database views for complex aggregations
        return DB::table('majors_with_aggregated_criteria')
                 ->select('*')
                 ->get();
    }
}
```

**Database Indexing**:
```sql
-- Add composite indexes for common queries
CREATE INDEX idx_recommendations_assessment_rank 
ON recommendation_results(assessment_id, rank);

CREATE INDEX idx_assessments_user_created 
ON assessments(user_id, created_at DESC);

CREATE INDEX idx_majors_criteria_lookup 
ON major_criteria(major_id, criterion_id);

-- Materialized view for expensive aggregations
CREATE MATERIALIZED VIEW majors_with_aggregated_criteria AS
SELECT 
    m.id,
    m.name,
    m.description,
    JSON_OBJECT(
        'academic_threshold', mc1.value,
        'logic_requirement', mc2.value,
        'competition_level', mc3.value,
        'career_outlook', mc4.value
    ) as criteria_scores
FROM majors m
LEFT JOIN major_criteria mc1 ON m.id = mc1.major_id AND mc1.criterion_id = 1
LEFT JOIN major_criteria mc2 ON m.id = mc2.major_id AND mc2.criterion_id = 2
LEFT JOIN major_criteria mc3 ON m.id = mc3.major_id AND mc3.criterion_id = 3
LEFT JOIN major_criteria mc4 ON m.id = mc4.major_id AND mc4.criterion_id = 4;

-- Refresh materialized view daily
CREATE EVENT refresh_major_aggregations
ON SCHEDULE EVERY 1 DAY
DO REFRESH MATERIALIZED VIEW majors_with_aggregated_criteria;
```


---

## 🎓 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Months 1-2)
- [ ] Implement RIASEC assessment module
- [ ] Build Computerized Adaptive Testing (CAT) engine with IRT
- [ ] Integrate Grit Scale measurement
- [ ] Replace manual sliders with validated instruments
- [ ] Create psychometric validation study (n=100 pilot users)

### Phase 2: Algorithm Enhancement (Months 3-4)
- [ ] Implement Profile Matching (Gap Analysis) engine
- [ ] Add Mahalanobis distance calculation
- [ ] Inject behavioral criteria into TOPSIS matrix
- [ ] Conduct comparative analysis: Euclidean vs Mahalanobis
- [ ] Benchmark against baseline (current system)

### Phase 3: Data Foundation (Months 5-6)
- [ ] Build curriculum mining scraper for UI, ITB, UGM
- [ ] Validate threshold scores with empirical data
- [ ] Design ML data warehouse schema
- [ ] Implement data collection pipeline
- [ ] Create data governance policies

### Phase 4: Explainable AI (Months 7-8)
- [ ] Develop Natural Language Generation engine
- [ ] Build sensitivity analysis module
- [ ] Create visual explanation dashboard
- [ ] Implement waterfall charts, decision trees
- [ ] Conduct user testing for explanation clarity

### Phase 5: ML Integration (Months 9-12)
- [ ] Collect 1000+ historical assessment records
- [ ] Train Random Forest success prediction model
- [ ] Validate model with cross-validation (k=10)
- [ ] Implement hybrid TOPSIS-ML scoring
- [ ] A/B test hybrid vs pure TOPSIS

### Phase 6: Performance Optimization (Months 13-14)
- [ ] Build Python FastAPI microservice
- [ ] Migrate heavy computations to microservice
- [ ] Implement Redis caching layer
- [ ] Optimize database queries and indexing
- [ ] Load testing (simulate 10,000 concurrent users)

### Phase 7: Validation & Publication (Months 15-16)
- [ ] Conduct large-scale validation study (n=500)
- [ ] Compare against competing systems (SAW, WP, SMART)
- [ ] Calculate accuracy metrics (precision, recall, F1)
- [ ] Prepare academic publication
- [ ] Deploy to production

---

## 📊 EVALUATION METRICS

### Algorithmic Performance
```php
class AlgorithmEvaluator {
    public function evaluateAccuracy(array $predictions, array $actualOutcomes): array {
        $metrics = [
            'precision' => $this->calculatePrecision($predictions, $actualOutcomes),
            'recall' => $this->calculateRecall($predictions, $actualOutcomes),
            'f1_score' => 0,
            'mean_reciprocal_rank' => $this->calculateMRR($predictions, $actualOutcomes),
            'ndcg' => $this->calculateNDCG($predictions, $actualOutcomes)
        ];
        
        $metrics['f1_score'] = 2 * ($metrics['precision'] * $metrics['recall']) / 
                                   ($metrics['precision'] + $metrics['recall']);
        
        return $metrics;
    }
    
    private function calculateMRR(array $predictions, array $actualOutcomes): float {
        // Mean Reciprocal Rank: measures how high the correct answer appears
        $reciprocalRanks = [];
        
        foreach ($predictions as $userId => $predictedMajors) {
            $actualMajor = $actualOutcomes[$userId];
            $rank = array_search($actualMajor, array_column($predictedMajors, 'major_id'));
            
            if ($rank !== false) {
                $reciprocalRanks[] = 1 / ($rank + 1);
            } else {
                $reciprocalRanks[] = 0;
            }
        }
        
        return array_sum($reciprocalRanks) / count($reciprocalRanks);
    }
    
    private function calculateNDCG(array $predictions, array $actualOutcomes, int $k = 10): float {
        // Normalized Discounted Cumulative Gain
        $ndcgScores = [];
        
        foreach ($predictions as $userId => $predictedMajors) {
            $actualMajor = $actualOutcomes[$userId];
            
            // Calculate DCG
            $dcg = 0;
            foreach (array_slice($predictedMajors, 0, $k) as $i => $major) {
                $relevance = ($major['major_id'] === $actualMajor) ? 1 : 0;
                $dcg += $relevance / log($i + 2, 2); // log2(i+2)
            }
            
            // Calculate IDCG (ideal DCG)
            $idcg = 1 / log(2, 2); // Best case: correct answer at position 1
            
            $ndcgScores[] = $dcg / $idcg;
        }
        
        return array_sum($ndcgScores) / count($ndcgScores);
    }
}
```

### System Performance Benchmarks
```php
class PerformanceBenchmark {
    public function runBenchmark(): array {
        return [
            'ahp_calculation_time' => $this->benchmarkAHP(),
            'topsis_calculation_time' => $this->benchmarkTOPSIS(),
            'full_recommendation_time' => $this->benchmarkFullPipeline(),
            'concurrent_users_capacity' => $this->benchmarkConcurrency(),
            'cache_hit_rate' => $this->measureCacheEfficiency()
        ];
    }
    
    private function benchmarkAHP(): float {
        $iterations = 1000;
        $start = microtime(true);
        
        for ($i = 0; $i < $iterations; $i++) {
            $matrix = $this->generateRandomComparisonMatrix(4);
            $this->ahpService->calculateWeights($matrix);
        }
        
        $end = microtime(true);
        return ($end - $start) / $iterations * 1000; // ms per calculation
    }
    
    private function benchmarkConcurrency(): int {
        // Use Apache Bench or similar tool
        // ab -n 10000 -c 100 http://localhost/api/recommendations
        // Return max concurrent users before response time > 2s
    }
}
```

### User Satisfaction Metrics
```php
class UserSatisfactionTracker {
    public function trackSatisfaction(int $userId, int $assessmentId): void {
        // Send follow-up survey after 6 months
        $survey = [
            'did_you_enroll' => 'boolean',
            'enrolled_major' => 'string',
            'was_it_recommended' => 'boolean',
            'recommendation_rank' => 'integer',
            'satisfaction_score' => 'integer (1-10)',
            'would_recommend_system' => 'boolean',
            'academic_performance' => 'float (GPA)',
            'dropout_risk' => 'enum (low, medium, high)'
        ];
        
        // Store in ml_training_data for future model training
    }
    
    public function calculateNPS(): float {
        // Net Promoter Score
        $responses = $this->getSurveyResponses();
        
        $promoters = $responses->where('would_recommend_system', '>=', 9)->count();
        $detractors = $responses->where('would_recommend_system', '<=', 6)->count();
        $total = $responses->count();
        
        return (($promoters - $detractors) / $total) * 100;
    }
}
```

---

## 🔬 COMPARATIVE ANALYSIS FRAMEWORK

### Benchmark Against Alternative Methods

```php
class ComparativeAnalysis {
    public function compareAlgorithms(array $testData): array {
        $algorithms = [
            'AHP-TOPSIS (Current)' => new AhpTopsisEngine(),
            'AHP-TOPSIS-ProfileMatching (Enhanced)' => new EnhancedHybridEngine(),
            'SAW (Simple Additive Weighting)' => new SawEngine(),
            'WP (Weighted Product)' => new WpEngine(),
            'SMART (Simple Multi-Attribute Rating)' => new SmartEngine(),
            'ELECTRE' => new ElectreEngine(),
            'PROMETHEE' => new PrometheeEngine()
        ];
        
        $results = [];
        
        foreach ($algorithms as $name => $engine) {
            $start = microtime(true);
            $predictions = [];
            
            foreach ($testData as $user) {
                $predictions[$user['id']] = $engine->recommend($user['profile']);
            }
            
            $executionTime = microtime(true) - $start;
            
            $results[$name] = [
                'execution_time' => $executionTime,
                'accuracy' => $this->calculateAccuracy($predictions, $testData),
                'precision' => $this->calculatePrecision($predictions, $testData),
                'recall' => $this->calculateRecall($predictions, $testData),
                'f1_score' => $this->calculateF1($predictions, $testData),
                'mrr' => $this->calculateMRR($predictions, $testData),
                'user_satisfaction' => $this->getUserSatisfaction($predictions, $testData)
            ];
        }
        
        return $this->generateComparisonReport($results);
    }
    
    private function generateComparisonReport(array $results): array {
        // Statistical significance testing
        $report = [
            'summary_table' => $results,
            'best_algorithm' => $this->findBestAlgorithm($results),
            'statistical_tests' => [
                'anova' => $this->performANOVA($results),
                'tukey_hsd' => $this->performTukeyHSD($results)
            ],
            'visualization' => [
                'radar_chart' => $this->createRadarComparison($results),
                'box_plot' => $this->createBoxPlot($results)
            ]
        ];
        
        return $report;
    }
}
```

---

## 📚 ACADEMIC VALIDATION PROTOCOL

### Research Design for Thesis/Publication

```markdown
## Experimental Design

### Participants
- N = 500 high school students (SMK Multimedia graduates)
- Age range: 17-19 years
- Stratified sampling by academic performance (GPA tertiles)

### Procedure
1. **Baseline Assessment** (Week 0)
   - Administer RIASEC questionnaire
   - Conduct CAT logic test (IRT-based)
   - Measure Grit Scale
   - Collect academic transcripts

2. **System Intervention** (Week 1)
   - Group A (n=250): Enhanced MajorMind (with all 5 pillars)
   - Group B (n=250): Baseline MajorMind (current system)
   - Both groups receive top 10 recommendations

3. **Decision Making** (Week 2-4)
   - Participants select their actual major
   - Record: chosen major, decision confidence (1-10), time to decide

4. **Follow-up** (Month 6, 12, 24)
   - Enrollment status
   - Academic performance (GPA)
   - Satisfaction survey
   - Dropout/transfer status

### Hypotheses
- H1: Enhanced system will have higher recommendation accuracy (Top-3 hit rate)
- H2: Enhanced system will produce higher user satisfaction scores
- H3: Enhanced system will predict lower dropout rates
- H4: Enhanced system will show higher stability in sensitivity analysis

### Statistical Analysis
- Paired t-tests for within-group comparisons
- ANOVA for between-group comparisons
- Chi-square for categorical outcomes (enrollment status)
- Logistic regression for dropout prediction
- Cohen's d for effect sizes
```

### Publication-Ready Metrics

```php
class AcademicMetricsCalculator {
    public function generatePublicationMetrics(array $experimentalData): array {
        return [
            'descriptive_statistics' => [
                'sample_size' => count($experimentalData),
                'mean_age' => $this->calculateMean($experimentalData, 'age'),
                'gender_distribution' => $this->calculateDistribution($experimentalData, 'gender'),
                'gpa_distribution' => $this->calculateDistribution($experimentalData, 'gpa')
            ],
            
            'accuracy_metrics' => [
                'top_1_accuracy' => $this->calculateTopKAccuracy($experimentalData, 1),
                'top_3_accuracy' => $this->calculateTopKAccuracy($experimentalData, 3),
                'top_5_accuracy' => $this->calculateTopKAccuracy($experimentalData, 5),
                'mean_reciprocal_rank' => $this->calculateMRR($experimentalData),
                'ndcg_at_10' => $this->calculateNDCG($experimentalData, 10)
            ],
            
            'user_experience' => [
                'mean_satisfaction' => $this->calculateMean($experimentalData, 'satisfaction'),
                'decision_confidence' => $this->calculateMean($experimentalData, 'confidence'),
                'time_to_decide' => $this->calculateMean($experimentalData, 'decision_time'),
                'net_promoter_score' => $this->calculateNPS($experimentalData)
            ],
            
            'predictive_validity' => [
                'enrollment_rate' => $this->calculateRate($experimentalData, 'enrolled'),
                'dropout_rate' => $this->calculateRate($experimentalData, 'dropped_out'),
                'mean_gpa_after_1_year' => $this->calculateMean($experimentalData, 'gpa_year_1'),
                'correlation_predicted_actual' => $this->calculateCorrelation(
                    $experimentalData,
                    'predicted_success',
                    'actual_gpa'
                )
            ],
            
            'algorithm_robustness' => [
                'consistency_ratio_mean' => $this->calculateMean($experimentalData, 'cr'),
                'consistency_ratio_std' => $this->calculateStd($experimentalData, 'cr'),
                'sensitivity_stability_score' => $this->calculateStabilityScore($experimentalData),
                'rank_reversal_frequency' => $this->calculateRankReversalRate($experimentalData)
            ],
            
            'comparative_performance' => [
                'vs_saw' => $this->compareAgainst($experimentalData, 'SAW'),
                'vs_wp' => $this->compareAgainst($experimentalData, 'WP'),
                'vs_smart' => $this->compareAgainst($experimentalData, 'SMART'),
                'vs_random' => $this->compareAgainst($experimentalData, 'Random'),
                'vs_expert_counselor' => $this->compareAgainst($experimentalData, 'Human Expert')
            ],
            
            'statistical_significance' => [
                'p_value_accuracy' => $this->performTTest($experimentalData, 'accuracy'),
                'effect_size_cohens_d' => $this->calculateCohensD($experimentalData),
                'confidence_interval_95' => $this->calculateCI($experimentalData, 0.95)
            ]
        ];
    }
}
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Production Requirements

- [ ] **Security Audit**
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CSRF tokens
  - [ ] Rate limiting (100 requests/minute per user)
  - [ ] Data encryption at rest and in transit

- [ ] **Performance Testing**
  - [ ] Load test: 10,000 concurrent users
  - [ ] Stress test: Find breaking point
  - [ ] Endurance test: 24-hour sustained load
  - [ ] Response time < 2 seconds (95th percentile)

- [ ] **Data Privacy Compliance**
  - [ ] GDPR compliance (if applicable)
  - [ ] Indonesian data protection laws
  - [ ] User consent forms
  - [ ] Data retention policies
  - [ ] Right to deletion implementation

- [ ] **Monitoring & Observability**
  - [ ] Application Performance Monitoring (APM)
  - [ ] Error tracking (Sentry/Bugsnag)
  - [ ] Log aggregation (ELK stack)
  - [ ] Real-time dashboards
  - [ ] Alert thresholds

- [ ] **Documentation**
  - [ ] API documentation (OpenAPI/Swagger)
  - [ ] User manual
  - [ ] Administrator guide
  - [ ] Algorithm white paper
  - [ ] Code documentation

---

## 🎯 SUCCESS CRITERIA

### Quantitative Targets

| Metric | Baseline | Target | Stretch Goal |
|--------|----------|--------|--------------|
| Top-3 Accuracy | 45% | 70% | 85% |
| User Satisfaction | 6.5/10 | 8.0/10 | 9.0/10 |
| Dropout Prediction Accuracy | N/A | 75% | 85% |
| Response Time (p95) | 5s | 2s | 1s |
| Consistency Ratio Pass Rate | 70% | 90% | 95% |
| Cache Hit Rate | 0% | 80% | 90% |
| System Uptime | 95% | 99.5% | 99.9% |

### Qualitative Targets

- [ ] System recommendations are explainable to non-technical users
- [ ] Counselors trust and adopt the system
- [ ] Students report reduced decision anxiety
- [ ] Academic institutions request integration
- [ ] Published in peer-reviewed journal (Scopus/WoS indexed)

---

## 📖 REFERENCES & THEORETICAL FOUNDATION

### Key Academic Papers to Cite

1. **AHP Methodology**
   - Saaty, T. L. (1980). The Analytic Hierarchy Process. McGraw-Hill.
   - Saaty, T. L. (2008). Decision making with the analytic hierarchy process. International Journal of Services Sciences, 1(1), 83-98.

2. **TOPSIS Algorithm**
   - Hwang, C. L., & Yoon, K. (1981). Multiple Attribute Decision Making: Methods and Applications. Springer-Verlag.
   - Behzadian, M., et al. (2012). A state-of-the-art survey of TOPSIS applications. Expert Systems with Applications, 39(17), 13051-13069.

3. **Psychometric Instruments**
   - Holland, J. L. (1997). Making Vocational Choices: A Theory of Vocational Personalities and Work Environments. Psychological Assessment Resources.
   - Duckworth, A. L., & Quinn, P. D. (2009). Development and validation of the Short Grit Scale (Grit-S). Journal of Personality Assessment, 91(2), 166-174.

4. **Item Response Theory**
   - Embretson, S. E., & Reise, S. P. (2000). Item Response Theory for Psychologists. Lawrence Erlbaum Associates.
   - van der Linden, W. J., & Hambleton, R. K. (1997). Handbook of Modern Item Response Theory. Springer.

5. **Explainable AI**
   - Arrieta, A. B., et al. (2020). Explainable Artificial Intelligence (XAI): Concepts, taxonomies, opportunities and challenges toward responsible AI. Information Fusion, 58, 82-115.

6. **Educational Decision Support**
   - Nunes, I., et al. (2017). A systematic review of decision support systems for student career guidance. Computers & Education, 114, 18-30.

---

## 💡 INNOVATION HIGHLIGHTS

### Novel Contributions to the Field

1. **First hybrid AHP-TOPSIS-ProfileMatching-ML system** for educational decision-making in Indonesia
2. **Psychometric validation** of RIASEC and Grit Scale in Indonesian SMK context
3. **Curriculum mining methodology** for empirical threshold determination
4. **Explainable AI layer** making complex MCDM transparent to end-users
5. **Longitudinal validation** tracking actual student outcomes over 2 years
6. **Microservice architecture** for scalable MCDM computation
7. **Sensitivity analysis framework** for decision robustness verification

---

## 🎓 CONCLUSION

This enhanced MajorMind architecture represents a paradigm shift from traditional heuristic-based career counseling to **evidence-based, algorithmically-rigorous, psychometrically-validated, and explainable decision support**. By systematically addressing the five critical pillars—psychometric precision, algorithmic hybridization, empirical data foundation, explainable AI, and industrial scalability—the system transcends the limitations of conventional MCDM applications.

The integration of validated psychological instruments (RIASEC, IRT-based CAT, Grit Scale) eliminates self-reporting bias, while the hybrid algorithm architecture (AHP-TOPSIS-ProfileMatching-Mahalanobis) maximizes ranking accuracy and stability. The curriculum mining approach grounds recommendations in empirical academic requirements, and the machine learning layer enables continuous improvement through outcome tracking.

Most critically, the Explainable AI layer transforms the system from a "black box" into a transparent partner in the decision-making process, building user trust through natural language explanations, sensitivity analysis, and visual decision trees. The microservice architecture and Redis caching ensure the system can scale to serve Indonesia's 1.6 million annual SMK graduates without performance degradation.

This is not merely a decision support system—it is a **comprehensive educational navigation platform** that combines the rigor of operations research, the insights of psychology, the power of machine learning, and the clarity of explainable AI to guide students toward optimal educational trajectories.

**The future of educational decision-making is algorithmic, empirical, explainable, and adaptive. MajorMind embodies that future.**

---

*Document Version: 1.0*  
*Last Updated: 2026-03-25*  
*Classification: Technical Specification - Enterprise Architecture*
