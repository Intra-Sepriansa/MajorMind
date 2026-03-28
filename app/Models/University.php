<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class University extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'short_name',
        'location',
        'type',
        'accreditation',
        'logo_url',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the majors offered by this university.
     */
    public function majors(): BelongsToMany
    {
        return $this->belongsToMany(Major::class, 'university_majors')
            ->withPivot([
                'accreditation',
                'capacity',
                'applicants',
                'acceptance_rate',
                'ukt_tier',
            ])
            ->withTimestamps();
    }
}
