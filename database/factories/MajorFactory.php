<?php

namespace Database\Factories;

use App\Models\Major;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Major>
 */
class MajorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Major '.fake()->unique()->word(),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->sentence(),
            'criteria_scores' => [
                'minat_pribadi' => fake()->numberBetween(60, 95),
                'kemampuan_analitis' => fake()->numberBetween(60, 95),
                'prospek_karier' => fake()->numberBetween(60, 95),
                'kesiapan_akademik' => fake()->numberBetween(60, 95),
            ],
            'behavioral_profile' => [
                'minat' => fake()->numberBetween(60, 95),
                'logika' => fake()->numberBetween(60, 95),
                'konsistensi' => fake()->numberBetween(60, 95),
            ],
            'is_active' => true,
        ];
    }
}
