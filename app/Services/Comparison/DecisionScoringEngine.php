<?php

namespace App\Services\Comparison;

use App\Models\Assessment;
use App\Models\Major;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class DecisionScoringEngine
{
    private const SCORING_DIMENSIONS = [
        'algorithmic_fit' => 'Overall algorithmic compatibility',
        'success_probability' => 'Predicted success & completion',
        'career_prospects' => 'Career outlook & salary potential',
        'financial_feasibility' => 'Affordability & ROI',
        'personal_satisfaction' => 'Interest alignment & satisfaction',
    ];

    private const DEFAULT_PRIORITIES = [
        'algorithmic_fit' => 30,
        'success_probability' => 25,
        'career_prospects' => 20,
        'financial_feasibility' => 15,
        'personal_satisfaction' => 10,
    ];

    private const SENSITIVITY_SCENARIOS = [
        'career_focused' => [
            'algorithmic_fit' => 15,
            'success_probability' => 15,
            'career_prospects' => 50,
            'financial_feasibility' => 10,
            'personal_satisfaction' => 10,
        ],
        'safety_focused' => [
            'algorithmic_fit' => 25,
            'success_probability' => 50,
            'career_prospects' => 10,
            'financial_feasibility' => 10,
            'personal_satisfaction' => 5,
        ],
        'passion_focused' => [
            'algorithmic_fit' => 20,
            'success_probability' => 10,
            'career_prospects' => 10,
            'financial_feasibility' => 10,
            'personal_satisfaction' => 50,
        ],
        'financial_focused' => [
            'algorithmic_fit' => 10,
            'success_probability' => 10,
            'career_prospects' => 25,
            'financial_feasibility' => 50,
            'personal_satisfaction' => 5,
        ],
    ];

    /**
     * Generate weighted multi-criteria final recommendation for comparison.
     *
     * @param  int[]  $majorIds
     * @param  int    $assessmentId  The user's baseline assessment
     * @param  array  $userPriorities  e.g. ['algorithmic_fit' => 30, 'career_prospects' => 20, ...]
     */
    public function generateFinalRecommendation(
        array $majorIds,
        int $assessmentId,
        array $userPriorities
    ): array {
        try {
            $assessment = Assessment::with('recommendationResults')->findOrFail($assessmentId);
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse('Assessment not found.');
        }

        $majors = Major::query()->whereIn('id', $majorIds)->get();

        if ($majors->isEmpty()) {
            return $this->errorResponse('No matching majors found.');
        }

        $userBehavioral = $assessment->behavioral_profile ?? [];

        // Normalize priorities to sum = 1
        $normalizedPriorities = $this->normalizePriorities($userPriorities);

        // Build recommendation lookup
        $recLookup = [];
        foreach ($assessment->recommendationResults as $rec) {
            $recLookup[$rec->major_id] = $rec;
        }

        $finalScores = [];

        foreach ($majors as $major) {
            $rec = $recLookup[$major->id] ?? null;
            $majorBehavioral = $major->behavioral_profile ?? [];

            // Compute raw dimension scores (0-100)
            $dimensionScores = $this->computeDimensionScores($rec, $userBehavioral, $majorBehavioral, $major);

            // Weighted total
            $weightedScore = 0;
            $scoreBreakdown = [];
            foreach (self::SCORING_DIMENSIONS as $dim => $description) {
                $weight = $normalizedPriorities[$dim] ?? 0.2;
                $raw = $dimensionScores[$dim];
                $contribution = round($raw * $weight, 2);
                $weightedScore += $contribution;

                $scoreBreakdown[$dim] = [
                    'raw_score' => $raw,
                    'weight' => round($weight, 3),
                    'contribution' => $contribution,
                    'description' => $description,
                ];
            }

            $strengths = [];
            $weaknesses = [];
            foreach ($dimensionScores as $dim => $score) {
                $dimLabel = self::SCORING_DIMENSIONS[$dim] ?? $dim;
                if ($score >= 70) {
                    $strengths[] = [
                        'dimension' => $dimLabel,
                        'score' => $score,
                        'level' => $score >= 80 ? 'Excellent' : 'Strong',
                    ];
                } elseif ($score < 50) {
                    $weaknesses[] = [
                        'dimension' => $dimLabel,
                        'score' => $score,
                        'severity' => $score < 35 ? 'High Concern' : 'Moderate Concern',
                    ];
                }
            }

            $finalScores[] = [
                'major_id' => $major->id,
                'major_name' => $major->name,
                'final_score' => round($weightedScore, 2),
                'score_breakdown' => $scoreBreakdown,
                'dimension_scores' => $dimensionScores,
                'strengths' => $strengths,
                'weaknesses' => $weaknesses,
            ];
        }

        usort($finalScores, fn ($a, $b) => $b['final_score'] <=> $a['final_score']);

        // Priority sensitivity (non-recursive – uses internal scoring only)
        $sensitivityScenarios = $this->analyzePrioritySensitivity($majors, $recLookup, $userBehavioral);

        return [
            'ranked_recommendations' => $finalScores,
            'top_recommendation' => $finalScores[0] ?? null,
            'scoring_dimensions' => self::SCORING_DIMENSIONS,
            'user_priorities' => $normalizedPriorities,
            'sensitivity_scenarios' => $sensitivityScenarios,
        ];
    }

    // ─── Internal helpers ─────────────────────────────────────────────────

    private function normalizePriorities(array $priorities): array
    {
        // Ensure all dimensions exist
        foreach (self::SCORING_DIMENSIONS as $dim => $_) {
            if (! isset($priorities[$dim])) {
                $priorities[$dim] = self::DEFAULT_PRIORITIES[$dim] ?? 20;
            }
        }

        $sum = array_sum($priorities);
        $normalized = [];
        foreach ($priorities as $key => $val) {
            $normalized[$key] = $sum > 0 ? $val / $sum : 0.2;
        }

        return $normalized;
    }

    private function computeDimensionScores($rec, array $userProfile, array $majorProfile, Major $major): array
    {
        return [
            'algorithmic_fit' => $rec ? round($rec->final_score * 100, 2) : 0,
            'success_probability' => $this->estimateSuccessProbability($userProfile, $majorProfile),
            'career_prospects' => $this->estimateCareerScore($major),
            'financial_feasibility' => $this->estimateFinancialScore($major),
            'personal_satisfaction' => $this->estimateSatisfactionScore($userProfile, $majorProfile),
        ];
    }

    private function estimateSuccessProbability(array $userProfile, array $majorProfile): float
    {
        if (empty($userProfile) || empty($majorProfile)) {
            return 50.0;
        }

        $totalAlignment = 0;
        $count = 0;

        foreach ($majorProfile as $key => $target) {
            if (isset($userProfile[$key])) {
                $diff = abs($userProfile[$key] - $target);
                $totalAlignment += max(0, 100 - $diff);
                $count++;
            }
        }

        return $count > 0 ? round($totalAlignment / $count, 1) : 50;
    }

    private function estimateCareerScore(Major $major): float
    {
        $scores = $major->criteria_scores ?? [];
        $career = $scores['prospek_karir'] ?? ($scores['career'] ?? 60);

        return round(min(100, max(0, (float) $career)), 1);
    }

    private function estimateFinancialScore(Major $major): float
    {
        $scores = $major->criteria_scores ?? [];
        $financial = $scores['biaya'] ?? ($scores['financial'] ?? 60);

        // Invert: lower cost → higher score
        return round(min(100, max(0, 100 - (float) $financial)), 1);
    }

    private function estimateSatisfactionScore(array $userProfile, array $majorProfile): float
    {
        if (empty($userProfile) || empty($majorProfile)) {
            return 50.0;
        }

        $interestKeys = ['minat_stem', 'minat_seni', 'minat_sosial', 'minat_manajemen'];
        $total = 0;
        $count = 0;

        foreach ($interestKeys as $key) {
            if (isset($userProfile[$key], $majorProfile[$key])) {
                $diff = abs($userProfile[$key] - $majorProfile[$key]);
                $total += max(0, 100 - $diff * 1.5);
                $count++;
            }
        }

        return $count > 0 ? round($total / $count, 1) : 50;
    }

    /**
     * Non-recursive sensitivity analysis: runs scoring inline instead of calling
     * generateFinalRecommendation again.
     */
    private function analyzePrioritySensitivity($majors, array $recLookup, array $userBehavioral): array
    {
        $results = [];

        foreach (self::SENSITIVITY_SCENARIOS as $scenarioName => $priorities) {
            $normalized = $this->normalizePriorities($priorities);
            $best = null;
            $bestScore = -1;

            foreach ($majors as $major) {
                $rec = $recLookup[$major->id] ?? null;
                $majorBehavioral = $major->behavioral_profile ?? [];
                $dimensionScores = $this->computeDimensionScores($rec, $userBehavioral, $majorBehavioral, $major);

                $weightedScore = 0;
                foreach (self::SCORING_DIMENSIONS as $dim => $_) {
                    $weight = $normalized[$dim] ?? 0.2;
                    $weightedScore += $dimensionScores[$dim] * $weight;
                }
                $weightedScore = round($weightedScore, 2);

                if ($weightedScore > $bestScore) {
                    $bestScore = $weightedScore;
                    $best = $major->name;
                }
            }

            $results[$scenarioName] = [
                'top_major' => $best ?? 'N/A',
                'score' => $bestScore,
                'priorities' => $normalized,
            ];
        }

        return $results;
    }

    private function errorResponse(string $message): array
    {
        return [
            'ranked_recommendations' => [],
            'top_recommendation' => null,
            'scoring_dimensions' => self::SCORING_DIMENSIONS,
            'user_priorities' => [],
            'sensitivity_scenarios' => [],
            'error' => $message,
        ];
    }
}
