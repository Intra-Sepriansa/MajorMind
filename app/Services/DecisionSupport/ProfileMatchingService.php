<?php

namespace App\Services\DecisionSupport;

/**
 * Profile Matching (Gap Analysis) Service
 *
 * Replaces raw Euclidean distance with a psychometric-grade
 * Gap Competence Analysis using Core Factor (60%) and
 * Secondary Factor (40%) weighting.
 *
 * @see https://doi.org/10.1016/j.eswa.2012.05.028
 */
class ProfileMatchingService
{
    private const CORE_FACTOR_WEIGHT = 0.60;

    private const SECONDARY_FACTOR_WEIGHT = 0.40;

    /**
     * Gap-to-value mapping table (standard HR psychometric scale).
     *
     * The gap is calculated as: Student Score − Major Target Score.
     * A positive gap means the student exceeds the requirement.
     *
     * @var array<array{min: int, value: float}>
     */
    private const GAP_MAP = [
        ['min' => 0, 'value' => 5.0],    // Exceeds or meets requirement
        ['min' => -5, 'value' => 4.5],   // Very slight deficit
        ['min' => -10, 'value' => 4.0],  // Slight deficit
        ['min' => -15, 'value' => 3.5],  // Moderate deficit
        ['min' => -20, 'value' => 3.0],  // Significant deficit
        ['min' => -25, 'value' => 2.5],  // Major deficit
        ['min' => -30, 'value' => 2.0],  // Severe deficit
    ];

    /**
     * Core factor definitions per major cluster.
     *
     * 'core' dimensions are mandatory competencies (weighted 60%).
     * All remaining behavioral dimensions become secondary (weighted 40%).
     *
     * @var array<string, string[]>
     */
    private const CORE_FACTORS = [
        // KEDOKTERAN & KESEHATAN — konsistensi is paramount
        'kedokteran-umum' => ['konsistensi', 'minat'],
        'kedokteran-gigi' => ['konsistensi', 'minat'],
        'farmasi' => ['konsistensi', 'logika'],
        'ilmu-keperawatan' => ['konsistensi', 'minat'],
        'kesehatan-masyarakat' => ['konsistensi'],
        'gizi' => ['konsistensi', 'minat'],

        // TEKNIK & ILMU KOMPUTER — logika is paramount
        'teknik-informatika' => ['logika', 'minat'],
        'sistem-informasi' => ['logika', 'konsistensi'],
        'teknik-industri' => ['logika', 'konsistensi'],
        'teknik-sipil' => ['logika', 'konsistensi'],
        'teknik-mesin' => ['logika'],
        'teknik-elektro' => ['logika'],
        'arsitektur' => ['minat', 'konsistensi'],

        // MIPA — logika is paramount
        'matematika' => ['logika'],
        'statistika' => ['logika', 'konsistensi'],
        'aktuaria' => ['logika', 'konsistensi'],
        'bioteknologi' => ['logika', 'konsistensi'],

        // EKONOMI & BISNIS
        'manajemen' => ['minat', 'konsistensi'],
        'akuntansi' => ['konsistensi', 'logika'],
        'ilmu-ekonomi' => ['logika', 'konsistensi'],
        'bisnis-digital' => ['minat'],

        // HUKUM & SOSIAL POLITIK
        'ilmu-hukum' => ['logika', 'konsistensi'],
        'ilmu-komunikasi' => ['minat'],
        'hubungan-internasional' => ['minat'],
        'ilmu-politik' => ['minat'],
        'kriminologi' => ['logika', 'minat'],
        'sosiologi' => ['minat'],

        // PSIKOLOGI & HUMANIORA
        'psikologi' => ['minat', 'konsistensi'],
        'sastra-inggris' => ['minat'],
        'ilmu-sejarah' => ['minat', 'konsistensi'],
        'desain-komunikasi-visual' => ['minat'],

        // PERTANIAN & AGROTEK
        'agribisnis' => ['konsistensi'],
        'agroteknologi' => ['konsistensi'],
        'ilmu-kehutanan' => ['minat', 'konsistensi'],

        // PENDIDIKAN
        'pgsd' => ['minat', 'konsistensi'],
        'pendidikan-bahasa-inggris' => ['minat', 'konsistensi'],
        'pendidikan-matematika' => ['logika', 'konsistensi'],
    ];

    /**
     * Calculate Profile Matching score between a student and a major.
     *
     * @param  array<string, int|float>  $studentProfile  e.g. ['minat' => 75, 'logika' => 80, 'konsistensi' => 60]
     * @param  array<string, int|float>  $majorProfile    e.g. ['minat' => 88, 'logika' => 92, 'konsistensi' => 82]
     * @param  string                    $majorSlug       e.g. 'teknik-informatika'
     * @return array{score: float, gaps: array, core_score: float, secondary_score: float}
     */
    public function calculate(array $studentProfile, array $majorProfile, string $majorSlug): array
    {
        $dimensions = array_intersect(
            array_keys($studentProfile),
            array_keys($majorProfile),
        );

        if ($dimensions === []) {
            return [
                'score' => 0.5,
                'gaps' => [],
                'core_score' => 0.0,
                'secondary_score' => 0.0,
                'core_factors' => [],
                'secondary_factors' => [],
            ];
        }

        $coreDimensions = self::CORE_FACTORS[$majorSlug] ?? ['minat'];
        $gaps = [];

        foreach ($dimensions as $dimension) {
            $gap = (float) $studentProfile[$dimension] - (float) $majorProfile[$dimension];
            $gapValue = $this->mapGapToValue($gap);

            $gaps[$dimension] = [
                'student' => (float) $studentProfile[$dimension],
                'target' => (float) $majorProfile[$dimension],
                'raw_gap' => round($gap, 2),
                'gap_value' => $gapValue,
                'is_core' => in_array($dimension, $coreDimensions, true),
            ];
        }

        $coreGaps = array_filter($gaps, fn (array $g): bool => $g['is_core']);
        $secondaryGaps = array_filter($gaps, fn (array $g): bool => ! $g['is_core']);

        $coreScore = count($coreGaps) > 0
            ? array_sum(array_column($coreGaps, 'gap_value')) / count($coreGaps)
            : 0.0;

        $secondaryScore = count($secondaryGaps) > 0
            ? array_sum(array_column($secondaryGaps, 'gap_value')) / count($secondaryGaps)
            : $coreScore; // fallback if all dimensions are core

        $totalScore = (self::CORE_FACTOR_WEIGHT * $coreScore)
            + (self::SECONDARY_FACTOR_WEIGHT * $secondaryScore);

        // Normalize to 0-1 range (gap_value is 1.0-5.0, so divide by 5)
        $normalizedScore = $totalScore / 5.0;

        return [
            'score' => round($normalizedScore, 6),
            'gaps' => $gaps,
            'core_score' => round($coreScore, 4),
            'secondary_score' => round($secondaryScore, 4),
            'core_factors' => array_values($coreDimensions),
            'secondary_factors' => array_values(array_diff($dimensions, $coreDimensions)),
        ];
    }

    /**
     * Map a raw gap value to the standardized HR psychometric value.
     */
    private function mapGapToValue(float $gap): float
    {
        foreach (self::GAP_MAP as $entry) {
            if ($gap >= $entry['min']) {
                return $entry['value'];
            }
        }

        return 1.0; // Extreme deficit (gap < -30)
    }

    /**
     * Get core factor definitions for a specific major.
     *
     * @return string[]
     */
    public function getCoreFactors(string $majorSlug): array
    {
        return self::CORE_FACTORS[$majorSlug] ?? ['minat'];
    }
}
