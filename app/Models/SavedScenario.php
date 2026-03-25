<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedScenario extends Model
{
    protected $fillable = [
        'user_id',
        'assessment_id',
        'scenario_name',
        'scenario_description',
        'adjustments',
        'recommendations',
        'stability_metrics',
        'is_favorite',
        'tags'
    ];
    
    protected $casts = [
        'adjustments' => 'array',
        'recommendations' => 'array',
        'stability_metrics' => 'array',
        'is_favorite' => 'boolean',
        'tags' => 'array'
    ];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }
}
