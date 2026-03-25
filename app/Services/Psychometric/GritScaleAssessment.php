<?php

namespace App\Services\Psychometric;

class GritScaleAssessment
{
    /**
     * Short Grit Scale (Grit-S) — 12 items.
     * 6 Perseverance of Effort + 6 Consistency of Interest.
     *
     * @var list<array{id: string, text: string, dimension: string, reverse: bool}>
     */
    private array $questions = [
        // Perseverance of Effort (6 items)
        ['id' => 'G1', 'text' => 'Saya menyelesaikan apa yang saya mulai', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G2', 'text' => 'Kemunduran tidak membuat saya putus asa', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G3', 'text' => 'Saya adalah pekerja keras', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G4', 'text' => 'Saya mudah menyerah', 'dimension' => 'perseverance', 'reverse' => true],
        ['id' => 'G5', 'text' => 'Saya tekun dalam mencapai tujuan jangka panjang', 'dimension' => 'perseverance', 'reverse' => false],
        ['id' => 'G6', 'text' => 'Saya tidak menyelesaikan proyek yang memakan waktu lama', 'dimension' => 'perseverance', 'reverse' => true],

        // Consistency of Interest (6 items)
        ['id' => 'G7', 'text' => 'Minat saya berubah dari tahun ke tahun', 'dimension' => 'consistency', 'reverse' => true],
        ['id' => 'G8', 'text' => 'Saya fokus pada satu tujuan untuk waktu yang lama', 'dimension' => 'consistency', 'reverse' => false],
        ['id' => 'G9', 'text' => 'Saya sering berganti fokus dari satu ide ke ide lain', 'dimension' => 'consistency', 'reverse' => true],
        ['id' => 'G10', 'text' => 'Saya konsisten dalam mengejar tujuan saya', 'dimension' => 'consistency', 'reverse' => false],
        ['id' => 'G11', 'text' => 'Saya mudah teralihkan oleh proyek atau ide baru', 'dimension' => 'consistency', 'reverse' => true],
        ['id' => 'G12', 'text' => 'Saya mempertahankan minat saya dalam jangka panjang', 'dimension' => 'consistency', 'reverse' => false],
    ];

    /** @return list<array{id: string, text: string, dimension: string, reverse: bool}> */
    public function getQuestions(): array
    {
        return $this->questions;
    }

    /**
     * @param  array<string, int>  $responses  Map of questionId => rating (1–5)
     */
    public function calculateGritScore(array $responses): array
    {
        $perseveranceScore = 0.0;
        $consistencyScore = 0.0;
        $perseveranceCount = 0;
        $consistencyCount = 0;

        foreach ($responses as $questionId => $rating) {
            $rating = max(1, min(5, (int) $rating));

            $question = collect($this->questions)->firstWhere('id', $questionId);

            if (! $question) {
                continue;
            }

            $score = $question['reverse'] ? (6 - $rating) : $rating;

            if ($question['dimension'] === 'perseverance') {
                $perseveranceScore += $score;
                $perseveranceCount++;
            } else {
                $consistencyScore += $score;
                $consistencyCount++;
            }
        }

        $perseveranceAvg = $perseveranceCount > 0 ? $perseveranceScore / $perseveranceCount : 1;
        $consistencyAvg = $consistencyCount > 0 ? $consistencyScore / $consistencyCount : 1;
        $overallGrit = ($perseveranceAvg + $consistencyAvg) / 2;

        // Convert from 1–5 scale to 0–100
        $gritScore = (($overallGrit - 1) / 4) * 100;

        return [
            'overall_grit' => round($gritScore, 1),
            'perseverance_of_effort' => round((($perseveranceAvg - 1) / 4) * 100, 1),
            'consistency_of_interest' => round((($consistencyAvg - 1) / 4) * 100, 1),
            'interpretation' => $this->interpretGrit($gritScore),
            'percentile' => $this->calculatePercentile($gritScore),
        ];
    }

    private function interpretGrit(float $score): array
    {
        if ($score >= 80) {
            return [
                'level' => 'Sangat Tinggi',
                'description' => 'Anda memiliki daya tahan dan konsistensi luar biasa',
                'implication' => 'Sangat cocok untuk jurusan yang menuntut dedikasi jangka panjang seperti Kedokteran, Teknik, atau Hukum',
            ];
        }

        if ($score >= 65) {
            return [
                'level' => 'Tinggi',
                'description' => 'Anda memiliki daya tahan yang baik',
                'implication' => 'Cocok untuk sebagian besar jurusan yang memerlukan komitmen',
            ];
        }

        if ($score >= 50) {
            return [
                'level' => 'Sedang',
                'description' => 'Anda memiliki daya tahan yang cukup',
                'implication' => 'Pertimbangkan jurusan dengan struktur yang jelas dan milestone yang teratur',
            ];
        }

        return [
            'level' => 'Perlu Pengembangan',
            'description' => 'Anda mungkin perlu mengembangkan konsistensi',
            'implication' => 'Fokus pada jurusan dengan durasi lebih pendek atau program yang lebih praktis',
        ];
    }

    /**
     * Approximate percentile based on Duckworth normative data.
     */
    private function calculatePercentile(float $score): int
    {
        $map = [
            20 => 10,
            30 => 20,
            40 => 35,
            50 => 50,
            60 => 65,
            70 => 80,
            80 => 90,
            90 => 97,
        ];

        foreach ($map as $threshold => $percentile) {
            if ($score < $threshold) {
                return $percentile;
            }
        }

        return 99;
    }
}
