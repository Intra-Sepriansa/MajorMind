<?php

namespace App\Services\Insight;

use App\Models\Assessment;

class PsychometricValidationEngine
{
    public function validate(int $assessmentId): array
    {
        $assessment = Assessment::findOrFail($assessmentId);
        $psychometric = $assessment->psychometric_profile;

        $riasecValidation = $this->validateRiasec($psychometric['riasec'] ?? null);
        $gritValidation = $this->validateGrit($psychometric['grit'] ?? null);
        $logicValidation = $this->validateLogic($psychometric['logic'] ?? null);
        $biasDetection = $this->detectBiases($psychometric, $assessment->behavioral_profile);
        $qualityData = $psychometric['validation'] ?? null;

        $sectionScores = array_filter([
            $riasecValidation['reliability_score'] ?? null,
            $gritValidation['reliability_score'] ?? null,
            $logicValidation['reliability_score'] ?? null,
        ], fn ($v) => $v !== null);

        $overallReliability = count($sectionScores) > 0
            ? round(array_sum($sectionScores) / count($sectionScores), 1)
            : 0;

        return [
            'riasec' => $riasecValidation,
            'grit' => $gritValidation,
            'logic' => $logicValidation,
            'bias_detection' => $biasDetection,
            'quality' => $qualityData,
            'overall_reliability' => $overallReliability,
            'overall_status' => $overallReliability >= 70 ? 'Valid' : ($overallReliability >= 50 ? 'Marginal' : 'Questionable'),
        ];
    }

    private function validateRiasec(?array $riasec): array
    {
        if (!$riasec || empty($riasec['scores'])) {
            return [
                'available' => false,
                'reliability_score' => null,
            ];
        }

        $scores = $riasec['scores'];
        $hollandCode = $riasec['holland_code'] ?? 'N/A';
        $primaryType = $riasec['primary_type'] ?? 'N/A';

        // Profile differentiation (standard deviation of scores)
        $values = array_values($scores);
        $mean = array_sum($values) / max(count($values), 1);
        $variance = 0;
        foreach ($values as $v) {
            $variance += ($v - $mean) ** 2;
        }
        $stdDev = sqrt($variance / max(count($values), 1));

        // Higher std dev = more differentiated (peaked) profile
        $differentiationScore = min(100, round($stdDev * 8, 1));

        // Iachan C-index approximation
        $maxScore = max($values);
        $minScore = min($values);
        $range = $maxScore - $minScore;
        $peakedness = min(100, round($range * 1.5, 1));

        $reliabilityScore = round(($differentiationScore + $peakedness) / 2, 1);

        return [
            'available' => true,
            'holland_code' => $hollandCode,
            'primary_type' => $primaryType,
            'scores' => $scores,
            'differentiation' => [
                'score' => $differentiationScore,
                'std_dev' => round($stdDev, 2),
                'level' => $differentiationScore >= 60 ? 'Well-Differentiated' : ($differentiationScore >= 35 ? 'Moderate' : 'Flat'),
                'interpretation' => $differentiationScore >= 60
                    ? 'Profil RIASEC Anda menunjukkan minat yang jelas dan terarah — tipe kepribadian dominan dapat diidentifikasi dengan percaya diri.'
                    : ($differentiationScore >= 35
                        ? 'Profil RIASEC Anda cukup terdifferensiasi — minat utama dapat diidentifikasi, namun ada beberapa area yang berimbang.'
                        : 'Profil RIASEC Anda relatif flat — belum ada minat dominan yang kuat, pertimbangkan untuk mengeksplorasi lebih lanjut.'),
            ],
            'peakedness' => $peakedness,
            'reliability_score' => $reliabilityScore,
        ];
    }

    private function validateGrit(?array $grit): array
    {
        if (!$grit) {
            return [
                'available' => false,
                'reliability_score' => null,
            ];
        }

        $totalScore = $grit['total_score'] ?? 0;
        $perseverance = $grit['perseverance_score'] ?? 0;
        $consistency = $grit['consistency_score'] ?? 0;
        $level = $grit['level'] ?? 'Unknown';
        $percentile = $grit['percentile'] ?? 0;

        // Subscale balance check
        $subscaleDiff = abs($perseverance - $consistency);
        $balanceScore = max(0, round(100 - ($subscaleDiff * 15), 1));

        // Score plausibility
        $plausibility = ($totalScore >= 1 && $totalScore <= 5) ? 100 : 50;

        $reliabilityScore = round(($balanceScore + $plausibility) / 2, 1);

        return [
            'available' => true,
            'total_score' => $totalScore,
            'perseverance' => $perseverance,
            'consistency' => $consistency,
            'subscale_diff' => round($subscaleDiff, 2),
            'level' => $level,
            'percentile' => $percentile,
            'balance_score' => $balanceScore,
            'reliability_score' => $reliabilityScore,
            'interpretation' => $subscaleDiff <= 1.0
                ? 'Skor Grit seimbang antara ketekunan dan konsistensi — menunjukkan profil motivasi yang stabil.'
                : ($perseverance > $consistency
                    ? 'Ketekunan Anda lebih tinggi dari konsistensi minat — Anda mungkin bekerja keras tapi sering berganti fokus.'
                    : 'Konsistensi minat Anda lebih tinggi dari ketekunan — Anda tahu apa yang diinginkan tapi mungkin perlu memperkuat daya juang.'),
        ];
    }

    private function validateLogic(?array $logic): array
    {
        if (!$logic) {
            return [
                'available' => false,
                'reliability_score' => null,
            ];
        }

        $theta = $logic['theta'] ?? 0;
        $se = $logic['standard_error'] ?? 1.0;
        $score = $logic['score'] ?? 0;
        $items = $logic['items_administered'] ?? 0;
        $reliability = $logic['reliability'] ?? 0;

        // Precision: lower SE = higher precision
        $precisionScore = max(0, round((1 - min($se, 1.0)) * 100, 1));

        // Confidence interval (95%)
        $ci95Lower = round($theta - 1.96 * $se, 2);
        $ci95Upper = round($theta + 1.96 * $se, 2);

        $abilityLevel = $theta >= 1.5 ? 'Sangat Tinggi'
            : ($theta >= 0.5 ? 'Tinggi'
                : ($theta >= -0.5 ? 'Sedang'
                    : ($theta >= -1.5 ? 'Rendah' : 'Sangat Rendah')));

        $reliabilityScore = round(($precisionScore + $reliability * 100) / 2, 1);

        return [
            'available' => true,
            'theta' => $theta,
            'standard_error' => $se,
            'score' => $score,
            'items_administered' => $items,
            'irt_reliability' => $reliability,
            'precision_score' => $precisionScore,
            'confidence_interval_95' => [
                'lower' => $ci95Lower,
                'upper' => $ci95Upper,
            ],
            'ability_level' => $abilityLevel,
            'reliability_score' => $reliabilityScore,
            'interpretation' => $se < 0.3
                ? 'Estimasi kemampuan logika sangat presisi — CAT berhasil mengidentifikasi level Anda dengan akurat.'
                : ($se < 0.5
                    ? 'Estimasi cukup presisi — hasil bisa dipercaya meskipun ada sedikit margin error.'
                    : 'Presisi estimasi terbatas — pertimbangkan untuk mengerjakan lebih banyak soal jika memungkinkan.'),
        ];
    }

    private function detectBiases(?array $psychometric, array $behavioralProfile): array
    {
        $biases = [];

        // Acquiescence bias: all behavioral scores very high
        $profileValues = array_values($behavioralProfile);
        if (count($profileValues) > 0) {
            $highCount = count(array_filter($profileValues, fn ($v) => $v >= 80));
            $highPercent = round(($highCount / count($profileValues)) * 100, 1);
            if ($highPercent > 80) {
                $biases[] = [
                    'type' => 'Acquiescence Bias',
                    'severity' => $highPercent > 90 ? 'High' : 'Moderate',
                    'detail' => "{$highPercent}% dimensi behavioral di atas 80 — kemungkinan tendency to agree.",
                    'impact' => 'Skor mungkin tertiup ke atas, mengurangi diferensiasi antar jurusan.',
                ];
            }
        }

        // Central tendency bias: all scores cluster near midpoint
        if (count($profileValues) > 0) {
            $midCount = count(array_filter($profileValues, fn ($v) => $v >= 40 && $v <= 60));
            $midPercent = round(($midCount / count($profileValues)) * 100, 1);
            if ($midPercent > 70) {
                $biases[] = [
                    'type' => 'Central Tendency Bias',
                    'severity' => $midPercent > 85 ? 'High' : 'Moderate',
                    'detail' => "{$midPercent}% dimensi behavioral berada di range 40-60 — respons cenderung netral.",
                    'impact' => 'Profil terlalu flat sehingga sulit membedakan jurusan yang paling cocok.',
                ];
            }
        }

        // RIASEC flat profile
        $riasec = $psychometric['riasec'] ?? null;
        if ($riasec && !empty($riasec['scores'])) {
            $scores = array_values($riasec['scores']);
            $range = max($scores) - min($scores);
            if ($range < 10) {
                $biases[] = [
                    'type' => 'Undifferentiated RIASEC',
                    'severity' => $range < 5 ? 'High' : 'Moderate',
                    'detail' => "Range antar dimensi RIASEC hanya {$range} — profil sangat flat.",
                    'impact' => 'Holland Code mungkin tidak representatif — sulit menentukan tipe kepribadian dominan.',
                ];
            }
        }

        $dataQuality = max(0, round(100 - count($biases) * 20, 1));

        return [
            'biases' => $biases,
            'bias_count' => count($biases),
            'data_quality_score' => $dataQuality,
            'overall_status' => count($biases) === 0 ? 'Clean' : (count($biases) <= 1 ? 'Minor Issues' : 'Review Needed'),
        ];
    }
}
