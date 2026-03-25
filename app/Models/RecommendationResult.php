<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class RecommendationResult extends Model
{
    /** @use HasFactory<\Database\Factories\RecommendationResultFactory> */
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'major_id',
        'rank',
        'topsis_score',
        'behavioral_score',
        'final_score',
        'distance_positive',
        'distance_negative',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'topsis_score' => 'decimal:6',
            'behavioral_score' => 'decimal:6',
            'final_score' => 'decimal:6',
            'distance_positive' => 'decimal:6',
            'distance_negative' => 'decimal:6',
        ];
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }
}
