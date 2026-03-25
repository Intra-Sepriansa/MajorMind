<?php

use App\Http\Resources\RecommendationResultResource;
use App\Http\Controllers\Api\V1\ScenarioLabController;
use App\Http\Controllers\Api\V1\ComparisonController;
use App\Http\Controllers\Api\V1\InsightController;
use App\Models\Assessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/assessment', 'assessment')->name('assessment');

$resolveUserAssessmentState = function (Request $request): array {
    $assessment = Assessment::query()
        ->where('user_id', $request->user()->id)
        ->where('mode', 'primary')
        ->latest()
        ->first();

    $assessmentHistory = Assessment::query()
        ->where('user_id', $request->user()->id)
        ->where('mode', 'primary')
        ->with('topMajor')
        ->latest()
        ->paginate(5);

    $assessmentHistoryItems = $assessmentHistory
        ->getCollection()
        ->map(fn (Assessment $historyItem): array => [
            'id' => $historyItem->id,
            'student_name' => $historyItem->student_name,
            'created_at' => $historyItem->created_at?->toIso8601String(),
            'consistency_ratio' => (float) $historyItem->consistency_ratio,
            'confidence' => (float) ($historyItem->summary['recommendation_confidence'] ?? 0),
            'top_major' => $historyItem->topMajor ? [
                'id' => $historyItem->topMajor->id,
                'name' => $historyItem->topMajor->name,
                'slug' => $historyItem->topMajor->slug,
            ] : null,
        ])
        ->values()
        ->all();

    if ($assessment) {
        $assessment->load(['topMajor', 'recommendationResults.major']);
    }

    return [
        'assessmentHistory' => [
            'data' => $assessmentHistoryItems,
            'meta' => [
                'current_page' => $assessmentHistory->currentPage(),
                'last_page' => $assessmentHistory->lastPage(),
                'per_page' => $assessmentHistory->perPage(),
                'total' => $assessmentHistory->total(),
            ],
        ],
        'initialAssessment' => $assessment
            ? RecommendationResultResource::make($assessment)->resolve($request)
            : null,
    ];
};

$resolveScenarioState = function (Request $request) use ($resolveUserAssessmentState): array {
    $baseState = $resolveUserAssessmentState($request);
    $initialAssessment = $baseState['initialAssessment'];
    $scenarios = [];

    if ($initialAssessment) {
        $scenarioModels = Assessment::query()
            ->where('user_id', $request->user()->id)
            ->where('mode', 'scenario')
            ->where('parent_assessment_id', $initialAssessment['id'])
            ->with(['topMajor', 'recommendationResults.major'])
            ->latest()
            ->get();

        $scenarios = $scenarioModels
            ->map(fn (Assessment $scenario): array => RecommendationResultResource::make($scenario)->resolve($request))
            ->all();
    }

    return [
        ...$baseState,
        'scenarios' => $scenarios,
    ];
};

Route::middleware(['auth', 'verified'])->group(function () use (
    $resolveScenarioState,
    $resolveUserAssessmentState,
) {
    Route::get('/api/v1/assessment-history', function (Request $request) {
        $perPage = min(max((int) $request->query('per_page', 5), 1), 20);

        $history = Assessment::query()
            ->where('user_id', $request->user()->id)
            ->where('mode', 'primary')
            ->with('topMajor')
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => $history->getCollection()->map(fn (Assessment $historyItem): array => [
                'id' => $historyItem->id,
                'student_name' => $historyItem->student_name,
                'created_at' => $historyItem->created_at?->toIso8601String(),
                'consistency_ratio' => (float) $historyItem->consistency_ratio,
                'confidence' => (float) ($historyItem->summary['recommendation_confidence'] ?? 0),
                'top_major' => $historyItem->topMajor ? [
                    'id' => $historyItem->topMajor->id,
                    'name' => $historyItem->topMajor->name,
                    'slug' => $historyItem->topMajor->slug,
                ] : null,
            ])->values()->all(),
            'meta' => [
                'current_page' => $history->currentPage(),
                'last_page' => $history->lastPage(),
                'per_page' => $history->perPage(),
                'total' => $history->total(),
            ],
        ]);
    })->name('api.v1.assessment-history.index');

    Route::get('dashboard', function (Request $request) use ($resolveUserAssessmentState) {
        $claimNotice = null;
        $claimId = (int) $request->query('claim', 0);

        if ($claimId > 0) {
            $claimableAssessment = Assessment::query()
                ->whereKey($claimId)
                ->whereNull('user_id')
                ->first();

            if ($claimableAssessment) {
                $claimableAssessment->update([
                    'user_id' => $request->user()->id,
                ]);

                $claimNotice = 'Guest assessment berhasil diklaim ke akun ini.';
            }
        }

        return Inertia::render('dashboard', [
            'claimNotice' => $claimNotice,
            ...$resolveUserAssessmentState($request),
        ]);
    })->name('dashboard');

    Route::get('/dashboard/{assessment}/export-pdf', [\App\Http\Controllers\DashboardPdfController::class, 'exportPdf'])
        ->name('dashboard.export-pdf');

    Route::get('/comparison/export-pdf', [\App\Http\Controllers\ComparisonPdfController::class, 'exportPdf'])
        ->name('comparison.export-pdf');

    Route::get('/insight/{assessment}/export-pdf', [\App\Http\Controllers\InsightPdfController::class, 'exportPdf'])
        ->name('insight.export-pdf');

    // Advanced Scenario Lab API Routes
    Route::post('/api/v1/scenario-lab/recalculate', [ScenarioLabController::class, 'recalculate'])
        ->name('api.v1.scenario-lab.recalculate');
    Route::post('/api/v1/scenario-lab/sensitivity/{assessmentId}', [ScenarioLabController::class, 'sensitivity'])
        ->name('api.v1.scenario-lab.sensitivity');
    Route::post('/api/v1/scenario-lab/compare', [ScenarioLabController::class, 'compare'])
        ->name('api.v1.scenario-lab.compare');
    Route::post('/api/v1/scenario-lab/monte-carlo', [ScenarioLabController::class, 'monteCarlo'])
        ->name('api.v1.scenario-lab.monte-carlo');
    Route::post('/api/v1/scenario-lab/save', [ScenarioLabController::class, 'saveScenario'])
        ->name('api.v1.scenario-lab.save');

    // Advanced Comparison API Routes
    Route::post('/api/v1/comparison/matrix', [ComparisonController::class, 'matrix'])
        ->name('api.v1.comparison.matrix');
    Route::post('/api/v1/comparison/spider-data', [ComparisonController::class, 'spiderData'])
        ->name('api.v1.comparison.spider-data');
    Route::post('/api/v1/comparison/algorithm-breakdown', [ComparisonController::class, 'algorithmBreakdown'])
        ->name('api.v1.comparison.algorithm-breakdown');
    Route::post('/api/v1/comparison/pareto', [ComparisonController::class, 'pareto'])
        ->name('api.v1.comparison.pareto');
    Route::post('/api/v1/comparison/decision-score', [ComparisonController::class, 'decisionScore'])
        ->name('api.v1.comparison.decision-score');

    // Advanced Insight API Routes
    Route::post('/api/v1/insight/algorithmic', [InsightController::class, 'algorithmic'])
        ->name('api.v1.insight.algorithmic');
    Route::post('/api/v1/insight/psychometric', [InsightController::class, 'psychometric'])
        ->name('api.v1.insight.psychometric');
    Route::post('/api/v1/insight/evidence', [InsightController::class, 'evidence'])
        ->name('api.v1.insight.evidence');
    Route::post('/api/v1/insight/predictive', [InsightController::class, 'predictive'])
        ->name('api.v1.insight.predictive');
    Route::post('/api/v1/insight/sensitivity', [InsightController::class, 'sensitivity'])
        ->name('api.v1.insight.sensitivity');
    Route::post('/api/v1/insight/narrative', [InsightController::class, 'narrative'])
        ->name('api.v1.insight.narrative');
    Route::post('/api/v1/insight/cohort', [InsightController::class, 'cohort'])
        ->name('api.v1.insight.cohort');

    Route::get('/scenario-lab', function (Request $request) use ($resolveScenarioState) {
        return Inertia::render('scenario-lab', [
            ...$resolveScenarioState($request),
        ]);
    })->name('scenario-lab');

    Route::get('/comparison', function (Request $request) use ($resolveScenarioState) {
        return Inertia::render('comparison', [
            ...$resolveScenarioState($request),
        ]);
    })->name('comparison');

    Route::get('/insights', function (Request $request) use ($resolveUserAssessmentState) {
        return Inertia::render('insights', [
            ...$resolveUserAssessmentState($request),
        ]);
    })->name('insights');
});

require __DIR__.'/settings.php';
