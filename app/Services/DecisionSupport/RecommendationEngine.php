<?php

namespace App\Services\DecisionSupport;

use App\Models\Assessment;
use App\Models\Criterion;
use App\Models\Major;
use App\Models\RecommendationResult;
use App\Services\Psychometric\AdaptiveLogicTest;
use App\Services\Psychometric\GritScaleAssessment;
use App\Services\Psychometric\RiasecAssessment;
use App\Services\Validation\ResponseQualityValidator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecommendationEngine
{
    /**
     * Composite scoring formula weights.
     * TOPSIS (decision matrix) + Profile Matching (gap analysis) + RIASEC Affinity (cosine similarity).
     */
    private const TOPSIS_WEIGHT = 0.60;
    private const PROFILE_MATCHING_WEIGHT = 0.25;
    private const RIASEC_AFFINITY_WEIGHT = 0.15;

    /**
     * Hard constraint thresholds for pre-filtering (7D behavioral dimensions).
     *
     * Format: 'major-slug' => ['dimension' => minimum_score]
     * Majors are eliminated BEFORE TOPSIS if the student
     * does not meet the absolute minimum threshold.
     */
    private const HARD_CONSTRAINTS = [
        // Medical cluster — requires extreme perseverance & consistency
        'kedokteran-umum' => ['daya_juang' => 55, 'konsistensi' => 55, 'minat_sosial' => 45],
        'kedokteran-gigi' => ['daya_juang' => 50, 'konsistensi' => 50],
        'farmasi' => ['konsistensi' => 55, 'logika' => 50],

        // MIPA / Heavy Engineering — requires strong logic
        'matematika' => ['logika' => 55, 'minat_stem' => 50],
        'aktuaria' => ['logika' => 55, 'minat_stem' => 45],
        'teknik-elektro' => ['logika' => 50, 'minat_stem' => 45],
        'teknik-mesin' => ['logika' => 50, 'minat_stem' => 45],
        'statistika' => ['logika' => 50, 'minat_stem' => 40],

        // Creative / Passion-driven — requires strong artistic interest
        'desain-komunikasi-visual' => ['minat_seni' => 55],
        'arsitektur' => ['minat_seni' => 40, 'minat_stem' => 35],

        // Education — requires strong social drive
        'pgsd' => ['minat_sosial' => 50, 'daya_juang' => 45],
        'pendidikan-bahasa-inggris' => ['minat_sosial' => 45],
        'pendidikan-matematika' => ['logika' => 45, 'minat_sosial' => 40],

        // IT — requires STEM aptitude
        'teknik-informatika' => ['logika' => 45, 'minat_stem' => 40],
        'sistem-informasi' => ['logika' => 40],
    ];

    public function __construct(
        private readonly AhpService $ahpService,
        private readonly TopsisService $topsisService,
        private readonly ProfileMatchingService $profileMatchingService,
        private readonly SawService $sawService,
        private readonly RiasecAssessment $riasecAssessment,
        private readonly GritScaleAssessment $gritScaleAssessment,
        private readonly AdaptiveLogicTest $adaptiveLogicTest,
        private readonly ResponseQualityValidator $qualityValidator,
    ) {
    }

    public function run(array $payload, ?int $userId = null): Assessment
    {
        $criteria = Criterion::query()
            ->active()
            ->orderBy('display_order')
            ->get();

        $criterionOrder = $payload['criterion_order'];
        $expectedOrder = $criteria->pluck('slug')->all();

        if ($criterionOrder !== $expectedOrder) {
            throw ValidationException::withMessages([
                'criterion_order' => 'Urutan kriteria harus sama dengan kriteria aktif yang dikirim sistem.',
            ]);
        }

        // ── Phase 1: AHP Eigenvector Extraction ──
        $ahp = $this->ahpService->calculate($payload['pairwise_matrix']);

        if (! $ahp['is_consistent']) {
            throw ValidationException::withMessages([
                'pairwise_matrix' => sprintf(
                    'Consistency Ratio terlalu tinggi (%.4f). Nilai harus <= 0.1000.',
                    $ahp['consistency_ratio'],
                ),
            ]);
        }

        $weightsBySlug = [];

        foreach ($criterionOrder as $index => $slug) {
            $weightsBySlug[$slug] = $ahp['weights'][$index];
        }

        $majors = Major::query()
            ->active()
            ->with(['universities' => function ($query) {
                // Eager load universities and sort by acceptance rate (hardest to get into first)
                $query->orderByPivot('acceptance_rate', 'asc');
            }])
            ->orderBy('name')
            ->get();

        if ($majors->isEmpty()) {
            throw ValidationException::withMessages([
                'majors' => 'Belum ada data jurusan aktif untuk dihitung.',
            ]);
        }

        $behavioralProfile = $payload['behavioral_profile'];
        $psychometricResults = null;
        $studentRiasecScores = null;

        // ── Psychometric Enhancement ──
        $psychometricPayload = $payload['psychometric_profile'] ?? null;

        if ($psychometricPayload) {
            $psychometricResults = $this->processPsychometricData($psychometricPayload);

            // Override slider-based behavioral profile with derived scores
            $behavioralProfile = $psychometricResults['derived_behavioral'];
            $studentRiasecScores = $psychometricResults['raw_scores']['riasec']['scores'] ?? null;
        }

        // ── Phase 2: Hard Constraint Elimination (Pre-filter) ──
        $allAlternatives = $majors->map(fn (Major $major): array => [
            'id' => $major->id,
            'name' => $major->name,
            'slug' => $major->slug,
            'scores' => $major->criteria_scores,
            'behavioral_profile' => $major->behavioral_profile ?? [],
            'riasec_profile' => $major->riasec_profile ?? [],
            'universities' => $major->universities->map(fn ($uni) => [
                'id' => $uni->id,
                'name' => $uni->name,
                'short_name' => $uni->short_name,
                'logo_url' => $uni->logo_url,
                'accreditation' => $uni->pivot->accreditation,
                'acceptance_rate' => $uni->pivot->acceptance_rate,
                'capacity' => $uni->pivot->capacity,
                'ukt_tier' => $uni->pivot->ukt_tier,
            ])->all(),
        ])->all();

        $filteredAlternatives = $this->applyHardConstraints($allAlternatives, $behavioralProfile);
        $eliminatedCount = count($allAlternatives) - count($filteredAlternatives);

        // Fallback: if all alternatives are eliminated, use all (no pre-filter)
        if (count($filteredAlternatives) < 3) {
            $filteredAlternatives = $allAlternatives;
            $eliminatedCount = 0;
        }

        $criteriaForTopsis = $criteria->map(fn (Criterion $criterion): array => [
            'slug' => $criterion->slug,
            'type' => $criterion->type,
        ])->all();

        // ── Phase 3: TOPSIS Ranking ──
        $topsisRankings = $this->topsisService->rank($filteredAlternatives, $criteriaForTopsis, $weightsBySlug);

        // ── Phase 4: SAW Cross-Verification ──
        $sawRankings = $this->sawService->rank($filteredAlternatives, $criteriaForTopsis, $weightsBySlug);

        $sawTopId = $sawRankings[0]['alternative']['id'] ?? null;
        $topsisTopId = $topsisRankings[0]['alternative']['id'] ?? null;
        $algorithmsAgree = $sawTopId === $topsisTopId;

        // Build SAW rank lookup for meta
        $sawRankLookup = [];
        foreach ($sawRankings as $sawResult) {
            $sawRankLookup[$sawResult['alternative']['id']] = [
                'rank' => $sawResult['rank'],
                'score' => $sawResult['saw_score'],
            ];
        }

        // ── Phase 5: Profile Matching + RIASEC Affinity + Final Scoring ──
        return DB::transaction(function () use (
            $payload, $userId, $criterionOrder, $ahp,
            $behavioralProfile, $topsisRankings,
            $sawRankLookup, $algorithmsAgree, $eliminatedCount,
            $psychometricResults, $studentRiasecScores,
        ): Assessment {
            $assessment = Assessment::query()->create([
                'user_id' => $userId,
                'parent_assessment_id' => $payload['parent_assessment_id'] ?? null,
                'student_name' => $payload['student_name'] ?? null,
                'mode' => $payload['mode'] ?? 'primary',
                'label' => $payload['label'] ?? null,
                'scenario_notes' => $payload['scenario_notes'] ?? null,
                'decision_rationale' => $payload['decision_rationale'] ?? null,
                'criterion_order' => $criterionOrder,
                'pairwise_matrix' => $payload['pairwise_matrix'],
                'criterion_weights' => $this->roundWeights($criterionOrder, $ahp['weights']),
                'consistency_ratio' => $ahp['consistency_ratio'],
                'behavioral_profile' => $behavioralProfile,
                'psychometric_profile' => $psychometricResults,
                'summary' => [
                    'lambda_max' => $ahp['lambda_max'],
                    'consistency_index' => $ahp['consistency_index'],
                ],
            ]);

            $persistedResults = [];

            foreach ($topsisRankings as $ranking) {
                $majorSlug = $ranking['alternative']['slug'] ?? '';
                $majorBehavioral = $ranking['alternative']['behavioral_profile'] ?? [];
                $majorRiasec = $ranking['alternative']['riasec_profile'] ?? [];

                // Profile Matching (Gap Analysis)
                $profileMatch = $this->profileMatchingService->calculate(
                    $behavioralProfile,
                    $majorBehavioral,
                    $majorSlug,
                );

                $behavioralScore = $profileMatch['score'];

                // RIASEC Affinity (Cosine Similarity)
                $riasecAffinity = 0.5; // Default neutral if no RIASEC data
                if ($studentRiasecScores && ! empty($majorRiasec)) {
                    $riasecAffinity = $this->calculateRiasecAffinity($studentRiasecScores, $majorRiasec);
                }

                // Composite: 60% TOPSIS + 25% Profile Matching + 15% RIASEC Affinity
                $finalScore = ($ranking['preference'] * self::TOPSIS_WEIGHT)
                    + ($behavioralScore * self::PROFILE_MATCHING_WEIGHT)
                    + ($riasecAffinity * self::RIASEC_AFFINITY_WEIGHT);

                // Algorithm agreement confidence bonus
                $majorId = $ranking['alternative']['id'];
                $sawData = $sawRankLookup[$majorId] ?? ['rank' => 999, 'score' => 0];

                $persistedResults[] = RecommendationResult::query()->create([
                    'assessment_id' => $assessment->id,
                    'major_id' => $majorId,
                    'rank' => $ranking['rank'],
                    'topsis_score' => $ranking['preference'],
                    'behavioral_score' => $behavioralScore,
                    'final_score' => round($finalScore, 6),
                    'distance_positive' => $ranking['distance_positive'],
                    'distance_negative' => $ranking['distance_negative'],
                    'meta' => [
                        'weighted_scores' => $ranking['weighted_scores'],
                        'probability_percentage' => round($finalScore * 100, 2),

                        // Profile Matching trace (Gap Analysis)
                        'profile_matching' => [
                            'core_factors' => $profileMatch['core_factors'],
                            'secondary_factors' => $profileMatch['secondary_factors'],
                            'core_score' => $profileMatch['core_score'],
                            'secondary_score' => $profileMatch['secondary_score'],
                            'gaps' => $profileMatch['gaps'],
                        ],

                        // RIASEC Affinity trace
                        'riasec_affinity' => [
                            'score' => round($riasecAffinity, 4),
                            'student_riasec' => $studentRiasecScores,
                            'major_riasec' => $majorRiasec,
                        ],

                        // SAW cross-verification trace
                        'saw_verification' => [
                            'saw_rank' => $sawData['rank'],
                            'saw_score' => $sawData['score'],
                        ],

                        // Real universities offering this major
                        'universities' => $ranking['alternative']['universities'] ?? [],
                    ],
                ]);
            }

            // Re-rank by final_score (Profile Matching + RIASEC may reshuffle)
            usort(
                $persistedResults,
                fn (RecommendationResult $left, RecommendationResult $right): int => $right->final_score <=> $left->final_score,
            );

            foreach ($persistedResults as $index => $result) {
                $result->update(['rank' => $index + 1]);
            }

            $topResult = $persistedResults[0];
            $topMajorId = $topResult->major_id;

            // Confidence: base from final_score, boosted if SAW agrees
            $baseConfidence = $topResult->meta['probability_percentage'];
            $algorithmConfidence = $algorithmsAgree
                ? min($baseConfidence + 5.0, 99.0)
                : $baseConfidence;

            $assessment->update([
                'top_major_id' => $topMajorId,
                'summary' => [
                    'lambda_max' => $ahp['lambda_max'],
                    'consistency_index' => $ahp['consistency_index'],
                    'recommendation_confidence' => round($algorithmConfidence, 2),
                    'algorithm_agreement' => $algorithmsAgree,
                    'eliminated_alternatives' => $eliminatedCount,
                    'scoring_method' => 'TOPSIS(60%) + ProfileMatching(25%) + RIASEC_Affinity(15%)',
                    'cross_verification' => 'SAW',
                    'psychometric_enabled' => $psychometricResults !== null,
                    'quality_validation' => $psychometricResults['quality'] ?? null,
                ],
            ]);

            return $assessment;
        });
    }

    /**
     * RIASEC Affinity via Cosine Similarity.
     *
     * Measures the directional alignment between a student's RIASEC vector
     * and a major's target RIASEC profile. This captures personality-fit
     * regardless of magnitude (a strongly R student matches strongly R major).
     *
     * cos(θ) = (A · B) / (||A|| × ||B||)
     *
     * @param  array<string, float>  $studentRiasec  e.g. ['Realistic' => 75, 'Investigative' => 90, ...]
     * @param  array<string, float>  $majorRiasec    e.g. ['R' => 70, 'I' => 95, ...]
     * @return float  Normalized 0-1 score
     */
    private function calculateRiasecAffinity(array $studentRiasec, array $majorRiasec): float
    {
        // Map student RIASEC (full names) to short keys
        $keyMap = [
            'Realistic' => 'R',
            'Investigative' => 'I',
            'Artistic' => 'A',
            'Social' => 'S',
            'Enterprising' => 'E',
            'Conventional' => 'C',
        ];

        $dotProduct = 0.0;
        $magnitudeStudent = 0.0;
        $magnitudeMajor = 0.0;

        foreach ($keyMap as $longKey => $shortKey) {
            $s = (float) ($studentRiasec[$longKey] ?? 0);
            $m = (float) ($majorRiasec[$shortKey] ?? 0);

            $dotProduct += $s * $m;
            $magnitudeStudent += $s ** 2;
            $magnitudeMajor += $m ** 2;
        }

        $magnitudeStudent = sqrt($magnitudeStudent);
        $magnitudeMajor = sqrt($magnitudeMajor);

        if ($magnitudeStudent <= 0 || $magnitudeMajor <= 0) {
            return 0.5; // Neutral if no data
        }

        // Cosine similarity is already 0-1 for non-negative vectors
        return $dotProduct / ($magnitudeStudent * $magnitudeMajor);
    }

    /**
     * Hard Constraint Elimination.
     *
     * Removes alternatives that the student absolutely cannot meet.
     * This runs BEFORE TOPSIS to reduce the decision matrix and
     * prevent impossible recommendations.
     */
    private function applyHardConstraints(array $alternatives, array $behavioralProfile): array
    {
        return array_values(array_filter($alternatives, function (array $alternative) use ($behavioralProfile): bool {
            $slug = $alternative['slug'] ?? '';
            $constraints = self::HARD_CONSTRAINTS[$slug] ?? [];

            foreach ($constraints as $dimension => $minimum) {
                $studentValue = (float) ($behavioralProfile[$dimension] ?? 0);

                if ($studentValue < $minimum) {
                    return false; // Eliminated
                }
            }

            return true; // Passes all constraints
        }));
    }

    private function roundWeights(array $criterionOrder, array $weights): array
    {
        $rounded = [];

        foreach ($criterionOrder as $index => $slug) {
            $rounded[$slug] = round($weights[$index], 6);
        }

        return $rounded;
    }

    /**
     * Process psychometric data (RIASEC + Grit + Logic) and derive 7D behavioral profile.
     *
     * Mapping to 7 behavioral dimensions:
     *
     *   minat_stem    ← weighted(RIASEC_R × 0.4 + RIASEC_I × 0.6)
     *   minat_seni    ← RIASEC_Artistic
     *   minat_sosial  ← weighted(RIASEC_S × 0.5 + RIASEC_E × 0.3 + RIASEC_A × 0.2)
     *   keteraturan   ← weighted(RIASEC_C × 0.7 + Grit_consistency × 0.3)
     *   daya_juang    ← Grit_perseverance
     *   konsistensi   ← Grit_consistency
     *   logika        ← weighted(logic_score × 0.6 + RIASEC_I × 0.25 + RIASEC_C × 0.15)
     */
    private function processPsychometricData(array $payload): array
    {
        $riasecResult = null;
        $gritResult = null;
        $logicResult = null;
        $quality = null;

        // --- RIASEC ---
        $riasecAnswers = $payload['riasec_answers'] ?? [];
        if (! empty($riasecAnswers)) {
            $riasecResult = $this->riasecAssessment->calculateProfile($riasecAnswers);
        }

        // --- Grit ---
        $gritAnswers = $payload['grit_answers'] ?? [];
        if (! empty($gritAnswers)) {
            $gritResult = $this->gritScaleAssessment->calculateGritScore($gritAnswers);
        }

        // --- Adaptive Logic ---
        $logicSession = $payload['logic_session'] ?? null;
        if ($logicSession && ! empty($logicSession['responses'] ?? [])) {
            $logicResult = $this->adaptiveLogicTest->getFinalScore($logicSession);
        }

        // --- Quality Validation ---
        if (! empty($riasecAnswers) && ! empty($gritAnswers)) {
            $quality = $this->qualityValidator->validate(
                $riasecAnswers,
                $gritAnswers,
                $payload['response_times'] ?? [],
            );
        }

        // --- Extract raw scores with safe defaults ---
        $riasecScores = $riasecResult['scores'] ?? [
            'Realistic' => 50, 'Investigative' => 50, 'Artistic' => 50,
            'Social' => 50, 'Enterprising' => 50, 'Conventional' => 50,
        ];

        $logicScore = $logicResult['logic_score'] ?? 50.0;
        $gritPerseverance = $gritResult['perseverance_of_effort'] ?? 50.0;
        $gritConsistency = $gritResult['consistency_of_interest'] ?? 50.0;

        // --- Derive 7D behavioral profile ---
        $minatStem = round(
            ($riasecScores['Realistic'] * 0.4) + ($riasecScores['Investigative'] * 0.6),
            1,
        );

        $minatSeni = round($riasecScores['Artistic'], 1);

        $minatSosial = round(
            ($riasecScores['Social'] * 0.5) + ($riasecScores['Enterprising'] * 0.3) + ($riasecScores['Artistic'] * 0.2),
            1,
        );

        $keteraturan = round(
            ($riasecScores['Conventional'] * 0.7) + ($gritConsistency * 0.3),
            1,
        );

        $dayaJuang = round($gritPerseverance, 1);

        $konsistensi = round($gritConsistency, 1);

        $logika = round(
            ($logicScore * 0.6) + ($riasecScores['Investigative'] * 0.25) + ($riasecScores['Conventional'] * 0.15),
            1,
        );

        return [
            'raw_scores' => [
                'riasec' => $riasecResult,
                'grit' => $gritResult,
                'logic' => $logicResult,
            ],
            'derived_behavioral' => [
                'minat_stem' => $minatStem,
                'minat_seni' => $minatSeni,
                'minat_sosial' => $minatSosial,
                'keteraturan' => $keteraturan,
                'daya_juang' => $dayaJuang,
                'konsistensi' => $konsistensi,
                'logika' => $logika,
            ],
            'quality' => $quality,
        ];
    }

    /**
     * Stateless extraction of purely generative recommendation logic used by Scenario Lab.
     */
    public function generateRecommendations(
        array $behavioralProfile,
        array $weightsBySlug,
        array $criterionOrder,
        \Illuminate\Database\Eloquent\Collection $majors
    ): array {
        $allAlternatives = $majors->map(fn (\App\Models\Major $major): array => [
            'id' => $major->id,
            'name' => $major->name,
            'slug' => $major->slug,
            'scores' => $major->criteria_scores,
            'behavioral_profile' => $major->behavioral_profile ?? [],
            'riasec_profile' => $major->riasec_profile ?? [],
        ])->all();

        $filteredAlternatives = $this->applyHardConstraints($allAlternatives, $behavioralProfile);
        if (count($filteredAlternatives) < 3) {
            $filteredAlternatives = $allAlternatives;
        }

        $criteria = \App\Models\Criterion::query()->active()->orderBy('display_order')->get();
        $criteriaForTopsis = $criteria->map(fn (\App\Models\Criterion $criterion): array => [
            'slug' => $criterion->slug,
            'type' => $criterion->type,
        ])->all();

        $topsisRankings = $this->topsisService->rank($filteredAlternatives, $criteriaForTopsis, $weightsBySlug);
        $sawRankings = $this->sawService->rank($filteredAlternatives, $criteriaForTopsis, $weightsBySlug);

        $sawRankLookup = [];
        foreach ($sawRankings as $sawResult) {
            $sawRankLookup[$sawResult['alternative']['id']] = [
                'rank' => $sawResult['rank'],
                'score' => $sawResult['saw_score'],
            ];
        }

        $results = [];
        foreach ($topsisRankings as $ranking) {
            $majorSlug = $ranking['alternative']['slug'] ?? '';
            $majorBehavioral = $ranking['alternative']['behavioral_profile'] ?? [];

            $profileMatch = $this->profileMatchingService->calculate($behavioralProfile, $majorBehavioral, $majorSlug);
            $behavioralScore = $profileMatch['score'];
            $finalScore = ($ranking['preference'] * self::TOPSIS_WEIGHT) + ($behavioralScore * self::PROFILE_MATCHING_WEIGHT);
            $majorId = $ranking['alternative']['id'];

            $results[] = [
                'major_id' => $majorId,
                'major' => collect($allAlternatives)->firstWhere('id', $majorId),
                'topsis_score' => $ranking['preference'],
                'behavioral_score' => $behavioralScore,
                'final_score' => round($finalScore, 6),
                'meta' => [
                    'probability_percentage' => round($finalScore * 100, 2),
                    'profile_matching' => $profileMatch,
                ],
            ];
        }

        usort($results, fn (array $a, array $b): int => $b['final_score'] <=> $a['final_score']);
        foreach ($results as $index => &$result) {
            $result['rank'] = $index + 1;
        }

        return $results;
    }
}
