<?php

namespace App\Services\DecisionSupport;

class TopsisService
{
    public function rank(array $alternatives, array $criteria, array $weights): array
    {
        $slugs = array_map(fn (array $criterion): string => $criterion['slug'], $criteria);
        $denominators = [];

        foreach ($slugs as $slug) {
            $sumSquares = 0.0;

            foreach ($alternatives as $alternative) {
                $value = (float) ($alternative['scores'][$slug] ?? 0);
                $sumSquares += $value ** 2;
            }

            $denominators[$slug] = $sumSquares > 0 ? sqrt($sumSquares) : 1.0;
        }

        $weightedMatrix = [];

        foreach ($alternatives as $alternative) {
            $row = [];

            foreach ($criteria as $criterion) {
                $slug = $criterion['slug'];
                $value = (float) ($alternative['scores'][$slug] ?? 0);
                $normalized = $value / $denominators[$slug];
                $row[$slug] = $normalized * ($weights[$slug] ?? 0.0);
            }

            $weightedMatrix[$alternative['id']] = $row;
        }

        $idealPositive = [];
        $idealNegative = [];

        foreach ($criteria as $criterion) {
            $slug = $criterion['slug'];
            $column = array_column($weightedMatrix, $slug);

            if (($criterion['type'] ?? 'benefit') === 'cost') {
                $idealPositive[$slug] = min($column);
                $idealNegative[$slug] = max($column);
            } else {
                $idealPositive[$slug] = max($column);
                $idealNegative[$slug] = min($column);
            }
        }

        $results = [];

        foreach ($alternatives as $alternative) {
            $weightedScores = $weightedMatrix[$alternative['id']];
            $distancePositive = 0.0;
            $distanceNegative = 0.0;

            foreach ($criteria as $criterion) {
                $slug = $criterion['slug'];
                $distancePositive += ($weightedScores[$slug] - $idealPositive[$slug]) ** 2;
                $distanceNegative += ($weightedScores[$slug] - $idealNegative[$slug]) ** 2;
            }

            $distancePositive = sqrt($distancePositive);
            $distanceNegative = sqrt($distanceNegative);
            $preference = ($distancePositive + $distanceNegative) > 0
                ? $distanceNegative / ($distancePositive + $distanceNegative)
                : 0.0;

            $results[] = [
                'alternative' => $alternative,
                'weighted_scores' => $weightedScores,
                'distance_positive' => round($distancePositive, 6),
                'distance_negative' => round($distanceNegative, 6),
                'preference' => round($preference, 6),
            ];
        }

        usort(
            $results,
            fn (array $left, array $right): int => $right['preference'] <=> $left['preference'],
        );

        foreach ($results as $index => $result) {
            $results[$index]['rank'] = $index + 1;
        }

        return $results;
    }
}
