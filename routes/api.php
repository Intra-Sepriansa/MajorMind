<?php

use App\Http\Controllers\Api\V1\AssessmentController;
use App\Http\Controllers\Api\V1\CriterionController;
use App\Http\Controllers\Api\V1\MajorController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('criteria', [CriterionController::class, 'index'])->name('api.v1.criteria.index');
    Route::get('majors', [MajorController::class, 'index'])->name('api.v1.majors.index');
    Route::post('assessments', [AssessmentController::class, 'store'])
        ->middleware('web')
        ->withoutMiddleware(VerifyCsrfToken::class)
        ->name('api.v1.assessments.store');
    Route::get('assessments/{assessment}', [AssessmentController::class, 'show'])->name('api.v1.assessments.show');
    Route::patch('assessments/{assessment}/scenario', [AssessmentController::class, 'updateScenario'])
        ->middleware('web')
        ->withoutMiddleware(VerifyCsrfToken::class)
        ->name('api.v1.assessments.scenario.update');
    Route::delete('assessments/{assessment}/scenario', [AssessmentController::class, 'destroyScenario'])
        ->middleware('web')
        ->withoutMiddleware(VerifyCsrfToken::class)
        ->name('api.v1.assessments.scenario.destroy');
});
