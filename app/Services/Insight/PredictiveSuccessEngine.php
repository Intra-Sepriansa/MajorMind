<?php

namespace App\Services\Insight;

use App\Models\Assessment;
use App\Models\Major;

class PredictiveSuccessEngine
{
    public function predict(int $assessmentId, int $majorId): array
    {
        $assessment = Assessment::with('recommendationResults')->findOrFail($assessmentId);
        $major = Major::findOrFail($majorId);
        $behavioralProfile = $assessment->behavioral_profile;
        $psychometric = $assessment->psychometric_profile;

        $recommendation = $assessment->recommendationResults
            ->firstWhere('major_id', $majorId);

        // Compute heuristic success probability
        $successProb = $this->computeSuccessProbability($recommendation, $major, $behavioralProfile, $psychometric);

        // GPA range prediction
        $gpaPrediction = $this->predictGpaRange($successProb, $recommendation);

        // Dropout risk
        $dropoutRisk = $this->assessDropoutRisk($successProb, $behavioralProfile, $psychometric);

        // Feature importance
        $featureImportance = $this->computeFeatureImportance($recommendation, $major, $behavioralProfile, $psychometric);

        // Risk factors
        $riskFactors = $this->identifyRiskFactors($behavioralProfile, $psychometric, $major);

        // Success pathway
        $successPathway = $this->generateSuccessPathway($riskFactors, $successProb);

        return [
            'success_probability' => $successProb,
            'gpa_prediction' => $gpaPrediction,
            'dropout_risk' => $dropoutRisk,
            'feature_importance' => $featureImportance,
            'risk_factors' => $riskFactors,
            'success_pathway' => $successPathway,
            'model_info' => [
                'method' => 'Heuristic Multi-Factor Scoring',
                'factors' => 'Gap Analysis + Behavioral Fit + Psychometric Scores + Algorithm Consensus',
                'confidence' => 'Moderate — based on rule-based scoring, not trained ML model',
            ],
        ];
    }

    private function computeSuccessProbability($recommendation, Major $major, array $behavioral, ?array $psychometric): array
    {
        $scores = [];

        // Factor 1: Final recommendation score (0-1 range)
        if ($recommendation) {
            $scores['recommendation_fit'] = min(100, (float) $recommendation->final_score * 100);
        }

        // Factor 2: Behavioral profile match
        $majorBehavioral = $major->behavioral_profile ?? [];
        $gapPenalty = 0;
        $gapCount = 0;
        foreach ($majorBehavioral as $dim => $target) {
            $student = (float) ($behavioral[$dim] ?? 0);
            $gap = max(0, (float) $target - $student);
            $gapPenalty += $gap;
            $gapCount++;
        }
        $avgGap = $gapCount > 0 ? $gapPenalty / $gapCount : 0;
        $scores['behavioral_match'] = max(0, round(100 - $avgGap * 1.5, 1));

        // Factor 3: Psychometric strength
        $gritScore = $psychometric['grit']['total_score'] ?? 3.0;
        $scores['grit_factor'] = min(100, round($gritScore * 20, 1));

        $logicTheta = $psychometric['logic']['theta'] ?? 0;
        $scores['logic_factor'] = min(100, round(($logicTheta + 2) * 25, 1));

        // Factor 4: Consistency ratio quality
        $cr = (float) ($recommendation?->assessment?->consistency_ratio ?? 0.05);
        $scores['decision_consistency'] = max(0, round((0.1 - min($cr, 0.1)) * 1000, 1));

        // Weighted average
        $weights = [
            'recommendation_fit' => 0.35,
            'behavioral_match' => 0.25,
            'grit_factor' => 0.15,
            'logic_factor' => 0.15,
            'decision_consistency' => 0.10,
        ];

        $weightedSum = 0;
        $totalWeight = 0;
        foreach ($weights as $key => $weight) {
            if (isset($scores[$key])) {
                $weightedSum += $scores[$key] * $weight;
                $totalWeight += $weight;
            }
        }

        $probability = $totalWeight > 0 ? round($weightedSum / $totalWeight, 1) : 50;

        $level = $probability >= 80 ? 'Tinggi' : ($probability >= 60 ? 'Sedang' : 'Perlu Perhatian');

        return [
            'overall' => $probability,
            'level' => $level,
            'color' => $probability >= 80 ? 'emerald' : ($probability >= 60 ? 'amber' : 'rose'),
            'factor_scores' => $scores,
            'factor_weights' => $weights,
        ];
    }

    private function predictGpaRange(array $successProb, $recommendation): array
    {
        $prob = $successProb['overall'];

        // Heuristic GPA mapping
        if ($prob >= 85) {
            $min = 3.40;
            $max = 4.00;
            $expected = 3.65;
        } elseif ($prob >= 70) {
            $min = 3.00;
            $max = 3.60;
            $expected = 3.30;
        } elseif ($prob >= 55) {
            $min = 2.70;
            $max = 3.30;
            $expected = 3.00;
        } else {
            $min = 2.30;
            $max = 3.00;
            $expected = 2.70;
        }

        return [
            'expected_gpa' => $expected,
            'range_min' => $min,
            'range_max' => $max,
            'confidence' => $prob >= 70 ? 'High' : 'Moderate',
            'interpretation' => "Berdasarkan profil Anda, IPK prediksi berada di range {$min} - {$max} dengan titik estimasi {$expected}.",
        ];
    }

    private function assessDropoutRisk(array $successProb, array $behavioral, ?array $psychometric): array
    {
        $riskScore = max(0, 100 - $successProb['overall']);

        // Additional risk from low grit
        $grit = $psychometric['grit']['total_score'] ?? 3.0;
        if ($grit < 2.5) {
            $riskScore = min(100, $riskScore + 15);
        }

        // Additional risk from low consistency
        $consistency = $behavioral['konsistensi'] ?? 50;
        if ($consistency < 40) {
            $riskScore = min(100, $riskScore + 10);
        }

        $level = $riskScore >= 40 ? 'Tinggi' : ($riskScore >= 20 ? 'Sedang' : 'Rendah');

        return [
            'score' => round($riskScore, 1),
            'level' => $level,
            'color' => $riskScore >= 40 ? 'rose' : ($riskScore >= 20 ? 'amber' : 'emerald'),
            'interpretation' => $riskScore >= 40
                ? 'Risiko dropout cukup tinggi — perlu strategi mitigasi seperti bimbingan akademik dan pengembangan keterampilan.'
                : ($riskScore >= 20
                    ? 'Risiko dropout sedang — pastikan komitmen dan dukungan yang cukup.'
                    : 'Risiko dropout rendah — profil Anda menunjukkan kesiapan yang baik.'),
        ];
    }

    private function computeFeatureImportance($recommendation, Major $major, array $behavioral, ?array $psychometric): array
    {
        $features = [];

        // Behavioral dimensions
        $majorBehavioral = $major->behavioral_profile ?? [];
        foreach ($majorBehavioral as $dim => $target) {
            $student = (float) ($behavioral[$dim] ?? 0);
            $gap = abs($student - (float) $target);
            $importance = min(100, round(50 + ($gap * 1.5), 1));

            $features[] = [
                'feature' => ucfirst($dim),
                'importance' => $importance,
                'direction' => $student >= (float) $target ? 'positive' : 'negative',
                'value' => round($student, 1),
                'target' => round((float) $target, 1),
            ];
        }

        // Grit
        if ($psychometric && isset($psychometric['grit'])) {
            $features[] = [
                'feature' => 'Grit Score',
                'importance' => 70,
                'direction' => ($psychometric['grit']['total_score'] ?? 3) >= 3.5 ? 'positive' : 'negative',
                'value' => $psychometric['grit']['total_score'] ?? 0,
                'target' => 3.5,
            ];
        }

        // Logic
        if ($psychometric && isset($psychometric['logic'])) {
            $features[] = [
                'feature' => 'Logic Ability',
                'importance' => 65,
                'direction' => ($psychometric['logic']['theta'] ?? 0) >= 0 ? 'positive' : 'negative',
                'value' => $psychometric['logic']['theta'] ?? 0,
                'target' => 0,
            ];
        }

        usort($features, fn ($a, $b) => $b['importance'] <=> $a['importance']);

        return $features;
    }

    private function identifyRiskFactors(array $behavioral, ?array $psychometric, Major $major): array
    {
        $risks = [];

        $majorBehavioral = $major->behavioral_profile ?? [];
        foreach ($majorBehavioral as $dim => $target) {
            $student = (float) ($behavioral[$dim] ?? 0);
            $gap = (float) $target - $student;
            if ($gap > 15) {
                $risks[] = [
                    'factor' => ucfirst($dim),
                    'severity' => $gap > 25 ? 'High' : 'Moderate',
                    'gap' => round($gap, 1),
                    'recommendation' => "Tingkatkan kemampuan {$dim} minimal {$gap} poin untuk memenuhi tuntutan kurikulum.",
                ];
            }
        }

        if ($psychometric && ($psychometric['grit']['total_score'] ?? 3.0) < 2.5) {
            $risks[] = [
                'factor' => 'Low Grit',
                'severity' => 'High',
                'gap' => round(2.5 - ($psychometric['grit']['total_score'] ?? 0), 2),
                'recommendation' => 'Kembangkan ketahanan dan konsistensi melalui kegiatan yang butuh komitmen jangka panjang.',
            ];
        }

        return $risks;
    }

    private function generateSuccessPathway(array $riskFactors, array $successProb): array
    {
        $steps = [];

        if ($successProb['overall'] >= 80) {
            $steps[] = [
                'phase' => 'Persiapan',
                'action' => 'Pertahankan performa saat ini dan mulai pelajari silabus mata kuliah inti semester 1.',
                'priority' => 'Medium',
            ];
        } else {
            $steps[] = [
                'phase' => 'Penguatan',
                'action' => 'Fokus pada peningkatan area yang menjadi gap terbesar sebelum masuk perkuliahan.',
                'priority' => 'High',
            ];
        }

        foreach (array_slice($riskFactors, 0, 3) as $risk) {
            $steps[] = [
                'phase' => 'Mitigasi Risiko',
                'action' => $risk['recommendation'],
                'priority' => $risk['severity'] === 'High' ? 'Critical' : 'Medium',
            ];
        }

        $steps[] = [
            'phase' => 'Dukungan',
            'action' => 'Manfaatkan layanan bimbingan akademik dan mentoring dari kakak tingkat di semester awal.',
            'priority' => 'Medium',
        ];

        return $steps;
    }
}
