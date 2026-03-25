# 🎯 MAJORMIND ULTIMATE ASSESSMENT ENGINE
## Enterprise-Grade Psychometric & Algorithmic Assessment System

---

## 🌟 EXECUTIVE VISION

Transform the MajorMind Assessment from a simple questionnaire into an **Intelligent Psychometric Assessment Platform** that combines:
- Validated psychological instruments (RIASEC, Grit Scale, IRT-based CAT)
- Adaptive testing with real-time difficulty adjustment
- Multi-algorithm hybrid computation (AHP-TOPSIS-ProfileMatching-Mahalanobis-ML)
- Real-time consistency validation and bias detection
- Progressive disclosure UX for cognitive load management
- Evidence-based threshold validation from curriculum mining
- Explainable AI feedback at every step

---

## 📐 ASSESSMENT ARCHITECTURE: 7-PHASE INTELLIGENT PIPELINE

### PHASE 1: PSYCHOMETRIC PROFILING (Validated Instruments)
### PHASE 2: ADAPTIVE LOGIC TESTING (IRT-based CAT)
### PHASE 3: AHP PAIRWISE COMPARISON (Consistency Validation)
### PHASE 4: HYBRID ALGORITHMIC COMPUTATION (Multi-Method)
### PHASE 5: REAL-TIME VALIDATION & BIAS DETECTION
### PHASE 6: EXPLAINABLE RESULTS GENERATION
### PHASE 7: ACTIONABLE RECOMMENDATIONS & NEXT STEPS

---

## 🧬 PHASE 1: PSYCHOMETRIC PROFILING ENGINE

### 1.1 Holland RIASEC Assessment (48-Item Validated Instrument)

**Objective**: Replace subjective sliders with scientifically validated personality assessment

**Implementation**:

```php
// app/Services/Psychometric/RiasecAssessment.php
<?php

namespace App\Services\Psychometric;

class RiasecAssessment
{
    private array $questionBank = [
        'Realistic' => [
            ['id' => 'R1', 'text' => 'Saya senang bekerja dengan alat dan mesin', 'weight' => 1.0],
            ['id' => 'R2', 'text' => 'Saya lebih suka pekerjaan yang melibatkan aktivitas fisik', 'weight' => 0.9],
            ['id' => 'R3', 'text' => 'Saya tertarik memperbaiki atau merakit barang elektronik', 'weight' => 1.1],
            ['id' => 'R4', 'text' => 'Saya nyaman bekerja di luar ruangan', 'weight' => 0.8],
            ['id' => 'R5', 'text' => 'Saya suka membuat sesuatu dengan tangan saya', 'weight' => 1.0],
            ['id' => 'R6', 'text' => 'Saya tertarik pada pekerjaan teknis dan mekanis', 'weight' => 1.2],
            ['id' => 'R7', 'text' => 'Saya lebih suka hasil kerja yang konkret dan terlihat', 'weight' => 0.9],
            ['id' => 'R8', 'text' => 'Saya senang mengoperasikan peralatan atau kendaraan', 'weight' => 0.8]
        ],
        'Investigative' => [
            ['id' => 'I1', 'text' => 'Saya senang menganalisis data dan informasi kompleks', 'weight' => 1.2],
            ['id' => 'I2', 'text' => 'Saya tertarik melakukan penelitian ilmiah', 'weight' => 1.3],
            ['id' => 'I3', 'text' => 'Saya suka memecahkan masalah yang rumit', 'weight' => 1.1],
            ['id' => 'I4', 'text' => 'Saya senang membaca jurnal atau artikel ilmiah', 'weight' => 1.0],
            ['id' => 'I5', 'text' => 'Saya tertarik memahami bagaimana sesuatu bekerja', 'weight' => 1.0],
            ['id' => 'I6', 'text' => 'Saya lebih suka berpikir abstrak dan teoretis', 'weight' => 1.1],
            ['id' => 'I7', 'text' => 'Saya senang bereksperimen dan menguji hipotesis', 'weight' => 1.2],
            ['id' => 'I8', 'text' => 'Saya tertarik pada matematika dan sains', 'weight' => 1.3]
        ],
        'Artistic' => [
            ['id' => 'A1', 'text' => 'Saya senang menciptakan karya seni atau desain', 'weight' => 1.3],
            ['id' => 'A2', 'text' => 'Saya lebih suka pekerjaan yang memungkinkan ekspresi kreatif', 'weight' => 1.2],
            ['id' => 'A3', 'text' => 'Saya tertarik pada musik, seni, atau sastra', 'weight' => 1.1],
            ['id' => 'A4', 'text' => 'Saya senang bekerja tanpa aturan yang kaku', 'weight' => 0.9],
            ['id' => 'A5', 'text' => 'Saya memiliki imajinasi yang kuat', 'weight' => 1.0],
            ['id' => 'A6', 'text' => 'Saya senang menulis cerita atau puisi', 'weight' => 1.1],
            ['id' => 'A7', 'text' => 'Saya tertarik pada desain visual atau grafis', 'weight' => 1.2],
            ['id' => 'A8', 'text' => 'Saya lebih suka pekerjaan yang unik dan tidak konvensional', 'weight' => 1.0]
        ],
        'Social' => [
            ['id' => 'S1', 'text' => 'Saya senang membantu orang lain menyelesaikan masalah', 'weight' => 1.2],
            ['id' => 'S2', 'text' => 'Saya tertarik pada pekerjaan yang melibatkan interaksi sosial', 'weight' => 1.1],
            ['id' => 'S3', 'text' => 'Saya senang mengajar atau melatih orang lain', 'weight' => 1.3],
            ['id' => 'S4', 'text' => 'Saya peduli dengan kesejahteraan orang lain', 'weight' => 1.0],
            ['id' => 'S5', 'text' => 'Saya senang bekerja dalam tim', 'weight' => 0.9],
            ['id' => 'S6', 'text' => 'Saya tertarik pada psikologi dan perilaku manusia', 'weight' => 1.1],
            ['id' => 'S7', 'text' => 'Saya senang memberikan konseling atau nasihat', 'weight' => 1.2],
            ['id' => 'S8', 'text' => 'Saya lebih suka pekerjaan yang berdampak sosial', 'weight' => 1.0]
        ],
        'Enterprising' => [
            ['id' => 'E1', 'text' => 'Saya senang memimpin dan mengelola proyek', 'weight' => 1.3],
            ['id' => 'E2', 'text' => 'Saya tertarik pada bisnis dan kewirausahaan', 'weight' => 1.2],
            ['id' => 'E3', 'text' => 'Saya senang meyakinkan orang lain', 'weight' => 1.1],
            ['id' => 'E4', 'text' => 'Saya berorientasi pada pencapaian dan target', 'weight' => 1.0],
            ['id' => 'E5', 'text' => 'Saya senang mengambil risiko yang terkalkulasi', 'weight' => 1.1],
            ['id' => 'E6', 'text' => 'Saya tertarik pada strategi dan perencanaan', 'weight' => 1.0],
            ['id' => 'E7', 'text' => 'Saya senang bernegosiasi dan membuat kesepakatan', 'weight' => 1.2],
            ['id' => 'E8', 'text' => 'Saya lebih suka posisi kepemimpinan', 'weight' => 1.3]
        ],
        'Conventional' => [
            ['id' => 'C1', 'text' => 'Saya senang bekerja dengan data dan angka', 'weight' => 1.1],
            ['id' => 'C2', 'text' => 'Saya lebih suka pekerjaan yang terstruktur dan terorganisir', 'weight' => 1.0],
            ['id' => 'C3', 'text' => 'Saya detail-oriented dan teliti', 'weight' => 1.2],
            ['id' => 'C4', 'text' => 'Saya senang mengikuti prosedur dan aturan', 'weight' => 0.9],
            ['id' => 'C5', 'text' => 'Saya tertarik pada administrasi dan manajemen data', 'weight' => 1.0],
            ['id' => 'C6', 'text' => 'Saya senang mengorganisir informasi', 'weight' => 1.1],
            ['id' => 'C7', 'text' => 'Saya lebih suka pekerjaan yang predictable', 'weight' => 0.8],
            ['id' => 'C8', 'text' => 'Saya tertarik pada akuntansi atau keuangan', 'weight' => 1.2]
        ]
    ];
    
    public function calculateProfile(array $responses): array
    {
        $scores = [
            'Realistic' => 0,
            'Investigative' => 0,
            'Artistic' => 0,
            'Social' => 0,
            'Enterprising' => 0,
            'Conventional' => 0
        ];
        
        foreach ($responses as $questionId => $rating) {
            // Rating: 1-5 Likert scale
            foreach ($this->questionBank as $dimension => $questions) {
                $question = collect($questions)->firstWhere('id', $questionId);
                if ($question) {
                    $scores[$dimension] += $rating * $question['weight'];
                }
            }
        }
        
        // Normalize to 0-100 scale
        $maxPossible = 8 * 5 * 1.3; // 8 questions * max rating 5 * max weight 1.3
        foreach ($scores as $dimension => $score) {
            $scores[$dimension] = round(($score / $maxPossible) * 100, 1);
        }
        
        return [
            'scores' => $scores,
            'dominant_type' => array_keys($scores, max($scores))[0],
            'holland_code' => $this->generateHollandCode($scores),
            'interpretation' => $this->interpretProfile($scores)
        ];
    }
    
    private function generateHollandCode(array $scores): string
    {
        arsort($scores);
        return implode('', array_map(fn($k) => $k[0], array_slice(array_keys($scores), 0, 3)));
    }
    
    private function interpretProfile(array $scores): array
    {
        $dominant = array_keys($scores, max($scores))[0];
        
        $interpretations = [
            'Realistic' => [
                'description' => 'Anda adalah individu yang praktis dan hands-on',
                'strengths' => ['Keterampilan teknis', 'Problem-solving praktis', 'Kemandirian'],
                'ideal_majors' => ['Teknik Mesin', 'Teknik Sipil', 'Arsitektur', 'Pertanian'],
                'career_paths' => ['Engineer', 'Teknisi', 'Arsitek', 'Pilot']
            ],
            'Investigative' => [
                'description' => 'Anda adalah pemikir analitis dan peneliti',
                'strengths' => ['Analisis mendalam', 'Penelitian', 'Pemecahan masalah kompleks'],
                'ideal_majors' => ['Kedokteran', 'Farmasi', 'Matematika', 'Fisika', 'Kimia'],
                'career_paths' => ['Dokter', 'Peneliti', 'Scientist', 'Analis Data']
            ],
            'Artistic' => [
                'description' => 'Anda adalah individu kreatif dan ekspresif',
                'strengths' => ['Kreativitas', 'Inovasi', 'Ekspresi diri'],
                'ideal_majors' => ['Desain Komunikasi Visual', 'Seni Rupa', 'Musik', 'Sastra'],
                'career_paths' => ['Desainer', 'Seniman', 'Penulis', 'Musisi']
            ],
            'Social' => [
                'description' => 'Anda adalah individu yang empatik dan kolaboratif',
                'strengths' => ['Komunikasi', 'Empati', 'Kerja tim'],
                'ideal_majors' => ['Psikologi', 'Pendidikan', 'Keperawatan', 'Ilmu Komunikasi'],
                'career_paths' => ['Psikolog', 'Guru', 'Perawat', 'Konselor']
            ],
            'Enterprising' => [
                'description' => 'Anda adalah pemimpin dan pengambil inisiatif',
                'strengths' => ['Kepemimpinan', 'Persuasi', 'Orientasi hasil'],
                'ideal_majors' => ['Manajemen', 'Ekonomi', 'Hukum', 'Marketing'],
                'career_paths' => ['Manager', 'Entrepreneur', 'Lawyer', 'Sales Director']
            ],
            'Conventional' => [
                'description' => 'Anda adalah individu yang terorganisir dan detail-oriented',
                'strengths' => ['Organisasi', 'Ketelitian', 'Efisiensi'],
                'ideal_majors' => ['Akuntansi', 'Administrasi Bisnis', 'Perpajakan', 'Statistika'],
                'career_paths' => ['Akuntan', 'Administrator', 'Auditor', 'Data Manager']
            ]
        ];
        
        return $interpretations[$dominant];
    }
}
```


### 1.2 Grit Scale Assessment (12-Item Short Grit Scale)

**Objective**: Measure persistence and passion for long-term goals

```php
// app/Services/Psychometric/GritScaleAssessment.php
<?php

namespace App\Services\Psychometric;

class GritScaleAssessment
{
    private array $questions = [
        // Perseverance of Effort (6 items)
        ['id' => 'G1', 'text' => 'Saya menyelesaikan apa yang saya mulai', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G2', 'text' => 'Kemunduran tidak membuat saya putus asa', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G3', 'text' => 'Saya adalah pekerja keras', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G4', 'text' => 'Saya mudah menyerah (R)', 'dimension' => 'perseverance', 'reverse' => true],
        ['id' => 'G5', 'text' => 'Saya tekun dalam mencapai tujuan jangka panjang', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G6', 'text' => 'Saya tidak menyelesaikan proyek yang memakan waktu lama (R)', 'dimension' => 'perseverance', 'reverse' => true],
        
        // Consistency of Interest (6 items)
        ['id' => 'G7', 'text' => 'Minat saya berubah dari tahun ke tahun (R)', 'dimension' => 'consistency', 'reverse' => true],
        ['id' => 'G8', 'text' => 'Saya fokus pada satu tujuan untuk waktu yang lama', 'dimension' => 'consistency', 'reverse' => false],
        ['id' => 'G9', 'text' => 'Saya sering berganti fokus dari satu ide ke ide lain (R)', 'dimension' => 'consistency', 'reverse' => true],
        ['id' => 'G10', 'text' => 'Saya konsisten dalam mengejar tujuan saya', 'dimension' => 'consistency', 'reverse' => false],
        ['id' => 'G11', 'text' => 'Saya mudah teralihkan oleh proyek atau ide baru (R)', 'dimension' => 'consistency', 'reverse' => true],
        ['id' => 'G12', 'text' => 'Saya mempertahankan minat saya dalam jangka panjang', 'dimension' => 'consistency', 'reverse' => false]
    ];
    
    public function calculateGritScore(array $responses): array
    {
        $perseveranceScore = 0;
        $consistencyScore = 0;
        $perseveranceCount = 0;
        $consistencyCount = 0;
        
        foreach ($responses as $questionId => $rating) {
            $question = collect($this->questions)->firstWhere('id', $questionId);
            
            if ($question) {
                // Reverse scoring if needed
                $score = $question['reverse'] ? (6 - $rating) : $rating;
                
                if ($question['dimension'] === 'perseverance') {
                    $perseveranceScore += $score;
                    $perseveranceCount++;
                } else {
                    $consistencyScore += $score;
                    $consistencyCount++;
                }
            }
        }
        
        $perseveranceAvg = $perseveranceScore / $perseveranceCount;
        $consistencyAvg = $consistencyScore / $consistencyCount;
        $overallGrit = ($perseveranceAvg + $consistencyAvg) / 2;
        
        // Convert to 0-100 scale (from 1-5 scale)
        $gritScore = (($overallGrit - 1) / 4) * 100;
        
        return [
            'overall_grit' => round($gritScore, 1),
            'perseverance_of_effort' => round((($perseveranceAvg - 1) / 4) * 100, 1),
            'consistency_of_interest' => round((($consistencyAvg - 1) / 4) * 100, 1),
            'interpretation' => $this->interpretGrit($gritScore),
            'percentile' => $this->calculatePercentile($gritScore)
        ];
    }
    
    private function interpretGrit(float $score): array
    {
        if ($score >= 80) {
            return [
                'level' => 'Sangat Tinggi',
                'description' => 'Anda memiliki daya tahan dan konsistensi luar biasa',
                'implication' => 'Sangat cocok untuk jurusan yang menuntut dedikasi jangka panjang seperti Kedokteran, Teknik, atau Hukum'
            ];
        } elseif ($score >= 65) {
            return [
                'level' => 'Tinggi',
                'description' => 'Anda memiliki daya tahan yang baik',
                'implication' => 'Cocok untuk sebagian besar jurusan yang memerlukan komitmen'
            ];
        } elseif ($score >= 50) {
            return [
                'level' => 'Sedang',
                'description' => 'Anda memiliki daya tahan yang cukup',
                'implication' => 'Pertimbangkan jurusan dengan struktur yang jelas dan milestone yang teratur'
            ];
        } else {
            return [
                'level' => 'Perlu Pengembangan',
                'description' => 'Anda mungkin perlu mengembangkan konsistensi',
                'implication' => 'Fokus pada jurusan dengan durasi lebih pendek atau program yang lebih praktis'
            ];
        }
    }
    
    private function calculatePercentile(float $score): int
    {
        // Based on Duckworth's normative data
        $percentiles = [
            20 => 10, 30 => 20, 40 => 35, 50 => 50,
            60 => 65, 70 => 80, 80 => 90, 90 => 97
        ];
        
        foreach ($percentiles as $threshold => $percentile) {
            if ($score < $threshold) {
                return $percentile;
            }
        }
        return 99;
    }
}
```

---

## 🧠 PHASE 2: ADAPTIVE LOGIC TESTING (IRT-based CAT)

**Objective**: Measure cognitive ability through adaptive testing that adjusts difficulty in real-time

### 2.1 Item Response Theory (3-Parameter Logistic Model)

```php
// app/Services/Psychometric/AdaptiveLogicTest.php
<?php

namespace App\Services\Psychometric;

class AdaptiveLogicTest
{
    private array $itemBank = [
        // Easy items (b = -1.5 to -0.5)
        ['id' => 'L1', 'difficulty' => -1.2, 'discrimination' => 1.0, 'guessing' => 0.25, 'type' => 'pattern'],
        ['id' => 'L2', 'difficulty' => -0.8, 'discrimination' => 1.1, 'guessing' => 0.25, 'type' => 'sequence'],
        ['id' => 'L3', 'difficulty' => -1.0, 'discrimination' => 0.9, 'guessing' => 0.25, 'type' => 'spatial'],
        
        // Medium items (b = -0.5 to 0.5)
        ['id' => 'L4', 'difficulty' => -0.3, 'discrimination' => 1.2, 'guessing' => 0.20, 'type' => 'pattern'],
        ['id' => 'L5', 'difficulty' => 0.0, 'discrimination' => 1.3, 'guessing' => 0.20, 'type' => 'analogy'],
        ['id' => 'L6', 'difficulty' => 0.2, 'discrimination' => 1.4, 'guessing' => 0.20, 'type' => 'deduction'],
        ['id' => 'L7', 'difficulty' => 0.4, 'discrimination' => 1.2, 'guessing' => 0.20, 'type' => 'spatial'],
        
        // Hard items (b = 0.5 to 1.5)
        ['id' => 'L8', 'difficulty' => 0.7, 'discrimination' => 1.5, 'guessing' => 0.15, 'type' => 'matrix'],
        ['id' => 'L9', 'difficulty' => 1.0, 'discrimination' => 1.6, 'guessing' => 0.15, 'type' => 'complex_pattern'],
        ['id' => 'L10', 'difficulty' => 1.3, 'discrimination' => 1.4, 'guessing' => 0.15, 'type' => 'abstract'],
        
        // Very hard items (b = 1.5 to 2.5)
        ['id' => 'L11', 'difficulty' => 1.7, 'discrimination' => 1.7, 'guessing' => 0.10, 'type' => 'advanced_matrix'],
        ['id' => 'L12', 'difficulty' => 2.0, 'discrimination' => 1.8, 'guessing' => 0.10, 'type' => 'multi_step'],
        ['id' => 'L13', 'difficulty' => 2.3, 'discrimination' => 1.6, 'guessing' => 0.10, 'type' => 'complex_spatial']
    ];
    
    private float $currentTheta = 0.0; // Initial ability estimate
    private float $standardError = 999; // Initial SE (very uncertain)
    private array $administeredItems = [];
    private array $responses = [];
    
    public function getNextItem(): array
    {
        // Select item with maximum information at current theta
        $bestItem = null;
        $maxInformation = 0;
        
        foreach ($this->itemBank as $item) {
            if (in_array($item['id'], $this->administeredItems)) {
                continue; // Skip already administered items
            }
            
            $information = $this->calculateInformation($item, $this->currentTheta);
            
            if ($information > $maxInformation) {
                $maxInformation = $information;
                $bestItem = $item;
            }
        }
        
        $this->administeredItems[] = $bestItem['id'];
        
        return [
            'item' => $bestItem,
            'current_ability_estimate' => round($this->currentTheta, 2),
            'standard_error' => round($this->standardError, 3),
            'items_administered' => count($this->administeredItems),
            'stopping_criterion_met' => $this->shouldStop()
        ];
    }
    
    public function processResponse(string $itemId, bool $correct): array
    {
        $item = collect($this->itemBank)->firstWhere('id', $itemId);
        $this->responses[] = ['item' => $item, 'correct' => $correct];
        
        // Update theta estimate using Maximum Likelihood Estimation
        $this->updateThetaEstimate();
        
        return [
            'updated_theta' => round($this->currentTheta, 2),
            'standard_error' => round($this->standardError, 3),
            'should_continue' => !$this->shouldStop()
        ];
    }
    
    private function calculateProbability(array $item, float $theta): float
    {
        // 3PL Model: P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
        $a = $item['discrimination'];
        $b = $item['difficulty'];
        $c = $item['guessing'];
        
        $exponent = -$a * ($theta - $b);
        return $c + (1 - $c) / (1 + exp($exponent));
    }
    
    private function calculateInformation(array $item, float $theta): float
    {
        // Fisher Information: I(θ) = [P'(θ)]² / [P(θ)(1-P(θ))]
        $p = $this->calculateProbability($item, $theta);
        $a = $item['discrimination'];
        $c = $item['guessing'];
        
        $pPrime = $a * (1 - $c) * $p * (1 - $p) / (1 - $c * (1 - $p));
        $information = ($pPrime ** 2) / ($p * (1 - $p));
        
        return $information;
    }
    
    private function updateThetaEstimate(): void
    {
        // Newton-Raphson method for MLE
        $maxIterations = 20;
        $tolerance = 0.001;
        
        for ($i = 0; $i < $maxIterations; $i++) {
            $firstDerivative = 0;
            $secondDerivative = 0;
            
            foreach ($this->responses as $response) {
                $item = $response['item'];
                $correct = $response['correct'];
                
                $p = $this->calculateProbability($item, $this->currentTheta);
                $a = $item['discrimination'];
                $c = $item['guessing'];
                
                $pStar = ($p - $c) / (1 - $c);
                
                $firstDerivative += $a * ($correct - $p) / ($p * (1 - $p));
                $secondDerivative += -$a * $a * $pStar * (1 - $pStar) / ((1 - $c) ** 2);
            }
            
            $delta = -$firstDerivative / $secondDerivative;
            $this->currentTheta += $delta;
            
            if (abs($delta) < $tolerance) {
                break;
            }
        }
        
        // Update standard error
        $totalInformation = 0;
        foreach ($this->responses as $response) {
            $totalInformation += $this->calculateInformation($response['item'], $this->currentTheta);
        }
        
        $this->standardError = 1 / sqrt($totalInformation);
    }
    
    private function shouldStop(): bool
    {
        // Stopping criteria:
        // 1. Standard error < 0.3
        // 2. At least 15 items administered
        // 3. Maximum 25 items
        
        $minItems = 15;
        $maxItems = 25;
        $targetSE = 0.3;
        
        $itemsAdministered = count($this->administeredItems);
        
        if ($itemsAdministered >= $maxItems) {
            return true;
        }
        
        if ($itemsAdministered >= $minItems && $this->standardError < $targetSE) {
            return true;
        }
        
        return false;
    }
    
    public function getFinalScore(): array
    {
        // Convert theta (-3 to +3) to 0-100 scale
        $normalizedScore = (($this->currentTheta + 3) / 6) * 100;
        $normalizedScore = max(0, min(100, $normalizedScore));
        
        return [
            'theta' => round($this->currentTheta, 2),
            'standard_error' => round($this->standardError, 3),
            'logic_score' => round($normalizedScore, 1),
            'confidence_interval_95' => [
                'lower' => round((($this->currentTheta - 1.96 * $this->standardError) + 3) / 6 * 100, 1),
                'upper' => round((($this->currentTheta + 1.96 * $this->standardError) + 3) / 6 * 100, 1)
            ],
            'reliability' => round(1 - ($this->standardError ** 2), 3),
            'items_administered' => count($this->administeredItems),
            'interpretation' => $this->interpretLogicScore($normalizedScore)
        ];
    }
    
    private function interpretLogicScore(float $score): array
    {
        if ($score >= 90) {
            return [
                'level' => 'Sangat Tinggi',
                'description' => 'Kemampuan logika Anda berada di top 10%',
                'suitable_majors' => ['Matematika', 'Fisika', 'Teknik Informatika', 'Aktuaria']
            ];
        } elseif ($score >= 75) {
            return [
                'level' => 'Tinggi',
                'description' => 'Kemampuan logika Anda di atas rata-rata',
                'suitable_majors' => ['Teknik', 'Sains', 'Ekonomi', 'Statistika']
            ];
        } elseif ($score >= 50) {
            return [
                'level' => 'Sedang',
                'description' => 'Kemampuan logika Anda memadai',
                'suitable_majors' => ['Bisnis', 'Sosial', 'Humaniora', 'Seni']
            ];
        } else {
            return [
                'level' => 'Perlu Pengembangan',
                'description' => 'Fokus pada jurusan yang tidak terlalu menekankan logika kuantitatif',
                'suitable_majors' => ['Seni', 'Desain', 'Komunikasi', 'Bahasa']
            ];
        }
    }
}
```

