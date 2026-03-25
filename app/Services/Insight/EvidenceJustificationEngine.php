<?php

namespace App\Services\Insight;

use App\Models\Assessment;
use App\Models\Major;

class EvidenceJustificationEngine
{
    public function generate(int $assessmentId, int $majorId): array
    {
        $assessment = Assessment::with('recommendationResults')->findOrFail($assessmentId);
        $major = Major::findOrFail($majorId);
        $behavioralProfile = $assessment->behavioral_profile;

        $recommendation = $assessment->recommendationResults
            ->firstWhere('major_id', $majorId);

        // Curriculum evidence from criteria_scores
        $curriculumEvidence = $this->buildCurriculumEvidence($major);

        // Competency gap analysis
        $gapAnalysis = $this->buildGapAnalysis($major, $behavioralProfile, $recommendation);

        // Scoring justification
        $scoringJustification = $this->buildScoringJustification($recommendation, $assessment);

        // Evidence strength
        $evidenceStrength = $this->calculateEvidenceStrength($curriculumEvidence, $gapAnalysis, $recommendation);

        return [
            'major' => [
                'id' => $major->id,
                'name' => $major->name,
                'slug' => $major->slug,
            ],
            'curriculum_evidence' => $curriculumEvidence,
            'gap_analysis' => $gapAnalysis,
            'scoring_justification' => $scoringJustification,
            'evidence_strength' => $evidenceStrength,
        ];
    }

    private function buildCurriculumEvidence(Major $major): array
    {
        $criteriaScores = $major->criteria_scores ?? [];
        $behavioralProfile = $major->behavioral_profile ?? [];
        $evidence = [];

        foreach ($criteriaScores as $criterion => $score) {
            $intensity = 'Moderate';
            if ($score >= 80) $intensity = 'Sangat Tinggi';
            elseif ($score >= 65) $intensity = 'Tinggi';
            elseif ($score >= 50) $intensity = 'Sedang';
            else $intensity = 'Rendah';

            $evidence[] = [
                'criterion' => $criterion,
                'score' => $score,
                'intensity' => $intensity,
                'justification' => $this->criterionJustification($criterion, $score, $major->name),
            ];
        }

        usort($evidence, fn ($a, $b) => $b['score'] <=> $a['score']);

        $thresholds = [];
        foreach ($behavioralProfile as $dim => $target) {
            $thresholds[] = [
                'dimension' => $dim,
                'target_value' => $target,
                'justification' => "Jurusan {$major->name} memerlukan skor {$dim} minimal {$target} berdasarkan profil perilaku yang ditetapkan oleh kurikulum.",
            ];
        }

        return [
            'criteria_breakdown' => $evidence,
            'behavioral_thresholds' => $thresholds,
            'total_criteria' => count($evidence),
        ];
    }

    private function criterionJustification(string $criterion, float $score, string $majorName): string
    {
        $formatted = ucfirst(str_replace('_', ' ', $criterion));

        if ($score >= 80) {
            return "{$majorName} memiliki tuntutan {$formatted} yang sangat tinggi ({$score}/100), mengindikasikan kurikulum yang intensif di area ini.";
        }
        if ($score >= 65) {
            return "{$majorName} memerlukan kemampuan {$formatted} yang kuat ({$score}/100), menjadi salah satu kompetensi kunci yang menentukan keberhasilan.";
        }
        if ($score >= 50) {
            return "{$majorName} membutuhkan dasar {$formatted} yang cukup ({$score}/100) sebagai fondasi untuk mata kuliah lanjutan.";
        }

        return "{$majorName} tidak terlalu bergantung pada {$formatted} ({$score}/100), sehingga kriteria ini bukan penentu utama.";
    }

    private function buildGapAnalysis(Major $major, array $behavioralProfile, $recommendation): array
    {
        $majorBehavioral = $major->behavioral_profile ?? [];
        $gaps = [];

        foreach ($majorBehavioral as $dim => $target) {
            $student = (float) ($behavioralProfile[$dim] ?? 0);
            $gap = $student - (float) $target;

            $status = 'Meets';
            if ($gap >= 10) $status = 'Exceeds';
            elseif ($gap >= 0) $status = 'Meets';
            elseif ($gap >= -10) $status = 'Slight Gap';
            elseif ($gap >= -20) $status = 'Moderate Gap';
            else $status = 'Significant Gap';

            $gaps[] = [
                'dimension' => $dim,
                'student_score' => round($student, 1),
                'target_score' => round((float) $target, 1),
                'gap' => round($gap, 1),
                'status' => $status,
                'color' => $gap >= 0 ? 'emerald' : ($gap >= -10 ? 'amber' : 'rose'),
            ];
        }

        usort($gaps, fn ($a, $b) => $a['gap'] <=> $b['gap']);

        // Also include profile matching data from recommendation meta
        $pmData = $recommendation?->meta['profile_matching'] ?? null;

        return [
            'behavioral_gaps' => $gaps,
            'core_factors' => $pmData['core_factors'] ?? [],
            'secondary_factors' => $pmData['secondary_factors'] ?? [],
            'core_score' => $pmData['core_score'] ?? null,
            'secondary_score' => $pmData['secondary_score'] ?? null,
        ];
    }

    private function buildScoringJustification($recommendation, Assessment $assessment): array
    {
        if (!$recommendation) {
            return ['available' => false];
        }

        $meta = $recommendation->meta ?? [];
        $weightedScores = $meta['weighted_scores'] ?? [];
        $criterionWeights = $assessment->criterion_weights;

        $criteriaJustification = [];
        foreach ($weightedScores as $criterion => $weighted) {
            $weight = $criterionWeights[$criterion] ?? 0;
            $criteriaJustification[] = [
                'criterion' => $criterion,
                'weight' => round($weight, 4),
                'weighted_score' => round($weighted, 4),
                'impact' => $weight >= 0.25 ? 'High' : ($weight >= 0.15 ? 'Medium' : 'Low'),
            ];
        }

        usort($criteriaJustification, fn ($a, $b) => $b['weighted_score'] <=> $a['weighted_score']);

        return [
            'available' => true,
            'rank' => $recommendation->rank,
            'topsis_score' => round((float) $recommendation->topsis_score, 4),
            'behavioral_score' => round((float) $recommendation->behavioral_score, 4),
            'final_score' => round((float) $recommendation->final_score, 4),
            'criteria_justification' => $criteriaJustification,
            'saw_verification' => $meta['saw_verification'] ?? null,
        ];
    }

    private function calculateEvidenceStrength(array $curriculum, array $gaps, $recommendation): array
    {
        $scores = [];

        // Curriculum data completeness
        $criteriaCount = $curriculum['total_criteria'] ?? 0;
        $scores[] = min(100, $criteriaCount * 15);

        // Gap coverage
        $gapCount = count($gaps['behavioral_gaps'] ?? []);
        $scores[] = min(100, $gapCount * 25);

        // Recommendation data availability
        if ($recommendation) {
            $scores[] = 80;
            if (($recommendation->meta['profile_matching'] ?? null) !== null) {
                $scores[] = 90;
            }
        }

        $overall = count($scores) > 0 ? round(array_sum($scores) / count($scores), 1) : 0;

        return [
            'score' => $overall,
            'level' => $overall >= 80 ? 'Strong' : ($overall >= 60 ? 'Moderate' : 'Limited'),
            'interpretation' => $overall >= 80
                ? 'Justifikasi didukung oleh data kurikulum yang lengkap, analisis gap detail, dan verifikasi multi-algoritma.'
                : ($overall >= 60
                    ? 'Justifikasi memiliki dukungan data yang cukup, namun beberapa dimensi bisa diperkuat.'
                    : 'Data justifikasi terbatas — rekomendasi lebih bersifat indikatif.'),
        ];
    }
}
