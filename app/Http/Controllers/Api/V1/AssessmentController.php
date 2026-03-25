<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\StoreAssessmentRequest;
use App\Http\Requests\UpdateScenarioRequest;
use App\Http\Resources\RecommendationResultResource;
use App\Models\Assessment;
use App\Services\DecisionSupport\RecommendationEngine;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AssessmentController extends Controller
{
    public function __construct(
        private readonly RecommendationEngine $recommendationEngine,
    ) {
    }

    public function store(StoreAssessmentRequest $request): JsonResponse
    {
        $assessment = $this->recommendationEngine->run(
            $request->validated(),
            $request->user()?->id,
        );

        return (new RecommendationResultResource(
            $assessment->load(['topMajor', 'recommendationResults.major']),
        ))->response()->setStatusCode(201);
    }

    public function show(Assessment $assessment): JsonResponse
    {
        return (new RecommendationResultResource(
            $assessment->load(['topMajor', 'recommendationResults.major']),
        ))->response();
    }

    public function updateScenario(
        UpdateScenarioRequest $request,
        Assessment $assessment,
    ): JsonResponse {
        abort_if($assessment->mode !== 'scenario', Response::HTTP_UNPROCESSABLE_ENTITY);
        $this->claimOrAuthorizeScenario($assessment, $request);

        $assessment->update($request->validated());

        return (new RecommendationResultResource(
            $assessment->load(['topMajor', 'recommendationResults.major']),
        ))->response();
    }

    public function destroyScenario(
        Request $request,
        Assessment $assessment,
    ): JsonResponse {
        abort_if($assessment->mode !== 'scenario', Response::HTTP_UNPROCESSABLE_ENTITY);
        $this->claimOrAuthorizeScenario($assessment, $request);

        $assessment->recommendationResults()->delete();
        $assessment->delete();

        return response()->json([
            'message' => 'Scenario deleted.',
        ]);
    }

    private function claimOrAuthorizeScenario(Assessment $assessment, Request $request): void
    {
        $user = $request->user();

        if (! $user) {
            return;
        }

        if ($assessment->user_id === $user->id) {
            return;
        }

        if (
            $assessment->user_id === null
            && $assessment->parentAssessment?->user_id === $user->id
        ) {
            $assessment->update([
                'user_id' => $user->id,
            ]);

            return;
        }

        abort(Response::HTTP_FORBIDDEN);
    }
}
