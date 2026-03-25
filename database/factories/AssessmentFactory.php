<?php

namespace Database\Factories;

use App\Models\Assessment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Assessment>
 */
class AssessmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_name' => fake()->name(),
            'mode' => 'primary',
            'label' => null,
            'parent_assessment_id' => null,
            'criterion_order' => [
                'minat_pribadi',
                'kemampuan_analitis',
                'prospek_karier',
                'kesiapan_akademik',
            ],
            'pairwise_matrix' => [
                [1, 3, 5, 7],
                [1 / 3, 1, 3, 5],
                [1 / 5, 1 / 3, 1, 3],
                [1 / 7, 1 / 5, 1 / 3, 1],
            ],
            'criterion_weights' => [
                'minat_pribadi' => 0.55,
                'kemampuan_analitis' => 0.24,
                'prospek_karier' => 0.14,
                'kesiapan_akademik' => 0.07,
            ],
            'consistency_ratio' => 0.08,
            'behavioral_profile' => [
                'minat' => fake()->numberBetween(60, 95),
                'logika' => fake()->numberBetween(60, 95),
                'konsistensi' => fake()->numberBetween(60, 95),
            ],
            'summary' => [
                'lambda_max' => 4.2432,
                'consistency_index' => 0.0811,
            ],
        ];
    }
}
