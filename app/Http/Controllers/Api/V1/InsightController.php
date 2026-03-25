<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Insight\AlgorithmicIntelligenceEngine;
use App\Services\Insight\CohortBenchmarkEngine;
use App\Services\Insight\EvidenceJustificationEngine;
use App\Services\Insight\NarrativeInsightEngine;
use App\Services\Insight\PredictiveSuccessEngine;
use App\Services\Insight\PsychometricValidationEngine;
use App\Services\Insight\SensitivityAnalysisEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InsightController extends Controller
{
    public function algorithmic(
        Request $request,
        AlgorithmicIntelligenceEngine $engine,
    ): JsonResponse {
        $request->validate(['assessment_id' => 'required|integer|exists:assessments,id']);

        return response()->json(
            $engine->analyze($request->integer('assessment_id')),
        );
    }

    public function psychometric(
        Request $request,
        PsychometricValidationEngine $engine,
    ): JsonResponse {
        $request->validate(['assessment_id' => 'required|integer|exists:assessments,id']);

        return response()->json(
            $engine->validate($request->integer('assessment_id')),
        );
    }

    public function evidence(
        Request $request,
        EvidenceJustificationEngine $engine,
    ): JsonResponse {
        $request->validate([
            'assessment_id' => 'required|integer|exists:assessments,id',
            'major_id' => 'required|integer|exists:majors,id',
        ]);

        return response()->json(
            $engine->generate(
                $request->integer('assessment_id'),
                $request->integer('major_id'),
            ),
        );
    }

    public function predictive(
        Request $request,
        PredictiveSuccessEngine $engine,
    ): JsonResponse {
        $request->validate([
            'assessment_id' => 'required|integer|exists:assessments,id',
            'major_id' => 'required|integer|exists:majors,id',
        ]);

        return response()->json(
            $engine->predict(
                $request->integer('assessment_id'),
                $request->integer('major_id'),
            ),
        );
    }

    public function sensitivity(
        Request $request,
        SensitivityAnalysisEngine $engine,
    ): JsonResponse {
        $request->validate(['assessment_id' => 'required|integer|exists:assessments,id']);

        return response()->json(
            $engine->analyze($request->integer('assessment_id')),
        );
    }

    public function narrative(
        Request $request,
        NarrativeInsightEngine $engine,
    ): JsonResponse {
        $request->validate(['assessment_id' => 'required|integer|exists:assessments,id']);

        return response()->json(
            $engine->generate($request->integer('assessment_id')),
        );
    }

    public function cohort(
        Request $request,
        CohortBenchmarkEngine $engine,
    ): JsonResponse {
        $request->validate(['assessment_id' => 'required|integer|exists:assessments,id']);

        return response()->json(
            $engine->benchmark($request->integer('assessment_id')),
        );
    }
}
