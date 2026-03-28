<?php

namespace Database\Factories;

use App\Models\Major;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Major>
 */
class MajorFactory extends Factory
{
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
                'minat_stem' => fake()->numberBetween(20, 95),
                'minat_seni' => fake()->numberBetween(20, 95),
                'minat_sosial' => fake()->numberBetween(20, 95),
                'keteraturan' => fake()->numberBetween(40, 95),
                'daya_juang' => fake()->numberBetween(40, 95),
                'konsistensi' => fake()->numberBetween(40, 95),
                'logika' => fake()->numberBetween(40, 95),
            ],
            'riasec_profile' => [
                'R' => fake()->numberBetween(20, 90),
                'I' => fake()->numberBetween(20, 90),
                'A' => fake()->numberBetween(20, 90),
                'S' => fake()->numberBetween(20, 90),
                'E' => fake()->numberBetween(20, 90),
                'C' => fake()->numberBetween(20, 90),
            ],
            'is_active' => true,
        ];
    }
}
