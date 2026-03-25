<?php

namespace App\Http\Resources;

use App\Models\Assessment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecommendationResultResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Assessment $assessment */
        $assessment = $this->resource;

        return [
            'id' => $assessment->id,
            'student_name' => $assessment->student_name,
            'mode' => $assessment->mode,
            'label' => $assessment->label,
            'scenario_notes' => $assessment->scenario_notes,
            'decision_rationale' => $assessment->decision_rationale,
            'parent_assessment_id' => $assessment->parent_assessment_id,
            'criterion_order' => $assessment->criterion_order,
            'criterion_weights' => $assessment->criterion_weights,
            'consistency_ratio' => (float) $assessment->consistency_ratio,
            'behavioral_profile' => $assessment->behavioral_profile,
            'top_major' => $assessment->topMajor ? [
                'id' => $assessment->topMajor->id,
                'name' => $assessment->topMajor->name,
                'slug' => $assessment->topMajor->slug,
            ] : null,
            'summary' => $assessment->summary,
            'recommendations' => $assessment->recommendationResults->map(fn ($result): array => [
                'rank' => $result->rank,
                'major' => [
                    'id' => $result->major->id,
                    'name' => $result->major->name,
                    'slug' => $result->major->slug,
                ],
                'topsis_score' => (float) $result->topsis_score,
                'behavioral_score' => (float) $result->behavioral_score,
                'final_score' => (float) $result->final_score,
                'distance_positive' => (float) $result->distance_positive,
                'distance_negative' => (float) $result->distance_negative,
                'meta' => $result->meta,
            ])->all(),
            'created_at' => $assessment->created_at?->toIso8601String(),
        ];
    }
}
