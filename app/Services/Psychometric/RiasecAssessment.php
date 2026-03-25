<?php

namespace App\Services\Psychometric;

class RiasecAssessment
{
    /**
     * 48-item Holland RIASEC question bank.
     * 8 items per dimension, each with a discrimination weight.
     *
     * @var array<string, list<array{id: string, text: string, weight: float}>>
     */
    private array $questionBank = [
        'Realistic' => [
            ['id' => 'R1', 'text' => 'Saya senang bekerja dengan alat dan mesin', 'weight' => 1.0],
            ['id' => 'R2', 'text' => 'Saya lebih suka pekerjaan yang melibatkan aktivitas fisik', 'weight' => 0.9],
            ['id' => 'R3', 'text' => 'Saya tertarik memperbaiki atau merakit barang elektronik', 'weight' => 1.1],
            ['id' => 'R4', 'text' => 'Saya nyaman bekerja di luar ruangan', 'weight' => 0.8],
            ['id' => 'R5', 'text' => 'Saya suka membuat sesuatu dengan tangan saya', 'weight' => 1.0],
            ['id' => 'R6', 'text' => 'Saya tertarik pada pekerjaan teknis dan mekanis', 'weight' => 1.2],
            ['id' => 'R7', 'text' => 'Saya lebih suka hasil kerja yang konkret dan terlihat', 'weight' => 0.9],
            ['id' => 'R8', 'text' => 'Saya senang mengoperasikan peralatan atau kendaraan', 'weight' => 0.8],
        ],
        'Investigative' => [
            ['id' => 'I1', 'text' => 'Saya senang menganalisis data dan informasi kompleks', 'weight' => 1.2],
            ['id' => 'I2', 'text' => 'Saya tertarik melakukan penelitian ilmiah', 'weight' => 1.3],
            ['id' => 'I3', 'text' => 'Saya suka memecahkan masalah yang rumit', 'weight' => 1.1],
            ['id' => 'I4', 'text' => 'Saya senang membaca jurnal atau artikel ilmiah', 'weight' => 1.0],
            ['id' => 'I5', 'text' => 'Saya tertarik memahami bagaimana sesuatu bekerja', 'weight' => 1.0],
            ['id' => 'I6', 'text' => 'Saya lebih suka berpikir abstrak dan teoretis', 'weight' => 1.1],
            ['id' => 'I7', 'text' => 'Saya senang bereksperimen dan menguji hipotesis', 'weight' => 1.2],
            ['id' => 'I8', 'text' => 'Saya tertarik pada matematika dan sains', 'weight' => 1.3],
        ],
        'Artistic' => [
            ['id' => 'A1', 'text' => 'Saya senang menciptakan karya seni atau desain', 'weight' => 1.3],
            ['id' => 'A2', 'text' => 'Saya lebih suka pekerjaan yang memungkinkan ekspresi kreatif', 'weight' => 1.2],
            ['id' => 'A3', 'text' => 'Saya tertarik pada musik, seni, atau sastra', 'weight' => 1.1],
            ['id' => 'A4', 'text' => 'Saya senang bekerja tanpa aturan yang kaku', 'weight' => 0.9],
            ['id' => 'A5', 'text' => 'Saya memiliki imajinasi yang kuat', 'weight' => 1.0],
            ['id' => 'A6', 'text' => 'Saya senang menulis cerita atau puisi', 'weight' => 1.1],
            ['id' => 'A7', 'text' => 'Saya tertarik pada desain visual atau grafis', 'weight' => 1.2],
            ['id' => 'A8', 'text' => 'Saya lebih suka pekerjaan yang unik dan tidak konvensional', 'weight' => 1.0],
        ],
        'Social' => [
            ['id' => 'S1', 'text' => 'Saya senang membantu orang lain menyelesaikan masalah', 'weight' => 1.2],
            ['id' => 'S2', 'text' => 'Saya tertarik pada pekerjaan yang melibatkan interaksi sosial', 'weight' => 1.1],
            ['id' => 'S3', 'text' => 'Saya senang mengajar atau melatih orang lain', 'weight' => 1.3],
            ['id' => 'S4', 'text' => 'Saya peduli dengan kesejahteraan orang lain', 'weight' => 1.0],
            ['id' => 'S5', 'text' => 'Saya senang bekerja dalam tim', 'weight' => 0.9],
            ['id' => 'S6', 'text' => 'Saya tertarik pada psikologi dan perilaku manusia', 'weight' => 1.1],
            ['id' => 'S7', 'text' => 'Saya senang memberikan konseling atau nasihat', 'weight' => 1.2],
            ['id' => 'S8', 'text' => 'Saya lebih suka pekerjaan yang berdampak sosial', 'weight' => 1.0],
        ],
        'Enterprising' => [
            ['id' => 'E1', 'text' => 'Saya senang memimpin dan mengelola proyek', 'weight' => 1.3],
            ['id' => 'E2', 'text' => 'Saya tertarik pada bisnis dan kewirausahaan', 'weight' => 1.2],
            ['id' => 'E3', 'text' => 'Saya senang meyakinkan orang lain', 'weight' => 1.1],
            ['id' => 'E4', 'text' => 'Saya berorientasi pada pencapaian dan target', 'weight' => 1.0],
            ['id' => 'E5', 'text' => 'Saya senang mengambil risiko yang terkalkulasi', 'weight' => 1.1],
            ['id' => 'E6', 'text' => 'Saya tertarik pada strategi dan perencanaan', 'weight' => 1.0],
            ['id' => 'E7', 'text' => 'Saya senang bernegosiasi dan membuat kesepakatan', 'weight' => 1.2],
            ['id' => 'E8', 'text' => 'Saya lebih suka posisi kepemimpinan', 'weight' => 1.3],
        ],
        'Conventional' => [
            ['id' => 'C1', 'text' => 'Saya senang bekerja dengan data dan angka', 'weight' => 1.1],
            ['id' => 'C2', 'text' => 'Saya lebih suka pekerjaan yang terstruktur dan terorganisir', 'weight' => 1.0],
            ['id' => 'C3', 'text' => 'Saya detail-oriented dan teliti', 'weight' => 1.2],
            ['id' => 'C4', 'text' => 'Saya senang mengikuti prosedur dan aturan', 'weight' => 0.9],
            ['id' => 'C5', 'text' => 'Saya tertarik pada administrasi dan manajemen data', 'weight' => 1.0],
            ['id' => 'C6', 'text' => 'Saya senang mengorganisir informasi', 'weight' => 1.1],
            ['id' => 'C7', 'text' => 'Saya lebih suka pekerjaan yang predictable', 'weight' => 0.8],
            ['id' => 'C8', 'text' => 'Saya tertarik pada akuntansi atau keuangan', 'weight' => 1.2],
        ],
    ];

    private array $interpretations = [
        'Realistic' => [
            'description' => 'Anda adalah individu yang praktis dan hands-on',
            'strengths' => ['Keterampilan teknis', 'Problem-solving praktis', 'Kemandirian'],
            'ideal_majors' => ['Teknik Mesin', 'Teknik Sipil', 'Arsitektur', 'Pertanian'],
            'career_paths' => ['Engineer', 'Teknisi', 'Arsitek', 'Pilot'],
        ],
        'Investigative' => [
            'description' => 'Anda adalah pemikir analitis dan peneliti',
            'strengths' => ['Analisis mendalam', 'Penelitian', 'Pemecahan masalah kompleks'],
            'ideal_majors' => ['Kedokteran', 'Farmasi', 'Matematika', 'Fisika', 'Kimia'],
            'career_paths' => ['Dokter', 'Peneliti', 'Scientist', 'Analis Data'],
        ],
        'Artistic' => [
            'description' => 'Anda adalah individu kreatif dan ekspresif',
            'strengths' => ['Kreativitas', 'Inovasi', 'Ekspresi diri'],
            'ideal_majors' => ['Desain Komunikasi Visual', 'Seni Rupa', 'Musik', 'Sastra'],
            'career_paths' => ['Desainer', 'Seniman', 'Penulis', 'Musisi'],
        ],
        'Social' => [
            'description' => 'Anda adalah individu yang empatik dan kolaboratif',
            'strengths' => ['Komunikasi', 'Empati', 'Kerja tim'],
            'ideal_majors' => ['Psikologi', 'Pendidikan', 'Keperawatan', 'Ilmu Komunikasi'],
            'career_paths' => ['Psikolog', 'Guru', 'Perawat', 'Konselor'],
        ],
        'Enterprising' => [
            'description' => 'Anda adalah pemimpin dan pengambil inisiatif',
            'strengths' => ['Kepemimpinan', 'Persuasi', 'Orientasi hasil'],
            'ideal_majors' => ['Manajemen', 'Ekonomi', 'Hukum', 'Marketing'],
            'career_paths' => ['Manager', 'Entrepreneur', 'Lawyer', 'Sales Director'],
        ],
        'Conventional' => [
            'description' => 'Anda adalah individu yang terorganisir dan detail-oriented',
            'strengths' => ['Organisasi', 'Ketelitian', 'Efisiensi'],
            'ideal_majors' => ['Akuntansi', 'Administrasi Bisnis', 'Perpajakan', 'Statistika'],
            'career_paths' => ['Akuntan', 'Administrator', 'Auditor', 'Data Manager'],
        ],
    ];

    /**
     * Get all questions for the RIASEC assessment, shuffled across dimensions.
     *
     * @return list<array{id: string, text: string, dimension: string}>
     */
    public function getQuestions(): array
    {
        $questions = [];

        foreach ($this->questionBank as $dimension => $items) {
            foreach ($items as $item) {
                $questions[] = [
                    'id' => $item['id'],
                    'text' => $item['text'],
                    'dimension' => $dimension,
                ];
            }
        }

        return $questions;
    }

    /**
     * Calculate the RIASEC profile from user responses.
     *
     * @param  array<string, int>  $responses  Map of questionId => rating (1–5)
     */
    public function calculateProfile(array $responses): array
    {
        $scores = [
            'Realistic' => 0.0,
            'Investigative' => 0.0,
            'Artistic' => 0.0,
            'Social' => 0.0,
            'Enterprising' => 0.0,
            'Conventional' => 0.0,
        ];

        foreach ($responses as $questionId => $rating) {
            $rating = max(1, min(5, (int) $rating));

            foreach ($this->questionBank as $dimension => $questions) {
                foreach ($questions as $question) {
                    if ($question['id'] === $questionId) {
                        $scores[$dimension] += $rating * $question['weight'];
                    }
                }
            }
        }

        // Normalize to 0–100 scale
        // Max possible per dimension = 8 items × 5 rating × 1.3 max weight = 52
        $maxPossible = 8 * 5 * 1.3;

        foreach ($scores as $dimension => $score) {
            $scores[$dimension] = round(($score / $maxPossible) * 100, 1);
        }

        $dominantType = array_keys($scores, max($scores))[0];

        return [
            'scores' => $scores,
            'dominant_type' => $dominantType,
            'holland_code' => $this->generateHollandCode($scores),
            'interpretation' => $this->interpretations[$dominantType] ?? [],
        ];
    }

    private function generateHollandCode(array $scores): string
    {
        arsort($scores);

        return implode('', array_map(
            fn ($key) => $key[0],
            array_slice(array_keys($scores), 0, 3),
        ));
    }
}
