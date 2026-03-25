<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\Comparison\AlgorithmBreakdownAnalyzer;
use App\Services\Comparison\ComparisonMatrixBuilder;
use App\Services\Comparison\DecisionScoringEngine;
use App\Services\Comparison\ParetoAnalyzer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComparisonController
{
    public function matrix(Request $request, ComparisonMatrixBuilder $builder): JsonResponse
    {
        $request->validate([
            'major_ids' => 'required|array|min:2|max:5',
            'major_ids.*' => 'integer|exists:majors,id',
        ]);

        $assessment = $request->user()
            ->assessments()
            ->whereNull('parent_assessment_id')
            ->latest()
            ->firstOrFail();

        $result = $builder->buildComparisonMatrix(
            $request->input('major_ids'),
            $assessment->behavioral_profile ?? [],
        );

        return response()->json($result);
    }

    public function spiderData(Request $request, ComparisonMatrixBuilder $builder): JsonResponse
    {
        $request->validate([
            'major_ids' => 'required|array|min:2|max:5',
            'major_ids.*' => 'integer|exists:majors,id',
        ]);

        $assessment = $request->user()
            ->assessments()
            ->whereNull('parent_assessment_id')
            ->latest()
            ->firstOrFail();

        $result = $builder->buildSpiderData(
            $request->input('major_ids'),
            $assessment->behavioral_profile ?? [],
        );

        return response()->json($result);
    }

    public function algorithmBreakdown(Request $request, AlgorithmBreakdownAnalyzer $analyzer): JsonResponse
    {
        $request->validate([
            'major_ids' => 'required|array|min:2|max:5',
            'major_ids.*' => 'integer|exists:majors,id',
        ]);

        $assessment = $request->user()
            ->assessments()
            ->whereNull('parent_assessment_id')
            ->latest()
            ->firstOrFail();

        $result = $analyzer->analyzeAlgorithmicDifferences(
            $request->input('major_ids'),
            $assessment->behavioral_profile ?? [],
            $assessment->criterion_weights ?? [],
        );

        return response()->json($result);
    }

    public function pareto(Request $request, ParetoAnalyzer $analyzer): JsonResponse
    {
        $request->validate([
            'major_ids' => 'required|array|min:2|max:5',
            'major_ids.*' => 'integer|exists:majors,id',
            'dimension_1' => 'required|string',
            'dimension_2' => 'required|string',
        ]);

        $result = $analyzer->calculateParetoFrontier(
            $request->input('major_ids'),
            $request->input('dimension_1'),
            $request->input('dimension_2'),
        );

        return response()->json($result);
    }

    public function decisionScore(Request $request, DecisionScoringEngine $engine): JsonResponse
    {
        $request->validate([
            'major_ids' => 'required|array|min:2|max:5',
            'major_ids.*' => 'integer|exists:majors,id',
            'priorities' => 'required|array',
        ]);

        $assessment = $request->user()
            ->assessments()
            ->whereNull('parent_assessment_id')
            ->latest()
            ->firstOrFail();

        $result = $engine->generateFinalRecommendation(
            $request->input('major_ids'),
            $assessment->id,
            $request->input('priorities'),
        );

        return response()->json($result);
    }
}
