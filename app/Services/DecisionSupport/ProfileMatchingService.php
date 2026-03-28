<?php

namespace App\Services\DecisionSupport;

/**
 * Profile Matching (Gap Analysis) Service — 7-Dimension System
 *
 * Uses psychometric-grade Gap Competence Analysis with
 * Core Factor (60%) and Secondary Factor (40%) weighting.
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
     * Core factor definitions per major cluster (7D behavioral dimensions).
     *
     * 'core' dimensions are mandatory competencies (weighted 60%).
     * All remaining behavioral dimensions become secondary (weighted 40%).
     *
     * @var array<string, string[]>
     */
    private const CORE_FACTORS = [
        // ═══ KEDOKTERAN & KESEHATAN — daya_juang + konsistensi paramount
        'kedokteran-umum' => ['daya_juang', 'konsistensi', 'minat_sosial'],
        'kedokteran-gigi' => ['daya_juang', 'konsistensi', 'minat_stem'],
        'farmasi' => ['konsistensi', 'logika', 'keteraturan'],
        'ilmu-keperawatan' => ['minat_sosial', 'daya_juang', 'konsistensi'],
        'kesehatan-masyarakat' => ['minat_sosial', 'konsistensi'],
        'gizi' => ['minat_sosial', 'konsistensi', 'keteraturan'],

        // ═══ TEKNIK & ILMU KOMPUTER — logika + minat_stem paramount
        'teknik-informatika' => ['logika', 'minat_stem', 'daya_juang'],
        'sistem-informasi' => ['logika', 'keteraturan', 'minat_stem'],
        'teknik-industri' => ['logika', 'keteraturan', 'minat_stem'],
        'teknik-sipil' => ['logika', 'minat_stem', 'konsistensi'],
        'teknik-mesin' => ['logika', 'minat_stem', 'daya_juang'],
        'teknik-elektro' => ['logika', 'minat_stem', 'daya_juang'],
        'arsitektur' => ['minat_seni', 'minat_stem', 'konsistensi'],

        // ═══ MIPA — logika paramount
        'matematika' => ['logika', 'minat_stem', 'daya_juang'],
        'statistika' => ['logika', 'keteraturan', 'minat_stem'],
        'aktuaria' => ['logika', 'keteraturan', 'konsistensi'],
        'bioteknologi' => ['minat_stem', 'logika', 'konsistensi'],

        // ═══ EKONOMI & BISNIS
        'manajemen' => ['minat_sosial', 'daya_juang', 'konsistensi'],
        'akuntansi' => ['keteraturan', 'konsistensi', 'logika'],
        'ilmu-ekonomi' => ['logika', 'konsistensi', 'minat_sosial'],
        'bisnis-digital' => ['minat_sosial', 'daya_juang', 'minat_stem'],

        // ═══ HUKUM & SOSIAL POLITIK
        'ilmu-hukum' => ['logika', 'konsistensi', 'keteraturan'],
        'ilmu-komunikasi' => ['minat_sosial', 'minat_seni'],
        'hubungan-internasional' => ['minat_sosial', 'daya_juang'],
        'ilmu-politik' => ['minat_sosial', 'daya_juang'],
        'kriminologi' => ['logika', 'minat_sosial'],
        'sosiologi' => ['minat_sosial', 'konsistensi'],

        // ═══ PSIKOLOGI & HUMANIORA
        'psikologi' => ['minat_sosial', 'konsistensi', 'logika'],
        'sastra-inggris' => ['minat_seni', 'konsistensi'],
        'ilmu-sejarah' => ['konsistensi', 'daya_juang', 'minat_seni'],
        'desain-komunikasi-visual' => ['minat_seni', 'daya_juang'],

        // ═══ PERTANIAN & AGROTEK
        'agribisnis' => ['konsistensi', 'minat_sosial'],
        'agroteknologi' => ['minat_stem', 'konsistensi', 'daya_juang'],
        'ilmu-kehutanan' => ['daya_juang', 'konsistensi', 'minat_stem'],

        // ═══ PENDIDIKAN
        'pgsd' => ['minat_sosial', 'daya_juang', 'konsistensi'],
        'pendidikan-bahasa-inggris' => ['minat_sosial', 'minat_seni', 'konsistensi'],
        'pendidikan-matematika' => ['logika', 'minat_sosial', 'konsistensi'],
    ];

    /**
     * Calculate Profile Matching score between a student and a major.
     *
     * @param  array<string, int|float>  $studentProfile  7D behavioral profile
     * @param  array<string, int|float>  $majorProfile    7D behavioral target
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

        $coreDimensions = self::CORE_FACTORS[$majorSlug] ?? ['logika', 'konsistensi'];
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
        return self::CORE_FACTORS[$majorSlug] ?? ['logika', 'konsistensi'];
    }
}
