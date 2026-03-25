<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Services\ScenarioLab\MonteCarloSimulator;
use App\Services\ScenarioLab\ScenarioComputationEngine;
use App\Services\ScenarioLab\ScenarioManager;
use App\Services\ScenarioLab\SensitivityAnalyzer;
use Illuminate\Http\Request;

class ScenarioLabController extends Controller
{
    public function __construct(
        private ScenarioComputationEngine $computationEngine,
        private SensitivityAnalyzer $sensitivityAnalyzer,
        private ScenarioManager $scenarioManager,
        private MonteCarloSimulator $monteCarloSimulator
    ) {}

    public function recalculate(Request $request)
    {
        $request->validate([
            'assessment_id' => 'required|exists:assessments,id',
            'adjustments' => 'required|array'
        ]);

        $assessment = Assessment::findOrFail($request->assessment_id);
        
        // Authorization
        if ($assessment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $results = $this->computationEngine->recalculateScenario(
            $assessment->id,
            $request->adjustments
        );

        return response()->json(['data' => $results]);
    }

    public function sensitivity(Request $request, int $assessmentId)
    {
        $request->validate([
            'adjustments' => 'required|array',
            'ranges' => 'required|array'
        ]);

        $assessment = Assessment::findOrFail($assessmentId);
        
        if ($assessment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $heatmap = $this->sensitivityAnalyzer->generateSensitivityHeatmap(
            $assessmentId,
            $request->adjustments,
            $request->ranges
        );

        return response()->json(['data' => $heatmap]);
    }

    public function compare(Request $request)
    {
        $request->validate([
            'scenario_ids' => 'required|array|min:2',
            'scenario_ids.*' => 'exists:saved_scenarios,id'
        ]);

        try {
            $comparison = $this->scenarioManager->compareScenarios($request->scenario_ids);
            return response()->json(['data' => $comparison]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function monteCarlo(Request $request)
    {
        $request->validate([
            'assessment_id' => 'required|exists:assessments,id',
            'recommendations' => 'required|array',
            'uncertainty_factors' => 'required|array'
        ]);

        $assessment = Assessment::findOrFail($request->assessment_id);
        
        if ($assessment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $outcomes = $this->monteCarloSimulator->simulateOutcomes(
            $assessment->psychometric_profile ?? [],
            $request->recommendations,
            $request->uncertainty_factors
        );

        return response()->json(['data' => $outcomes]);
    }

    public function saveScenario(Request $request)
    {
        $request->validate([
            'assessment_id' => 'required|exists:assessments,id',
            'scenario_name' => 'required|string|max:255',
            'scenario_description' => 'nullable|string',
            'adjustments' => 'required|array',
            'recommendations' => 'required|array',
            'stability_metrics' => 'required|array'
        ]);

        $assessment = Assessment::findOrFail($request->assessment_id);
        
        if ($assessment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $scenario = $this->scenarioManager->saveScenario(
            $request->user()->id,
            $assessment->id,
            $request->scenario_name,
            $request->scenario_description ?? '',
            $request->adjustments,
            $request->recommendations,
            $request->stability_metrics
        );

        return response()->json(['data' => $scenario]);
    }
}
