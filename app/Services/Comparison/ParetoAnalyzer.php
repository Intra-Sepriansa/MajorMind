<?php

namespace App\Services\Comparison;

use App\Models\Major;

class ParetoAnalyzer
{
    /**
     * Calculate Pareto frontier for the given majors across two dimensions.
     *
     * Both dimensions are treated as "higher is better".
     */
    public function calculateParetoFrontier(
        array $majorIds,
        string $dimension1,
        string $dimension2
    ): array {
        $majors = Major::query()->whereIn('id', $majorIds)->get();

        $points = [];
        foreach ($majors as $major) {
            $points[] = [
                'major_id' => $major->id,
                'major_name' => $major->name,
                'x' => (float) ($major->behavioral_profile[$dimension1]
                    ?? ($major->criteria_scores[$dimension1] ?? 0)),
                'y' => (float) ($major->behavioral_profile[$dimension2]
                    ?? ($major->criteria_scores[$dimension2] ?? 0)),
                'is_dominated' => false,
            ];
        }

        // Identify dominated points (classic Pareto dominance)
        $n = count($points);
        for ($i = 0; $i < $n; $i++) {
            for ($j = 0; $j < $n; $j++) {
                if ($i === $j) continue;

                // Point i is dominated if point j is >= in both and strictly > in at least one
                if ($points[$j]['x'] >= $points[$i]['x']
                    && $points[$j]['y'] >= $points[$i]['y']
                    && ($points[$j]['x'] > $points[$i]['x'] || $points[$j]['y'] > $points[$i]['y'])
                ) {
                    $points[$i]['is_dominated'] = true;
                    break;
                }
            }
        }

        // Pareto frontier = non-dominated points, sorted by x
        $frontier = array_values(array_filter($points, fn ($p) => !$p['is_dominated']));
        usort($frontier, fn ($a, $b) => $a['x'] <=> $b['x']);

        return [
            'all_points' => $points,
            'pareto_frontier' => $frontier,
            'dimension_1' => ['key' => $dimension1, 'label' => $this->getDimensionLabel($dimension1)],
            'dimension_2' => ['key' => $dimension2, 'label' => $this->getDimensionLabel($dimension2)],
            'trade_off_analysis' => $this->analyzeTradeOffs($frontier, $dimension1, $dimension2),
        ];
    }

    private function analyzeTradeOffs(array $frontier, string $dim1, string $dim2): array
    {
        $tradeOffs = [];
        $count = count($frontier);

        for ($i = 0; $i < $count - 1; $i++) {
            $current = $frontier[$i];
            $next = $frontier[$i + 1];

            $xGain = $next['x'] - $current['x'];
            $yLoss = $current['y'] - $next['y'];

            $tradeOffs[] = [
                'from_major' => $current['major_name'],
                'to_major' => $next['major_name'],
                'gain_dimension' => $this->getDimensionLabel($dim1),
                'gain_amount' => round($xGain, 2),
                'loss_dimension' => $this->getDimensionLabel($dim2),
                'loss_amount' => round(abs($yLoss), 2),
                'trade_off_ratio' => $yLoss > 0 ? round($xGain / $yLoss, 2) : null,
            ];
        }

        return $tradeOffs;
    }

    private function getDimensionLabel(string $key): string
    {
        $labels = [
            'minat_pribadi' => 'Personal Interest',
            'kemampuan_analitis' => 'Analytical Ability',
            'prospek_karier' => 'Career Prospect',
            'kesiapan_akademik' => 'Academic Readiness',
            'minat' => 'Behavioral Interest',
            'logika' => 'Logic Ability',
            'konsistensi' => 'Consistency',
        ];

        return $labels[$key] ?? ucfirst(str_replace('_', ' ', $key));
    }
}
