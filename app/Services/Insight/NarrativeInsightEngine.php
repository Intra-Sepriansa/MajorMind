<?php

namespace App\Services\Insight;

use App\Models\Assessment;

class NarrativeInsightEngine
{
    public function generate(int $assessmentId): array
    {
        $assessment = Assessment::with('recommendationResults.major')->findOrFail($assessmentId);
        $top = $assessment->recommendationResults->first();
        $runnerUp = $assessment->recommendationResults->skip(1)->first();
        $criterionWeights = $assessment->criterion_weights;
        $criterionOrder = $assessment->criterion_order;
        $psychometric = $assessment->psychometric_profile;
        $summary = $assessment->summary ?? [];
        $confidence = $summary['recommendation_confidence'] ?? 0;
        $cr = (float) $assessment->consistency_ratio;
        $agreement = $summary['algorithm_agreement'] ?? false;

        $topName = $top?->major?->name ?? 'N/A';
        $runnerUpName = $runnerUp?->major?->name ?? 'N/A';
        $topScore = round(($top?->final_score ?? 0) * 100, 1);
        $topGap = $top && $runnerUp
            ? round(((float) $top->final_score - (float) $runnerUp->final_score) * 100, 1)
            : 0;

        // Executive summary
        $executive = $this->buildExecutiveSummary(
            $topName, $topScore, $confidence, $cr, $agreement, $topGap, $runnerUpName,
        );

        // Profile analysis
        $profileNarrative = $this->buildProfileNarrative($psychometric, $assessment->behavioral_profile);

        // Algorithmic explanation
        $algoNarrative = $this->buildAlgorithmicNarrative($top, $runnerUp, $agreement);

        // Key takeaways
        $takeaways = $this->buildKeyTakeaways($topName, $topScore, $topGap, $confidence, $cr, $runnerUpName);

        // Confidence statement
        $confidenceStatement = $this->buildConfidenceStatement($confidence, $cr, $agreement, $topGap);

        return [
            'executive_summary' => $executive,
            'profile_narrative' => $profileNarrative,
            'algorithmic_narrative' => $algoNarrative,
            'key_takeaways' => $takeaways,
            'confidence_statement' => $confidenceStatement,
        ];
    }

    private function buildExecutiveSummary(
        string $topName,
        float $topScore,
        float $confidence,
        float $cr,
        bool $agreement,
        float $topGap,
        string $runnerUpName,
    ): string {
        $crStatus = $cr <= 0.05 ? 'sangat konsisten' : ($cr <= 0.1 ? 'valid' : 'perlu ditinjau');
        $gapDesc = $topGap >= 8 ? 'selisih yang signifikan' : ($topGap >= 3 ? 'selisih yang cukup' : 'selisih yang tipis');
        $agreementDesc = $agreement ? 'dikonfirmasi oleh cross-verification SAW' : 'menunjukkan sedikit variasi antar-algoritma';

        return "Berdasarkan analisis komprehensif menggunakan sistem hybdrid AHP-TOPSIS-ProfileMatching-SAW, " .
            "MajorMind merekomendasikan **{$topName}** sebagai pilihan optimal dengan skor kesesuaian **{$topScore}%** " .
            "dan confidence **{$confidence}%**. Keputusan ini memiliki {$gapDesc} ({$topGap}%) terhadap runner-up ({$runnerUpName}). " .
            "Consistency Ratio AHP berada di {$cr} ({$crStatus}), dan hasil {$agreementDesc}. " .
            "Rekomendasi ini dapat dipertahankan secara akademik sebagai keputusan berbasis data yang transparan dan teraudit.";
    }

    private function buildProfileNarrative(?array $psychometric, array $behavioral): string
    {
        $parts = ["**Analisis Profil Anda:**\n"];

        // Behavioral dimensions
        $sorted = $behavioral;
        arsort($sorted);
        $strongest = array_key_first($sorted);
        $weakest = array_key_last($sorted);

        $parts[] = "Profil behavioral menunjukkan kekuatan utama pada dimensi **" . ucfirst($strongest) .
            "** (skor {$sorted[$strongest]}) dan area pengembangan pada **" . ucfirst($weakest) .
            "** (skor " . end($sorted) . ").";

        // RIASEC
        $riasec = $psychometric['riasec'] ?? null;
        if ($riasec) {
            $hollandCode = $riasec['holland_code'] ?? 'N/A';
            $primaryType = ucfirst($riasec['primary_type'] ?? 'N/A');
            $parts[] = "Profil RIASEC mengidentifikasi Holland Code **{$hollandCode}** dengan tipe dominan **{$primaryType}**, " .
                "yang akan mengarahkan pembobotan ke jurusan yang selaras dengan kepribadian kerja Anda.";
        }

        // Grit
        $grit = $psychometric['grit'] ?? null;
        if ($grit) {
            $level = $grit['level'] ?? 'Unknown';
            $score = $grit['total_score'] ?? 0;
            $parts[] = "Skor Grit Scale Anda adalah **{$score}/5.0** (level: {$level}), menunjukkan " .
                ($score >= 3.5 ? "ketahanan dan konsistensi yang baik untuk menyelesaikan studi." : "area yang perlu dikembangkan untuk memastikan persistensi akademik.");
        }

        // Logic
        $logic = $psychometric['logic'] ?? null;
        if ($logic) {
            $theta = $logic['theta'] ?? 0;
            $se = $logic['standard_error'] ?? 1;
            $parts[] = "Adaptive Logic Test menghasilkan θ = **{$theta}** (SE: {$se}), " .
                ($theta >= 0.5 ? "menunjukkan kemampuan logika di atas rata-rata." : "menunjukkan kemampuan logika yang perlu diperkuat untuk jurusan kuantitatif intensif.");
        }

        return implode("\n\n", $parts);
    }

    private function buildAlgorithmicNarrative($top, $runnerUp, bool $agreement): string
    {
        if (!$top) {
            return 'Belum ada data rekomendasi untuk dianalisis.';
        }

        $topsisScore = round((float) $top->topsis_score * 100, 1);
        $behavioralScore = round((float) $top->behavioral_score * 100, 1);
        $finalScore = round((float) $top->final_score * 100, 1);
        $majorName = $top->major->name ?? 'N/A';

        $sawRank = $top->meta['saw_verification']['saw_rank'] ?? null;
        $sawScore = $top->meta['saw_verification']['saw_score'] ?? null;

        $narrative = "**Bagaimana Algoritma Menghasilkan Rekomendasi Ini?**\n\n";
        $narrative .= "Sistem menggunakan pipeline multi-algoritma:\n\n";
        $narrative .= "• **TOPSIS** (bobot 70%): Memberikan skor preferensi {$topsisScore}% berdasarkan jarak ke solusi ideal positif dan negatif.\n";
        $narrative .= "• **Profile Matching** (bobot 30%): Menghasilkan skor kecocokan {$behavioralScore}% berdasarkan gap analysis core/secondary factors.\n";
        $narrative .= "• **Skor Final**: {$finalScore}% = (TOPSIS × 70%) + (Profile Matching × 30%)\n\n";

        if ($sawRank !== null) {
            $narrative .= "Cross-verification SAW menempatkan {$majorName} di peringkat #{$sawRank}" .
                ($sawScore ? " (skor: " . round($sawScore * 100, 1) . "%)" : "") .
                ($agreement ? " — **CONFIRMED** oleh kedua algoritma." : " — ada sedikit perbedaan ranking.") . "\n";
        }

        return $narrative;
    }

    private function buildKeyTakeaways(
        string $topName,
        float $topScore,
        float $topGap,
        float $confidence,
        float $cr,
        string $runnerUpName,
    ): array {
        $takeaways = [];

        $takeaways[] = [
            'icon' => '🎯',
            'text' => "{$topName} adalah pilihan terbaik dengan skor {$topScore}% dan confidence {$confidence}%.",
        ];

        if ($topGap >= 8) {
            $takeaways[] = [
                'icon' => '✅',
                'text' => "Keputusan cenderung kuat — selisih {$topGap}% dari runner-up ({$runnerUpName}) menunjukkan dominansi yang jelas.",
            ];
        } else {
            $takeaways[] = [
                'icon' => '⚠️',
                'text' => "Selisih tipis ({$topGap}%) dengan {$runnerUpName} — pertimbangkan kedua opsi dengan matang.",
            ];
        }

        $takeaways[] = [
            'icon' => $cr <= 0.1 ? '✅' : '❌',
            'text' => "Consistency Ratio = {$cr} — " . ($cr <= 0.1 ? 'keputusan AHP valid dan konsisten.' : 'keputusan AHP perlu ditinjau ulang.'),
        ];

        $takeaways[] = [
            'icon' => '📊',
            'text' => "Hasil telah diverifikasi dengan metode SAW sebagai cross-check independen.",
        ];

        return $takeaways;
    }

    private function buildConfidenceStatement(float $confidence, float $cr, bool $agreement, float $topGap): string
    {
        $factors = [];

        if ($confidence >= 80) $factors[] = 'confidence tinggi';
        if ($cr <= 0.05) $factors[] = 'CR sangat rendah';
        if ($agreement) $factors[] = 'algoritma saling mengonfirmasi';
        if ($topGap >= 8) $factors[] = 'selisih signifikan dari runner-up';

        if (count($factors) >= 3) {
            return "**Tingkat kepercayaan: TINGGI** — Didukung oleh " . implode(', ', $factors) . ". Rekomendasi ini sangat reliable.";
        }

        if (count($factors) >= 1) {
            return "**Tingkat kepercayaan: SEDANG** — Beberapa indikator positif (" . implode(', ', $factors) . ") namun ada ruang untuk pertimbangan tambahan.";
        }

        return "**Tingkat kepercayaan: PERLU REVIEW** — Beberapa indikator menunjukkan bahwa keputusan ini sensitif terhadap perubahan parameter.";
    }
}
