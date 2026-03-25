<?php

namespace App\Services\Comparison;

use App\Models\Major;

class ComparisonMatrixBuilder
{
    /**
     * Dimension categories mapped to actual data keys from criteria_scores and behavioral_profile.
     *
     * criteria_scores keys: minat_pribadi, kemampuan_analitis, prospek_karier, kesiapan_akademik
     * behavioral_profile keys (Major): minat, logika, konsistensi
     */
    private array $comparisonDimensions = [
        'academic' => [
            'kesiapan_akademik' => 'Academic Readiness',
            'kemampuan_analitis' => 'Analytical Ability',
        ],
        'interest' => [
            'minat_pribadi' => 'Personal Interest',
            'prospek_karier' => 'Career Prospect',
        ],
        'behavioral' => [
            'minat' => 'Behavioral Interest',
            'logika' => 'Logic Ability',
            'konsistensi' => 'Consistency',
        ],
    ];

    /**
     * Build the full comparison matrix for the given major IDs.
     *
     * @param  int[]  $majorIds
     * @param  array  $userBehavioral  The user's behavioral_profile from their Assessment
     */
    public function buildComparisonMatrix(array $majorIds, array $userBehavioral): array
    {
        $majors = Major::query()->whereIn('id', $majorIds)->get();

        $matrix = [];

        foreach ($this->comparisonDimensions as $category => $dimensions) {
            $matrix[$category] = [
                'category_name' => $this->getCategoryName($category),
                'dimensions' => [],
            ];

            foreach ($dimensions as $key => $label) {
                $dimensionData = [
                    'label' => $label,
                    'values' => [],
                    'user_value' => $userBehavioral[$key] ?? null,
                    'best_major_id' => null,
                    'worst_major_id' => null,
                ];

                $bestVal = -INF;
                $worstVal = INF;

                foreach ($majors as $major) {
                    $value = $major->behavioral_profile[$key] ?? ($major->criteria_scores[$key] ?? 0);
                    $gap = $dimensionData['user_value'] !== null
                        ? round($dimensionData['user_value'] - $value, 2)
                        : null;

                    $dimensionData['values'][$major->id] = [
                        'raw' => round((float) $value, 2),
                        'gap' => $gap,
                        'gap_status' => $gap === null ? 'unknown' : ($gap >= 0 ? 'exceed' : 'deficit'),
                    ];

                    if ($value > $bestVal) {
                        $bestVal = $value;
                        $dimensionData['best_major_id'] = $major->id;
                    }
                    if ($value < $worstVal) {
                        $worstVal = $value;
                        $dimensionData['worst_major_id'] = $major->id;
                    }
                }

                $matrix[$category]['dimensions'][$key] = $dimensionData;
            }
        }

        return [
            'matrix' => $matrix,
            'highlights' => $this->identifyHighlights($majors, $userBehavioral),
        ];
    }

    /**
     * Generate spider-chart data for a set of majors.
     *
     * Uses all available keys from both criteria_scores and behavioral_profile
     * on each Major, merging them into a comprehensive spider chart.
     */
    public function buildSpiderData(array $majorIds, array $userBehavioral): array
    {
        $majors = Major::query()->whereIn('id', $majorIds)->get();

        // Collect all unique keys across both criteria_scores and behavioral_profile
        $allKeys = [];

        foreach ($majors as $major) {
            foreach (array_keys($major->criteria_scores ?? []) as $k) {
                $allKeys[$k] = true;
            }
            foreach (array_keys($major->behavioral_profile ?? []) as $k) {
                $allKeys[$k] = true;
            }
        }

        // Also include user behavioral keys
        foreach (array_keys($userBehavioral) as $k) {
            $allKeys[$k] = true;
        }

        // Build axes from available keys
        $labelMap = [
            'minat_pribadi' => 'Personal Interest',
            'kemampuan_analitis' => 'Analytical',
            'prospek_karier' => 'Career Prospect',
            'kesiapan_akademik' => 'Readiness',
            'minat' => 'Interest',
            'logika' => 'Logic',
            'konsistensi' => 'Consistency',
            // User-derived psychometric dimensions
            'minat_stem' => 'STEM',
            'minat_seni' => 'Arts',
            'minat_sosial' => 'Social',
            'minat_manajemen' => 'Management',
            'daya_juang' => 'Perseverance',
            'logika_matematika' => 'Math Logic',
        ];

        $axes = [];
        foreach (array_keys($allKeys) as $key) {
            $axes[] = ['key' => $key, 'label' => $labelMap[$key] ?? ucfirst(str_replace('_', ' ', $key))];
        }

        $series = [];

        // User series
        $userValues = [];
        foreach ($axes as $axis) {
            $userValues[] = round((float) ($userBehavioral[$axis['key']] ?? 0), 2);
        }
        $series[] = ['id' => 'user', 'name' => 'Your Profile', 'values' => $userValues];

        // Major series
        foreach ($majors as $major) {
            $majorValues = [];
            foreach ($axes as $axis) {
                $val = $major->behavioral_profile[$axis['key']]
                    ?? ($major->criteria_scores[$axis['key']] ?? 0);
                $majorValues[] = round((float) $val, 2);
            }
            $series[] = ['id' => $major->id, 'name' => $major->name, 'values' => $majorValues];
        }

        return ['axes' => $axes, 'series' => $series];
    }

    private function getCategoryName(string $category): string
    {
        return match ($category) {
            'academic' => 'Academic Competency',
            'interest' => 'Interest & Personality Fit',
            'behavioral' => 'Behavioral Profile',
            default => ucfirst($category),
        };
    }

    private function identifyHighlights($majors, array $userBehavioral): array
    {
        $fitScores = [];

        foreach ($majors as $major) {
            $profile = $major->behavioral_profile ?? [];
            $scores = $major->criteria_scores ?? [];
            $merged = array_merge($scores, $profile);
            $totalGap = 0;
            $count = 0;

            foreach ($userBehavioral as $key => $userVal) {
                if (isset($merged[$key])) {
                    $totalGap += abs($userVal - $merged[$key]);
                    $count++;
                }
            }

            $fitScores[$major->id] = $count > 0
                ? round(100 - ($totalGap / $count), 1)
                : 50;
        }

        arsort($fitScores);
        $bestFitId = array_key_first($fitScores);
        $bestFitMajor = $majors->firstWhere('id', $bestFitId);

        return [
            'best_fit' => [
                'major_id' => $bestFitId,
                'major_name' => $bestFitMajor?->name ?? 'N/A',
                'score' => $fitScores[$bestFitId] ?? 0,
            ],
        ];
    }
}
