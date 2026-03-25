<?php

namespace App\Services\Comparison;

use App\Models\Assessment;
use App\Models\Major;

class DecisionScoringEngine
{
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
        $assessment = Assessment::with('recommendationResults')->findOrFail($assessmentId);
        $majors = Major::query()->whereIn('id', $majorIds)->get();
        $userBehavioral = $assessment->behavioral_profile ?? [];

        // Normalize priorities to sum = 1
        $prioritySum = array_sum($userPriorities);
        $normalizedPriorities = [];
        foreach ($userPriorities as $key => $val) {
            $normalizedPriorities[$key] = $prioritySum > 0 ? $val / $prioritySum : 0.2;
        }

        $scoringDimensions = [
            'algorithmic_fit' => 'Overall algorithmic compatibility',
            'success_probability' => 'Predicted success & completion',
            'career_prospects' => 'Career outlook & salary potential',
            'financial_feasibility' => 'Affordability & ROI',
            'personal_satisfaction' => 'Interest alignment & satisfaction',
        ];

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
            $dimensionScores = [
                'algorithmic_fit' => $rec ? round($rec->final_score * 100, 2) : 0,
                'success_probability' => $this->estimateSuccessProbability($userBehavioral, $majorBehavioral),
                'career_prospects' => $this->estimateCareerScore($major),
                'financial_feasibility' => $this->estimateFinancialScore($major),
                'personal_satisfaction' => $this->estimateSatisfactionScore($userBehavioral, $majorBehavioral),
            ];

            // Weighted total
            $weightedScore = 0;
            $scoreBreakdown = [];
            foreach ($scoringDimensions as $dim => $description) {
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
                if ($score >= 70) {
                    $strengths[] = ['dimension' => $scoringDimensions[$dim], 'score' => $score, 'level' => $score >= 80 ? 'Excellent' : 'Strong'];
                } elseif ($score < 50) {
                    $weaknesses[] = ['dimension' => $scoringDimensions[$dim], 'score' => $score, 'severity' => $score < 35 ? 'High Concern' : 'Moderate Concern'];
                }
            }

            $finalScores[] = [
                'major_id' => $major->id,
                'major_name' => $major->name,
                'final_score' => round($weightedScore, 2),
                'score_breakdown' => $scoreBreakdown,
                'strengths' => $strengths,
                'weaknesses' => $weaknesses,
            ];
        }

        usort($finalScores, fn ($a, $b) => $b['final_score'] <=> $a['final_score']);

        // Priority sensitivity
        $sensitivityScenarios = $this->analyzePrioritySensitivity($majorIds, $assessmentId);

        return [
            'ranked_recommendations' => $finalScores,
            'top_recommendation' => $finalScores[0] ?? null,
            'scoring_dimensions' => $scoringDimensions,
            'sensitivity_scenarios' => $sensitivityScenarios,
        ];
    }

    private function estimateSuccessProbability(array $userProfile, array $majorProfile): float
    {
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
        // Derive from criteria_scores career-related keys
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
        // Interest-weighted alignment
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

    private function analyzePrioritySensitivity(array $majorIds, int $assessmentId): array
    {
        $scenarios = [
            'career_focused' => ['algorithmic_fit' => 15, 'success_probability' => 15, 'career_prospects' => 50, 'financial_feasibility' => 10, 'personal_satisfaction' => 10],
            'safety_focused' => ['algorithmic_fit' => 25, 'success_probability' => 50, 'career_prospects' => 10, 'financial_feasibility' => 10, 'personal_satisfaction' => 5],
            'passion_focused' => ['algorithmic_fit' => 20, 'success_probability' => 10, 'career_prospects' => 10, 'financial_feasibility' => 10, 'personal_satisfaction' => 50],
            'financial_focused' => ['algorithmic_fit' => 10, 'success_probability' => 10, 'career_prospects' => 25, 'financial_feasibility' => 50, 'personal_satisfaction' => 5],
        ];

        $results = [];
        foreach ($scenarios as $name => $priorities) {
            $result = $this->generateFinalRecommendation($majorIds, $assessmentId, $priorities);
            $top = $result['top_recommendation'] ?? null;
            $results[$name] = [
                'top_major' => $top['major_name'] ?? 'N/A',
                'score' => $top['final_score'] ?? 0,
            ];
        }

        return $results;
    }
}
