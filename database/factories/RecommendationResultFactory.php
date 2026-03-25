<?php

namespace Database\Factories;

use App\Models\RecommendationResult;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RecommendationResult>
 */
class RecommendationResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rank' => fake()->numberBetween(1, 5),
            'topsis_score' => fake()->randomFloat(6, 0.4, 0.95),
            'behavioral_score' => fake()->randomFloat(6, 0.4, 0.95),
            'final_score' => fake()->randomFloat(6, 0.4, 0.95),
            'distance_positive' => fake()->randomFloat(6, 0.01, 0.8),
            'distance_negative' => fake()->randomFloat(6, 0.01, 0.8),
            'meta' => [
                'probability_percentage' => fake()->randomFloat(2, 40, 95),
            ],
        ];
    }
}
