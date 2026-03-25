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
     * Hard constraint thresholds for pre-filtering.
     *
     * Format: 'major-slug' => ['dimension' => minimum_score]
     * Majors are eliminated BEFORE TOPSIS if the student
     * does not meet the absolute minimum threshold.
     */
    private const HARD_CONSTRAINTS = [
        // Medical cluster — requires extreme consistency
        'kedokteran-umum' => ['konsistensi' => 60, 'minat' => 55],
        'kedokteran-gigi' => ['konsistensi' => 55, 'minat' => 50],
        'farmasi' => ['konsistensi' => 55],

        // MIPA / Heavy Engineering — requires strong logic
        'matematika' => ['logika' => 55],
        'aktuaria' => ['logika' => 55],
        'teknik-elektro' => ['logika' => 50],
        'teknik-mesin' => ['logika' => 50],
        'statistika' => ['logika' => 50],

        // Creative / Passion-driven — requires strong interest
        'desain-komunikasi-visual' => ['minat' => 55],
        'pgsd' => ['minat' => 50, 'konsistensi' => 50],
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

        $majors = Major::query()->active()->orderBy('name')->get();

        if ($majors->isEmpty()) {
            throw ValidationException::withMessages([
                'majors' => 'Belum ada data jurusan aktif untuk dihitung.',
            ]);
        }

        $behavioralProfile = $payload['behavioral_profile'];
        $psychometricResults = null;

        // ── Psychometric Enhancement ──
        // If the wizard collected RIASEC/Grit/Logic data, compute
        // a scientifically-derived behavioral profile from them.
        $psychometricPayload = $payload['psychometric_profile'] ?? null;

        if ($psychometricPayload) {
            $psychometricResults = $this->processPsychometricData($psychometricPayload);

            // Override slider-based behavioral profile with derived scores
            $behavioralProfile = $psychometricResults['derived_behavioral'];
        }

        // ── Phase 2: Hard Constraint Elimination (Pre-filter) ──
        $allAlternatives = $majors->map(fn (Major $major): array => [
            'id' => $major->id,
            'name' => $major->name,
            'slug' => $major->slug,
            'scores' => $major->criteria_scores,
            'behavioral_profile' => $major->behavioral_profile ?? [],
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

        // ── Phase 5: Profile Matching + Final Scoring ──
        return DB::transaction(function () use (
            $payload, $userId, $criterionOrder, $ahp,
            $behavioralProfile, $topsisRankings,
            $sawRankLookup, $algorithmsAgree, $eliminatedCount,
            $psychometricResults,
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

                // Profile Matching (Gap Analysis) replaces old Euclidean
                $profileMatch = $this->profileMatchingService->calculate(
                    $behavioralProfile,
                    $majorBehavioral,
                    $majorSlug,
                );

                $behavioralScore = $profileMatch['score'];

                // Composite: 70% TOPSIS + 30% Profile Matching
                $finalScore = ($ranking['preference'] * 0.70) + ($behavioralScore * 0.30);

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

                        // SAW cross-verification trace
                        'saw_verification' => [
                            'saw_rank' => $sawData['rank'],
                            'saw_score' => $sawData['score'],
                        ],
                    ],
                ]);
            }

            // Re-rank by final_score (Profile Matching may reshuffle)
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
                    'scoring_method' => 'TOPSIS(70%) + ProfileMatching(30%)',
                    'cross_verification' => 'SAW',
                    'psychometric_enabled' => $psychometricResults !== null,
                    'quality_validation' => $psychometricResults['quality'] ?? null,
                ],
            ]);

            return $assessment;
        });
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
     * Process psychometric data (RIASEC + Grit + Logic) and derive behavioral profile.
     *
     * Mapping to existing behavioral dimensions:
     *   minat ← (Artistic + Social + Enterprising RIASEC average)
     *   logika ← (Investigative + Conventional RIASEC average) blended with logic_score
     *   konsistensi ← Grit score (perseverance + consistency)
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

        // --- Derive behavioral profile ---
        $riasecScores = $riasecResult['scores'] ?? [];
        $logicScore = $logicResult['logic_score'] ?? 75.0;
        $gritScore = $gritResult['overall_grit'] ?? 80.0;

        // minat: blend of passion-oriented RIASEC dimensions
        $minat = round(
            (($riasecScores['Artistic'] ?? 50) +
             ($riasecScores['Social'] ?? 50) +
             ($riasecScores['Enterprising'] ?? 50)) / 3,
            1,
        );

        // logika: blend of analytical RIASEC + logic test score
        $riasecLogic = (($riasecScores['Investigative'] ?? 50) +
                        ($riasecScores['Conventional'] ?? 50)) / 2;
        $logika = round(($riasecLogic * 0.4) + ($logicScore * 0.6), 1);

        // konsistensi: directly from Grit score
        $konsistensi = round($gritScore, 1);

        // Placeholder for other derived behavioral dimensions if needed
        $minatStem = 0; // Example placeholder
        $minatSeni = 0; // Example placeholder
        $minatSosial = 0; // Example placeholder
        $minatManajemen = 0; // Example placeholder
        $dayaJuang = 0; // Example placeholder
        $logikaMatematika = 0; // Example placeholder
        $kemampuanAnalitis = 0; // Example placeholder
        $qualityStats = []; // Example placeholder

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
                'minat_manajemen' => $minatManajemen,
                'daya_juang' => $dayaJuang,
                'logika_matematika' => $logikaMatematika,
                'kemampuan_analitis' => $kemampuanAnalitis,
                'konsistensi' => $konsistensi,
            ],
            'quality' => $qualityStats,
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
            $finalScore = ($ranking['preference'] * 0.70) + ($behavioralScore * 0.30);
            $majorId = $ranking['alternative']['id'];
            
            $results[] = [
                'major_id' => $majorId,
                'major' => collect($allAlternatives)->firstWhere('id', $majorId),
                'topsis_score' => $ranking['preference'],
                'behavioral_score' => $behavioralScore,
                'final_score' => round($finalScore, 6),
                'meta' => [
                    'probability_percentage' => round($finalScore * 100, 2),
                    'profile_matching' => $profileMatch
                ]
            ];
        }

        usort($results, fn (array $a, array $b): int => $b['final_score'] <=> $a['final_score']);
        foreach ($results as $index => &$result) {
            $result['rank'] = $index + 1;
        }

        return $results;
    }
}
