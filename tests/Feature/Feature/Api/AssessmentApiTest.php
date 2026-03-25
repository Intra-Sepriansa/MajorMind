<?php

use App\Models\Assessment;
use App\Models\Major;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->seed();
});

test('assessment api returns ranked recommendations', function (): void {
    $response = $this->postJson('/api/v1/assessments', [
        'student_name' => 'Alya',
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
        'behavioral_profile' => [
            'minat' => 88,
            'logika' => 91,
            'konsistensi' => 84,
        ],
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.student_name', 'Alya')
        ->assertJsonStructure(['data' => [
            'top_major' => ['id', 'name', 'slug'],
            'recommendations',
            'summary' => ['algorithm_agreement', 'scoring_method'],
        ]]);

    // Verify recommendations are ranked and non-empty
    $recommendations = $response->json('data.recommendations');
    expect($recommendations)->not->toBeEmpty();
    expect($recommendations[0]['rank'])->toBe(1);
    expect($recommendations[0]['meta']['profile_matching'])->toHaveKeys([
        'core_factors', 'secondary_factors', 'core_score', 'secondary_score', 'gaps',
    ]);
    expect($recommendations[0]['meta']['saw_verification'])->toHaveKeys(['saw_rank', 'saw_score']);
});

test('assessment api rejects inconsistent ahp matrix', function (): void {
    $response = $this->postJson('/api/v1/assessments', [
        'student_name' => 'Bima',
        'criterion_order' => [
            'minat_pribadi',
            'kemampuan_analitis',
            'prospek_karier',
            'kesiapan_akademik',
        ],
        'pairwise_matrix' => [
            [1, 9, 1 / 9, 5],
            [1 / 9, 1, 9, 1 / 7],
            [9, 1 / 9, 1, 3],
            [1 / 5, 7, 1 / 3, 1],
        ],
        'behavioral_profile' => [
            'minat' => 70,
            'logika' => 72,
            'konsistensi' => 68,
        ],
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('pairwise_matrix');
});

test('authenticated user can fetch paginated assessment history', function (): void {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $major = Major::query()->firstOrFail();

    Assessment::factory()
        ->count(3)
        ->for($user)
        ->state(
            new \Illuminate\Database\Eloquent\Factories\Sequence(
                fn ($sequence) => [
                    'created_at' => Carbon::parse('2026-03-24 10:00:00')->subDays($sequence->index),
                    'summary' => [
                        'recommendation_confidence' => 92 - ($sequence->index * 4),
                    ],
                    'top_major_id' => $major->id,
                ],
            ),
        )
        ->create();

    Assessment::factory()
        ->for($otherUser)
        ->create([
            'summary' => ['recommendation_confidence' => 51],
            'top_major_id' => $major->id,
        ]);

    $response = $this
        ->actingAs($user)
        ->getJson('/api/v1/assessment-history?per_page=2');

    $response->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.last_page', 2)
        ->assertJsonPath('meta.per_page', 2)
        ->assertJsonPath('meta.total', 3)
        ->assertJsonPath('data.0.top_major.id', $major->id)
        ->assertJsonPath('data.0.confidence', 92);
});
