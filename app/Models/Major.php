<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Major extends Model
{
    /** @use HasFactory<\Database\Factories\MajorFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'criteria_scores',
        'behavioral_profile',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'criteria_scores' => 'array',
            'behavioral_profile' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function recommendationResults(): HasMany
    {
        return $this->hasMany(RecommendationResult::class);
    }
}
