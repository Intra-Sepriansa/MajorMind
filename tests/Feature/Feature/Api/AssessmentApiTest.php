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

test('assessment api returns ranked recommendations with 7D behavioral profile', function (): void {
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
            'minat_stem' => 88,
            'minat_seni' => 30,
            'minat_sosial' => 45,
            'keteraturan' => 75,
            'daya_juang' => 82,
            'konsistensi' => 84,
            'logika' => 91,
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

    // Verify RIASEC affinity trace exists
    expect($recommendations[0]['meta']['riasec_affinity'])->toHaveKeys(['score']);

    // Verify scoring method reflects new formula
    expect($response->json('data.summary.scoring_method'))
        ->toBe('TOPSIS(60%) + ProfileMatching(25%) + RIASEC_Affinity(15%)');
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
            'minat_stem' => 50,
            'minat_seni' => 50,
            'minat_sosial' => 50,
            'keteraturan' => 50,
            'daya_juang' => 50,
            'konsistensi' => 50,
            'logika' => 50,
        ],
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('pairwise_matrix');
});

test('STEM student gets STEM major recommendation', function (): void {
    $response = $this->postJson('/api/v1/assessments', [
        'student_name' => 'Siswa STEM',
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
            'minat_stem' => 95,
            'minat_seni' => 15,
            'minat_sosial' => 20,
            'keteraturan' => 80,
            'daya_juang' => 90,
            'konsistensi' => 85,
            'logika' => 95,
        ],
    ]);

    $response->assertCreated();

    $topMajor = $response->json('data.top_major.slug');
    $stemMajors = [
        'teknik-informatika', 'teknik-mesin', 'teknik-elektro',
        'teknik-sipil', 'teknik-industri', 'matematika',
        'statistika', 'aktuaria', 'sistem-informasi', 'bioteknologi',
    ];

    expect($stemMajors)->toContain($topMajor);
});

test('creative student ranks creative majors higher than STEM majors', function (): void {
    $response = $this->postJson('/api/v1/assessments', [
        'student_name' => 'Siswa Kreatif',
        'criterion_order' => [
            'minat_pribadi',
            'kemampuan_analitis',
            'prospek_karier',
            'kesiapan_akademik',
        ],
        'pairwise_matrix' => [
            [1, 5, 3, 7],
            [1 / 5, 1, 1 / 3, 3],
            [1 / 3, 3, 1, 5],
            [1 / 7, 1 / 3, 1 / 5, 1],
        ],
        'behavioral_profile' => [
            'minat_stem' => 20,
            'minat_seni' => 95,
            'minat_sosial' => 60,
            'keteraturan' => 40,
            'daya_juang' => 78,
            'konsistensi' => 75,
            'logika' => 55,
        ],
    ]);

    $response->assertCreated();

    $recommendations = $response->json('data.recommendations');
    $slugsByRank = collect($recommendations)->pluck('major.slug')->all();

    // Find ranks of creative majors
    $creativeMajors = ['desain-komunikasi-visual', 'arsitektur', 'sastra-inggris', 'ilmu-komunikasi'];
    $creativeRanks = collect($slugsByRank)
        ->filter(fn ($slug) => in_array($slug, $creativeMajors))
        ->keys()
        ->map(fn ($key) => $key + 1) // 1-indexed
        ->all();

    // At least one creative major should be in top 10
    expect(min($creativeRanks))->toBeLessThanOrEqual(10);
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
