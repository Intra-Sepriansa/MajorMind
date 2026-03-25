<?php

namespace App\Services\DecisionSupport;

/**
 * Simple Additive Weighting (SAW) Service
 *
 * Runs as a cross-verification layer parallel to TOPSIS.
 * If both algorithms agree on the top recommendation,
 * the system's confidence is significantly boosted.
 *
 * SAW Formula: V_i = Σ(w_j × r_ij)
 * where r_ij is the normalized performance value.
 *
 * @see Fishburn, P.C. (1967). Additive Utilities with Incomplete Product Set.
 */
class SawService
{
    /**
     * Calculate SAW ranking for all alternatives.
     *
     * @param  array  $alternatives  Array of ['id', 'name', 'scores' => [...]]
     * @param  array  $criteria      Array of ['slug', 'type' (benefit|cost)]
     * @param  array  $weights       Associative ['slug' => weight]
     * @return array  Ranked results with SAW preference scores
     */
    public function rank(array $alternatives, array $criteria, array $weights): array
    {
        $slugs = array_map(fn (array $c): string => $c['slug'], $criteria);

        // Find max and min for each criterion (for normalization)
        $maxValues = [];
        $minValues = [];

        foreach ($slugs as $slug) {
            $column = array_map(
                fn (array $alt): float => (float) ($alt['scores'][$slug] ?? 0),
                $alternatives,
            );

            $maxValues[$slug] = max($column) ?: 1.0;
            $minValues[$slug] = min($column) ?: 0.0;
        }

        $results = [];

        foreach ($alternatives as $alternative) {
            $sawScore = 0.0;
            $normalizedScores = [];

            foreach ($criteria as $criterion) {
                $slug = $criterion['slug'];
                $value = (float) ($alternative['scores'][$slug] ?? 0);
                $weight = $weights[$slug] ?? 0.0;

                // SAW normalization
                if (($criterion['type'] ?? 'benefit') === 'benefit') {
                    // Benefit: r_ij = x_ij / max(x_ij)
                    $normalized = $maxValues[$slug] > 0
                        ? $value / $maxValues[$slug]
                        : 0.0;
                } else {
                    // Cost: r_ij = min(x_ij) / x_ij
                    $normalized = $value > 0
                        ? $minValues[$slug] / $value
                        : 0.0;
                }

                $normalizedScores[$slug] = round($normalized, 6);
                $sawScore += $weight * $normalized;
            }

            $results[] = [
                'alternative' => $alternative,
                'saw_score' => round($sawScore, 6),
                'normalized_scores' => $normalizedScores,
            ];
        }

        // Sort descending by SAW score
        usort($results, fn (array $a, array $b): int => $b['saw_score'] <=> $a['saw_score']);

        foreach ($results as $index => &$result) {
            $result['rank'] = $index + 1;
        }

        return $results;
    }
}
