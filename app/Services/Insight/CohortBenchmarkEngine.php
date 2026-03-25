<?php

namespace App\Services\Insight;

use App\Models\Assessment;

class CohortBenchmarkEngine
{
    public function benchmark(int $assessmentId): array
    {
        $assessment = Assessment::with('recommendationResults.major')->findOrFail($assessmentId);
        $currentProfile = $assessment->behavioral_profile;
        $currentTopMajorId = $assessment->top_major_id;

        // Find similar assessments (same user excluded, behavioral similarity)
        $allAssessments = Assessment::query()
            ->where('id', '!=', $assessmentId)
            ->where('mode', 'primary')
            ->whereNotNull('behavioral_profile')
            ->latest()
            ->limit(200)
            ->get();

        $cohort = $allAssessments->filter(function (Assessment $other) use ($currentProfile) {
            $otherProfile = $other->behavioral_profile ?? [];
            return $this->computeSimilarity($currentProfile, $otherProfile) >= 0.70;
        })->values();

        $cohortSize = $cohort->count();

        // Behavioral dimension benchmarks
        $dimensionBenchmarks = $this->benchmarkDimensions($currentProfile, $cohort);

        // Cohort major preferences
        $majorPreferences = $this->analyzeMajorPreferences($cohort);

        // Cohort position
        $cohortPosition = $this->computeCohortPosition($currentProfile, $cohort);

        // Peer insights
        $peerInsights = $this->generatePeerInsights($cohortSize, $dimensionBenchmarks, $majorPreferences, $currentTopMajorId);

        return [
            'cohort_size' => $cohortSize,
            'similarity_threshold' => 0.70,
            'dimension_benchmarks' => $dimensionBenchmarks,
            'major_preferences' => $majorPreferences,
            'cohort_position' => $cohortPosition,
            'peer_insights' => $peerInsights,
        ];
    }

    private function computeSimilarity(array $profileA, array $profileB): float
    {
        $dimensions = array_intersect(array_keys($profileA), array_keys($profileB));
        if (empty($dimensions)) return 0;

        $dotProduct = 0;
        $normA = 0;
        $normB = 0;

        foreach ($dimensions as $dim) {
            $a = (float) ($profileA[$dim] ?? 0);
            $b = (float) ($profileB[$dim] ?? 0);
            $dotProduct += $a * $b;
            $normA += $a * $a;
            $normB += $b * $b;
        }

        $denominator = sqrt($normA) * sqrt($normB);

        return $denominator > 0 ? $dotProduct / $denominator : 0;
    }

    private function benchmarkDimensions(array $currentProfile, $cohort): array
    {
        $benchmarks = [];

        foreach ($currentProfile as $dim => $userScore) {
            $cohortScores = $cohort->map(fn (Assessment $a) => (float) ($a->behavioral_profile[$dim] ?? 0))
                ->filter(fn ($v) => $v > 0)
                ->values()
                ->all();

            if (empty($cohortScores)) {
                continue;
            }

            sort($cohortScores);
            $count = count($cohortScores);
            $mean = array_sum($cohortScores) / $count;
            $median = $count % 2 === 0
                ? ($cohortScores[$count / 2 - 1] + $cohortScores[$count / 2]) / 2
                : $cohortScores[intdiv($count, 2)];

            // Standard deviation
            $variance = 0;
            foreach ($cohortScores as $s) {
                $variance += ($s - $mean) ** 2;
            }
            $stdDev = sqrt($variance / $count);

            // Percentile
            $belowCount = count(array_filter($cohortScores, fn ($s) => $s < $userScore));
            $percentile = round(($belowCount / $count) * 100, 1);

            // Z-score
            $zScore = $stdDev > 0 ? round(($userScore - $mean) / $stdDev, 2) : 0;

            $benchmarks[] = [
                'dimension' => $dim,
                'user_score' => round($userScore, 1),
                'cohort_mean' => round($mean, 1),
                'cohort_median' => round($median, 1),
                'cohort_std_dev' => round($stdDev, 1),
                'percentile' => $percentile,
                'z_score' => $zScore,
                'position' => $percentile >= 75 ? 'Above Average' : ($percentile >= 25 ? 'Average' : 'Below Average'),
                'color' => $percentile >= 75 ? 'emerald' : ($percentile >= 25 ? 'blue' : 'amber'),
            ];
        }

        return $benchmarks;
    }

    private function analyzeMajorPreferences($cohort): array
    {
        $majorCounts = [];

        foreach ($cohort as $assessment) {
            $topMajorId = $assessment->top_major_id;
            if (!$topMajorId) continue;

            if (!isset($majorCounts[$topMajorId])) {
                $majorCounts[$topMajorId] = [
                    'count' => 0,
                    'major_id' => $topMajorId,
                ];
            }
            $majorCounts[$topMajorId]['count']++;
        }

        // Load major names
        $majorIds = array_keys($majorCounts);
        if (!empty($majorIds)) {
            $majors = \App\Models\Major::whereIn('id', $majorIds)->pluck('name', 'id');
            foreach ($majorCounts as $id => &$entry) {
                $entry['major_name'] = $majors[$id] ?? 'Unknown';
            }
        }

        $total = $cohort->count() ?: 1;
        foreach ($majorCounts as &$entry) {
            $entry['percentage'] = round(($entry['count'] / $total) * 100, 1);
        }

        usort($majorCounts, fn ($a, $b) => $b['count'] <=> $a['count']);

        return array_slice(array_values($majorCounts), 0, 10);
    }

    private function computeCohortPosition(array $currentProfile, $cohort): array
    {
        $profileValues = array_values($currentProfile);
        $userAvg = count($profileValues) > 0 ? array_sum($profileValues) / count($profileValues) : 0;

        $cohortAvgs = $cohort->map(function (Assessment $a) {
            $values = array_values($a->behavioral_profile ?? []);
            return count($values) > 0 ? array_sum($values) / count($values) : 0;
        })->all();

        $aboveCount = count(array_filter($cohortAvgs, fn ($v) => $v < $userAvg));
        $total = count($cohortAvgs) ?: 1;
        $overallPercentile = round(($aboveCount / $total) * 100, 1);

        return [
            'user_avg_score' => round($userAvg, 1),
            'overall_percentile' => $overallPercentile,
            'position' => $overallPercentile >= 75 ? 'Top Quartile' : ($overallPercentile >= 50 ? 'Above Median' : ($overallPercentile >= 25 ? 'Below Median' : 'Bottom Quartile')),
            'color' => $overallPercentile >= 75 ? 'emerald' : ($overallPercentile >= 50 ? 'blue' : ($overallPercentile >= 25 ? 'amber' : 'rose')),
        ];
    }

    private function generatePeerInsights(int $cohortSize, array $benchmarks, array $majorPrefs, ?int $currentTopMajorId): array
    {
        $insights = [];

        if ($cohortSize < 5) {
            $insights[] = [
                'icon' => 'ℹ️',
                'text' => "Cohort terlalu kecil ({$cohortSize} profil serupa) untuk analisis statistik yang reliable. Hasil bersifat indikatif.",
            ];
            return $insights;
        }

        $insights[] = [
            'icon' => '👥',
            'text' => "Ditemukan {$cohortSize} pengguna dengan profil behavioral serupa (cosine similarity ≥ 0.70).",
        ];

        // Strongest dimension
        $strongestDim = collect($benchmarks)->sortByDesc('percentile')->first();
        if ($strongestDim) {
            $insights[] = [
                'icon' => '💪',
                'text' => "Dimensi terkuat Anda dibanding cohort: **" . ucfirst($strongestDim['dimension']) .
                    "** (persentil ke-{$strongestDim['percentile']}).",
            ];
        }

        // Most popular major in cohort
        if (!empty($majorPrefs)) {
            $topPref = $majorPrefs[0];
            $insights[] = [
                'icon' => '📊',
                'text' => "Jurusan terpopuler di cohort serupa: **{$topPref['major_name']}** ({$topPref['percentage']}% dari cohort).",
            ];
        }

        // Check if user's top major matches cohort preference
        if ($currentTopMajorId && !empty($majorPrefs)) {
            $matchFound = false;
            foreach ($majorPrefs as $pref) {
                if ($pref['major_id'] === $currentTopMajorId) {
                    $matchFound = true;
                    $insights[] = [
                        'icon' => '✅',
                        'text' => "Rekomendasi Anda sejalan dengan {$pref['percentage']}% dari cohort yang juga memilih jurusan yang sama.",
                    ];
                    break;
                }
            }
            if (!$matchFound) {
                $insights[] = [
                    'icon' => '🔍',
                    'text' => "Rekomendasi Anda berbeda dari preferensi mayoritas cohort — ini menunjukkan profil unik yang memerlukan pendekatan personal.",
                ];
            }
        }

        return $insights;
    }
}
