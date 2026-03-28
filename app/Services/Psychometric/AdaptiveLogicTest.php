<?php

namespace App\Services\Psychometric;

/**
 * Adaptive Logic Test using Item Response Theory (3-Parameter Logistic Model)
 * with Computerized Adaptive Testing (CAT) item selection.
 *
 * This service is stateless — each method call receives and returns the
 * full test state so it can be used across multiple HTTP requests.
 */
class AdaptiveLogicTest
{
    /**
     * 13-item bank with IRT 3PL parameters.
     *
     * Each item has:
     *  - difficulty (b):      −3 to +3 (higher = harder)
     *  - discrimination (a):  positive, typically 0.5 to 2.5
     *  - guessing (c):        probability of correct by chance (0 to 0.5)
     *  - type:                cognitive domain label
     *  - question/options:    actual content presented to the user
     *
     * @var list<array{id: string, difficulty: float, discrimination: float, guessing: float, type: string, question: string, options: array<string, string>, correct: string}>
     */
    private array $itemBank = [
        // ═══ Easy (b = −1.5 to −0.5) — 5 items ═══
        [
            'id' => 'L1', 'difficulty' => -1.2, 'discrimination' => 1.0, 'guessing' => 0.25,
            'type' => 'pattern',
            'question' => 'Apa angka selanjutnya dalam deret: 2, 4, 6, 8, ...?',
            'options' => ['A' => '9', 'B' => '10', 'C' => '12', 'D' => '14'],
            'correct' => 'B',
        ],
        [
            'id' => 'L2', 'difficulty' => -0.8, 'discrimination' => 1.1, 'guessing' => 0.25,
            'type' => 'sequence',
            'question' => 'Jika semua kucing adalah hewan dan semua hewan bernapas, maka?',
            'options' => ['A' => 'Semua hewan adalah kucing', 'B' => 'Semua kucing bernapas', 'C' => 'Semua yang bernapas adalah kucing', 'D' => 'Tidak ada kesimpulan'],
            'correct' => 'B',
        ],
        [
            'id' => 'L3', 'difficulty' => -1.0, 'discrimination' => 0.9, 'guessing' => 0.25,
            'type' => 'spatial',
            'question' => 'Sebuah kubus mempunyai berapa sisi?',
            'options' => ['A' => '4', 'B' => '6', 'C' => '8', 'D' => '12'],
            'correct' => 'B',
        ],
        [
            'id' => 'L14', 'difficulty' => -1.3, 'discrimination' => 0.8, 'guessing' => 0.25,
            'type' => 'verbal_reasoning',
            'question' => 'Manakah kata yang TIDAK termasuk kelompok? Apel, Jeruk, Kentang, Mangga',
            'options' => ['A' => 'Apel', 'B' => 'Jeruk', 'C' => 'Kentang', 'D' => 'Mangga'],
            'correct' => 'C',
        ],
        [
            'id' => 'L15', 'difficulty' => -0.6, 'discrimination' => 1.0, 'guessing' => 0.25,
            'type' => 'numerical_reasoning',
            'question' => 'Jika harga barang Rp80.000 didiskon 25%, berapa harga akhirnya?',
            'options' => ['A' => 'Rp55.000', 'B' => 'Rp60.000', 'C' => 'Rp65.000', 'D' => 'Rp70.000'],
            'correct' => 'B',
        ],

        // ═══ Medium (b = −0.5 to 0.5) — 8 items ═══
        [
            'id' => 'L4', 'difficulty' => -0.3, 'discrimination' => 1.2, 'guessing' => 0.20,
            'type' => 'pattern',
            'question' => 'Apa angka selanjutnya: 1, 1, 2, 3, 5, 8, ...?',
            'options' => ['A' => '10', 'B' => '11', 'C' => '13', 'D' => '15'],
            'correct' => 'C',
        ],
        [
            'id' => 'L5', 'difficulty' => 0.0, 'discrimination' => 1.3, 'guessing' => 0.20,
            'type' => 'analogy',
            'question' => 'Buku : Membaca = Pisau : ...?',
            'options' => ['A' => 'Tajam', 'B' => 'Memotong', 'C' => 'Dapur', 'D' => 'Besi'],
            'correct' => 'B',
        ],
        [
            'id' => 'L6', 'difficulty' => 0.2, 'discrimination' => 1.4, 'guessing' => 0.20,
            'type' => 'deduction',
            'question' => 'Jika A > B dan B > C, manakah yang pasti benar?',
            'options' => ['A' => 'C > A', 'B' => 'A = C', 'C' => 'A > C', 'D' => 'B = A'],
            'correct' => 'C',
        ],
        [
            'id' => 'L7', 'difficulty' => 0.4, 'discrimination' => 1.2, 'guessing' => 0.20,
            'type' => 'spatial',
            'question' => 'Jika kertas persegi dilipat dua kali secara diagonal, lalu digunting ujungnya, berapa lubang terbentuk saat dibuka?',
            'options' => ['A' => '1', 'B' => '2', 'C' => '4', 'D' => '8'],
            'correct' => 'C',
        ],
        [
            'id' => 'L16', 'difficulty' => -0.1, 'discrimination' => 1.3, 'guessing' => 0.20,
            'type' => 'verbal_reasoning',
            'question' => 'Guru : Murid = Dokter : ...?',
            'options' => ['A' => 'Rumah Sakit', 'B' => 'Obat', 'C' => 'Pasien', 'D' => 'Stetoskop'],
            'correct' => 'C',
        ],
        [
            'id' => 'L17', 'difficulty' => 0.1, 'discrimination' => 1.2, 'guessing' => 0.20,
            'type' => 'data_interpretation',
            'question' => 'Dari 200 siswa, 40% suka Matematika, 35% suka IPA, sisanya suka Bahasa. Berapa siswa yang suka Bahasa?',
            'options' => ['A' => '40', 'B' => '50', 'C' => '60', 'D' => '70'],
            'correct' => 'B',
        ],
        [
            'id' => 'L18', 'difficulty' => 0.3, 'discrimination' => 1.4, 'guessing' => 0.20,
            'type' => 'logical_deduction',
            'question' => 'Semua mahasiswa rajin. Beberapa mahasiswa adalah atlet. Kesimpulannya?',
            'options' => ['A' => 'Semua atlet rajin', 'B' => 'Beberapa atlet rajin', 'C' => 'Semua orang rajin adalah mahasiswa', 'D' => 'Tidak ada atlet yang rajin'],
            'correct' => 'B',
        ],
        [
            'id' => 'L19', 'difficulty' => 0.5, 'discrimination' => 1.3, 'guessing' => 0.20,
            'type' => 'numerical_reasoning',
            'question' => 'Sebuah mobil menempuh 150 km dalam 2,5 jam. Berapa kecepatan rata-ratanya?',
            'options' => ['A' => '50 km/jam', 'B' => '55 km/jam', 'C' => '60 km/jam', 'D' => '65 km/jam'],
            'correct' => 'C',
        ],

        // ═══ Hard (b = 0.5 to 1.5) — 7 items ═══
        [
            'id' => 'L8', 'difficulty' => 0.7, 'discrimination' => 1.5, 'guessing' => 0.15,
            'type' => 'matrix',
            'question' => 'Dalam suatu kode, RUMAH = 18-21-13-1-8. Berapa BUKU?',
            'options' => ['A' => '2-21-11-21', 'B' => '2-21-11-15', 'C' => '2-21-11-20', 'D' => '2-21-11-22'],
            'correct' => 'A',
        ],
        [
            'id' => 'L9', 'difficulty' => 1.0, 'discrimination' => 1.6, 'guessing' => 0.15,
            'type' => 'complex_pattern',
            'question' => 'Deret: 3, 6, 11, 18, 27, ...? Berapa selanjutnya?',
            'options' => ['A' => '36', 'B' => '38', 'C' => '40', 'D' => '35'],
            'correct' => 'B',
        ],
        [
            'id' => 'L10', 'difficulty' => 1.3, 'discrimination' => 1.4, 'guessing' => 0.15,
            'type' => 'abstract',
            'question' => 'Jika hari ini Selasa, 100 hari lagi hari apa?',
            'options' => ['A' => 'Rabu', 'B' => 'Kamis', 'C' => 'Jumat', 'D' => 'Sabtu'],
            'correct' => 'B',
        ],
        [
            'id' => 'L20', 'difficulty' => 0.8, 'discrimination' => 1.5, 'guessing' => 0.15,
            'type' => 'data_interpretation',
            'question' => 'Rata-rata nilai 5 siswa adalah 72. Jika satu siswa bernilai 60 dikeluarkan, rata-rata 4 siswa sisanya?',
            'options' => ['A' => '73', 'B' => '75', 'C' => '76', 'D' => '78'],
            'correct' => 'B',
        ],
        [
            'id' => 'L21', 'difficulty' => 1.1, 'discrimination' => 1.5, 'guessing' => 0.15,
            'type' => 'logical_deduction',
            'question' => 'P menghasilkan Q. Q menghasilkan R. R menghasilkan S. Jika P salah, manakah yang pasti benar?',
            'options' => ['A' => 'S pasti salah', 'B' => 'Q mungkin benar', 'C' => 'Tidak bisa disimpulkan tentang Q', 'D' => 'R pasti benar'],
            'correct' => 'C',
        ],
        [
            'id' => 'L22', 'difficulty' => 1.2, 'discrimination' => 1.4, 'guessing' => 0.15,
            'type' => 'numerical_reasoning',
            'question' => 'Suatu pinjaman Rp10.000.000 dengan bunga sederhana 12% per tahun. Berapa total yang harus dibayar setelah 2 tahun?',
            'options' => ['A' => 'Rp12.000.000', 'B' => 'Rp12.400.000', 'C' => 'Rp12.544.000', 'D' => 'Rp14.000.000'],
            'correct' => 'B',
        ],
        [
            'id' => 'L23', 'difficulty' => 1.4, 'discrimination' => 1.6, 'guessing' => 0.15,
            'type' => 'critical_thinking',
            'question' => '"Semua orang yang lulus ujian X adalah cerdas. Andi tidak lulus ujian X." Manakah kesimpulan yang benar?',
            'options' => ['A' => 'Andi tidak cerdas', 'B' => 'Andi cerdas', 'C' => 'Tidak dapat ditentukan apakah Andi cerdas', 'D' => 'Andi akan gagal ujian lain'],
            'correct' => 'C',
        ],

        // ═══ Very hard (b = 1.5 to 2.5) — 5 items ═══
        [
            'id' => 'L11', 'difficulty' => 1.7, 'discrimination' => 1.7, 'guessing' => 0.10,
            'type' => 'advanced_matrix',
            'question' => 'Sebuah jam menunjukkan pukul 15.15. Berapakah sudut antara jarum jam dan jarum menit?',
            'options' => ['A' => '0°', 'B' => '7.5°', 'C' => '15°', 'D' => '22.5°'],
            'correct' => 'B',
        ],
        [
            'id' => 'L12', 'difficulty' => 2.0, 'discrimination' => 1.8, 'guessing' => 0.10,
            'type' => 'multi_step',
            'question' => 'Diketahui f(x)=2x+1. Berapakah f(f(3))?',
            'options' => ['A' => '13', 'B' => '15', 'C' => '14', 'D' => '11'],
            'correct' => 'B',
        ],
        [
            'id' => 'L13', 'difficulty' => 2.3, 'discrimination' => 1.6, 'guessing' => 0.10,
            'type' => 'complex_spatial',
            'question' => 'Sebuah bola berada di dalam kubus dengan sisi 10 cm. Berapa volume kubus yang TIDAK ditempati bola (π≈3.14)?',
            'options' => ['A' => '476.67 cm³', 'B' => '523.33 cm³', 'C' => '477.33 cm³', 'D' => '500 cm³'],
            'correct' => 'B',
        ],
        [
            'id' => 'L24', 'difficulty' => 1.8, 'discrimination' => 1.7, 'guessing' => 0.10,
            'type' => 'data_interpretation',
            'question' => 'Perusahaan tumbuh 20% di tahun 1 dan turun 20% di tahun 2. Jika pendapatan awal Rp100jt, berapa setelah 2 tahun?',
            'options' => ['A' => 'Rp100jt', 'B' => 'Rp96jt', 'C' => 'Rp98jt', 'D' => 'Rp104jt'],
            'correct' => 'B',
        ],
        [
            'id' => 'L25', 'difficulty' => 2.1, 'discrimination' => 1.8, 'guessing' => 0.10,
            'type' => 'critical_thinking',
            'question' => '5 mesin menghasilkan 5 produk dalam 5 menit. Berapa menit yang dibutuhkan 100 mesin untuk menghasilkan 100 produk?',
            'options' => ['A' => '5 menit', 'B' => '100 menit', 'C' => '20 menit', 'D' => '500 menit'],
            'correct' => 'A',
        ],
    ];

    /**
     * Get the item bank (without correct answers) for frontend consumption.
     *
     * @return list<array{id: string, type: string, question: string, options: array<string, string>}>
     */
    public function getItemBank(): array
    {
        return array_map(fn (array $item) => [
            'id' => $item['id'],
            'type' => $item['type'],
            'question' => $item['question'],
            'options' => $item['options'],
        ], $this->itemBank);
    }

    /**
     * Initialize a new adaptive test session.
     *
     * @return array{theta: float, standard_error: float, administered: list<string>, responses: list<array{id: string, correct: bool}>}
     */
    public function initSession(): array
    {
        return [
            'theta' => 0.0,
            'standard_error' => 999.0,
            'administered' => [],
            'responses' => [],
        ];
    }

    /**
     * Select the next best item based on maximum information at current θ.
     *
     * @param  array  $session  The current session state
     * @return array{item: array|null, session: array, should_stop: bool}
     */
    public function getNextItem(array $session): array
    {
        if ($this->shouldStop($session)) {
            return [
                'item' => null,
                'session' => $session,
                'should_stop' => true,
            ];
        }

        $bestItem = null;
        $maxInformation = -1;

        foreach ($this->itemBank as $item) {
            if (in_array($item['id'], $session['administered'], true)) {
                continue;
            }

            $information = $this->calculateInformation($item, $session['theta']);

            if ($information > $maxInformation) {
                $maxInformation = $information;
                $bestItem = $item;
            }
        }

        if (! $bestItem) {
            return [
                'item' => null,
                'session' => $session,
                'should_stop' => true,
            ];
        }

        // Return item WITHOUT correct answer
        return [
            'item' => [
                'id' => $bestItem['id'],
                'type' => $bestItem['type'],
                'question' => $bestItem['question'],
                'options' => $bestItem['options'],
                'difficulty_label' => $this->difficultyLabel($bestItem['difficulty']),
            ],
            'session' => $session,
            'should_stop' => false,
        ];
    }

    /**
     * Process a user's response and update θ estimate.
     *
     * @param  array   $session  Current session state
     * @param  string  $itemId   The item ID answered
     * @param  string  $answer   The user's answer (A/B/C/D)
     * @return array{correct: bool, session: array, should_stop: bool}
     */
    public function processResponse(array $session, string $itemId, string $answer): array
    {
        $item = collect($this->itemBank)->firstWhere('id', $itemId);

        if (! $item) {
            return ['correct' => false, 'session' => $session, 'should_stop' => true];
        }

        $correct = strtoupper($answer) === strtoupper($item['correct']);

        $session['administered'][] = $itemId;
        $session['responses'][] = ['id' => $itemId, 'correct' => $correct];

        // Update θ via Newton-Raphson MLE
        $session = $this->updateTheta($session);

        return [
            'correct' => $correct,
            'session' => $session,
            'should_stop' => $this->shouldStop($session),
        ];
    }

    /**
     * Get the final score from a completed session.
     */
    public function getFinalScore(array $session): array
    {
        $theta = $session['theta'];
        $se = $session['standard_error'];

        // Core Sigmoid Transformation as mandated by the MajorMind research paper
        // S(theta) = 1 / (1 + e^-theta) -> Translates (-inf, +inf) to (0, 1)
        $sigmoidRatio = \App\Services\Algorithms\SigmoidTransformer::transform($theta);
        $logicScore = $sigmoidRatio * 100; // Scaled for Profile Matching compatibility

        $ciLower = (\App\Services\Algorithms\SigmoidTransformer::transform($theta - 1.96 * $se)) * 100;
        $ciUpper = (\App\Services\Algorithms\SigmoidTransformer::transform($theta + 1.96 * $se)) * 100;

        return [
            'theta' => round($theta, 4),
            'sigmoid_ratio' => round($sigmoidRatio, 4),
            'standard_error' => round($se, 3),
            'logic_score' => round($logicScore, 1),
            'confidence_interval_95' => [
                'lower' => round(max(0, $ciLower), 1),
                'upper' => round(min(100, $ciUpper), 1),
            ],
            'reliability' => round(max(0, 1 - ($se ** 2)), 3),
            'items_administered' => count($session['administered']),
            'interpretation' => $this->interpretLogicScore($logicScore),
        ];
    }

    // ─── IRT Mathematics ───────────────────────────────────────

    /**
     * 3PL probability: P(θ) = c + (1−c) / (1 + e^(−a(θ−b)))
     */
    private function probability(array $item, float $theta): float
    {
        $a = $item['discrimination'];
        $b = $item['difficulty'];
        $c = $item['guessing'];

        $exponent = -$a * ($theta - $b);

        return $c + (1 - $c) / (1 + exp($exponent));
    }

    /**
     * Fisher Information at θ for a given item.
     */
    private function calculateInformation(array $item, float $theta): float
    {
        $p = $this->probability($item, $theta);
        $a = $item['discrimination'];
        $c = $item['guessing'];

        if ($p <= $c || $p >= 1.0) {
            return 0.0;
        }

        $pStar = ($p - $c) / (1 - $c);

        return ($a ** 2) * $pStar * ((1 - $pStar) / $p) * ($pStar / (1 - $p));
    }

    /**
     * Newton-Raphson Maximum Likelihood Estimation for θ.
     */
    private function updateTheta(array &$session): array
    {
        $responsesPayload = [];
        $totalInfo = 0.0;

        foreach ($session['responses'] as $response) {
            $item = collect($this->itemBank)->firstWhere('id', $response['id']);
            if ($item) {
                $responsesPayload[] = [
                    'is_correct' => $response['correct'],
                    'a_param' => $item['discrimination'],
                    'b_param' => $item['difficulty'],
                    'c_param' => $item['guessing'],
                ];
            }
        }

        // Delegate MLE calculation to the robust Grid Search IrtEngine
        $theta = \App\Services\Psychometrics\IrtEngine::estimateTheta($responsesPayload);
        $session['theta'] = $theta;

        // Calculate Standard Error derived from Fisher Information
        foreach ($session['responses'] as $response) {
            $item = collect($this->itemBank)->firstWhere('id', $response['id']);
            if ($item) {
                $totalInfo += $this->calculateInformation($item, $theta);
            }
        }

        $session['standard_error'] = $totalInfo > 0 ? 1 / sqrt($totalInfo) : 999.0;

        return $session;
    }

    private function shouldStop(array $session): bool
    {
        $itemCount = count($session['administered']);
        $se = $session['standard_error'];

        // Must answer at least 5 items
        if ($itemCount < 5) {
            return false;
        }

        // Stop if SE < 0.35 OR all items exhausted OR reached 13 items
        if ($se < 0.35) {
            return true;
        }

        if ($itemCount >= count($this->itemBank)) {
            return true;
        }

        return false;
    }

    private function difficultyLabel(float $b): string
    {
        if ($b < -0.5) {
            return 'Easy';
        }

        if ($b < 0.5) {
            return 'Medium';
        }

        if ($b < 1.5) {
            return 'Hard';
        }

        return 'Very Hard';
    }

    private function interpretLogicScore(float $score): array
    {
        if ($score >= 90) {
            return [
                'level' => 'Sangat Tinggi',
                'description' => 'Kemampuan logika Anda berada di top 10%',
            ];
        }

        if ($score >= 75) {
            return [
                'level' => 'Tinggi',
                'description' => 'Kemampuan logika Anda di atas rata-rata',
            ];
        }

        if ($score >= 50) {
            return [
                'level' => 'Sedang',
                'description' => 'Kemampuan logika Anda memadai',
            ];
        }

        return [
            'level' => 'Perlu Pengembangan',
            'description' => 'Fokus pada jurusan yang tidak terlalu menekankan logika kuantitatif',
        ];
    }
}
