<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    /** @use HasFactory<\Database\Factories\AssessmentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'parent_assessment_id',
        'student_name',
        'mode',
        'label',
        'scenario_notes',
        'decision_rationale',
        'criterion_order',
        'pairwise_matrix',
        'criterion_weights',
        'consistency_ratio',
        'behavioral_profile',
        'psychometric_profile',
        'top_major_id',
        'summary',
    ];

    protected function casts(): array
    {
        return [
            'criterion_order' => 'array',
            'pairwise_matrix' => 'array',
            'criterion_weights' => 'array',
            'behavioral_profile' => 'array',
            'psychometric_profile' => 'array',
            'summary' => 'array',
            'consistency_ratio' => 'decimal:4',
        ];
    }

    public function parentAssessment(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_assessment_id');
    }

    public function scenarios(): HasMany
    {
        return $this->hasMany(self::class, 'parent_assessment_id')->latest();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function topMajor(): BelongsTo
    {
        return $this->belongsTo(Major::class, 'top_major_id');
    }

    public function recommendationResults(): HasMany
    {
        return $this->hasMany(RecommendationResult::class)->orderBy('rank');
    }
}
