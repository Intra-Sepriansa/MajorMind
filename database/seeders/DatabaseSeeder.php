<?php

namespace Database\Seeders;

use App\Models\Criterion;
use App\Models\Major;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            QuestionsTableSeeder::class,
            UniversitySeeder::class,
        ]);

        $criteria = [
            [
                'name' => 'Minat Pribadi',
                'slug' => 'minat_pribadi',
                'description' => 'Seberapa kuat kecenderungan siswa terhadap bidang studi tertentu.',
                'type' => 'benefit',
                'display_order' => 1,
            ],
            [
                'name' => 'Kemampuan Analitis',
                'slug' => 'kemampuan_analitis',
                'description' => 'Kecocokan kebutuhan logika dan pemecahan masalah pada jurusan.',
                'type' => 'benefit',
                'display_order' => 2,
            ],
            [
                'name' => 'Prospek Karier',
                'slug' => 'prospek_karier',
                'description' => 'Potensi keberlanjutan peluang kerja dari jurusan.',
                'type' => 'benefit',
                'display_order' => 3,
            ],
            [
                'name' => 'Kesiapan Akademik',
                'slug' => 'kesiapan_akademik',
                'description' => 'Tingkat kesesuaian jurusan dengan fondasi belajar siswa.',
                'type' => 'benefit',
                'display_order' => 4,
            ],
        ];

        foreach ($criteria as $criterion) {
            Criterion::query()->updateOrCreate(
                ['slug' => $criterion['slug']],
                $criterion,
            );
        }

        /**
         * 7-Dimension Behavioral Profile:
         *   minat_stem       — Kecenderungan terhadap STEM (Sains, Teknologi, Teknik, Matematika)
         *   minat_seni       — Kecenderungan terhadap seni, kreativitas, desain
         *   minat_sosial     — Kecenderungan terhadap interaksi sosial, membantu, memimpin
         *   keteraturan      — Kebutuhan akan struktur, detail, prosedur
         *   daya_juang       — Perseverance of Effort (ketahanan terhadap tantangan)
         *   konsistensi      — Consistency of Interest (stabilitas minat jangka panjang)
         *   logika           — Kemampuan logika kuantitatif dan penalaran
         *
         * RIASEC Profile:
         *   R (Realistic), I (Investigative), A (Artistic),
         *   S (Social), E (Enterprising), C (Conventional)
         *   → Skor 0-100 menunjukkan kesesuaian jurusan dengan tipe Holland
         */
        $majors = [
            // ═══════════════════════════════════════════════
            // TEKNIK & ILMU KOMPUTER
            // ═══════════════════════════════════════════════
            [
                'name' => 'Teknik Informatika',
                'slug' => 'teknik-informatika',
                'description' => 'Fokus pada rekayasa perangkat lunak, algoritma, sistem abstraksi, dan komputasi modern.',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 92, 'prospek_karier' => 95, 'kesiapan_akademik' => 85],
                'behavioral_profile' => [
                    'minat_stem' => 92, 'minat_seni' => 35, 'minat_sosial' => 40,
                    'keteraturan' => 78, 'daya_juang' => 85, 'konsistensi' => 82, 'logika' => 92,
                ],
                'riasec_profile' => ['R' => 70, 'I' => 95, 'A' => 40, 'S' => 30, 'E' => 45, 'C' => 75],
            ],
            [
                'name' => 'Sistem Informasi',
                'slug' => 'sistem-informasi',
                'description' => 'Kombinasi analisis bisnis, manajemen proses, dan implementasi teknologi informasi.',
                'criteria_scores' => ['minat_pribadi' => 80, 'kemampuan_analitis' => 84, 'prospek_karier' => 90, 'kesiapan_akademik' => 82],
                'behavioral_profile' => [
                    'minat_stem' => 80, 'minat_seni' => 30, 'minat_sosial' => 55,
                    'keteraturan' => 82, 'daya_juang' => 78, 'konsistensi' => 85, 'logika' => 84,
                ],
                'riasec_profile' => ['R' => 50, 'I' => 80, 'A' => 30, 'S' => 45, 'E' => 60, 'C' => 85],
            ],
            [
                'name' => 'Teknik Industri',
                'slug' => 'teknik-industri',
                'description' => 'Integrasi optimasi sistem, analisis proses, ergonomi, dan efisiensi operasional pabrik.',
                'criteria_scores' => ['minat_pribadi' => 78, 'kemampuan_analitis' => 88, 'prospek_karier' => 88, 'kesiapan_akademik' => 85],
                'behavioral_profile' => [
                    'minat_stem' => 82, 'minat_seni' => 25, 'minat_sosial' => 55,
                    'keteraturan' => 88, 'daya_juang' => 82, 'konsistensi' => 86, 'logika' => 88,
                ],
                'riasec_profile' => ['R' => 65, 'I' => 80, 'A' => 25, 'S' => 40, 'E' => 65, 'C' => 80],
            ],
            [
                'name' => 'Teknik Sipil',
                'slug' => 'teknik-sipil',
                'description' => 'Mempelajari perancangan, pembangunan, dan pemeliharaan lingkungan fisik seperti gedung dan infrastruktur.',
                'criteria_scores' => ['minat_pribadi' => 75, 'kemampuan_analitis' => 90, 'prospek_karier' => 85, 'kesiapan_akademik' => 88],
                'behavioral_profile' => [
                    'minat_stem' => 88, 'minat_seni' => 35, 'minat_sosial' => 35,
                    'keteraturan' => 85, 'daya_juang' => 84, 'konsistensi' => 85, 'logika' => 89,
                ],
                'riasec_profile' => ['R' => 90, 'I' => 75, 'A' => 35, 'S' => 30, 'E' => 40, 'C' => 70],
            ],
            [
                'name' => 'Teknik Mesin',
                'slug' => 'teknik-mesin',
                'description' => 'Mengaplikasikan prinsip fisika (kinematika, termodinamika) untuk perancangan mekanis.',
                'criteria_scores' => ['minat_pribadi' => 80, 'kemampuan_analitis' => 94, 'prospek_karier' => 86, 'kesiapan_akademik' => 92],
                'behavioral_profile' => [
                    'minat_stem' => 94, 'minat_seni' => 25, 'minat_sosial' => 30,
                    'keteraturan' => 80, 'daya_juang' => 88, 'konsistensi' => 84, 'logika' => 94,
                ],
                'riasec_profile' => ['R' => 95, 'I' => 85, 'A' => 20, 'S' => 25, 'E' => 35, 'C' => 60],
            ],
            [
                'name' => 'Teknik Elektro',
                'slug' => 'teknik-elektro',
                'description' => 'Mempelajari kelistrikan, elektronika, dan elektromagnetisme dalam sistem modern.',
                'criteria_scores' => ['minat_pribadi' => 80, 'kemampuan_analitis' => 95, 'prospek_karier' => 86, 'kesiapan_akademik' => 93],
                'behavioral_profile' => [
                    'minat_stem' => 95, 'minat_seni' => 20, 'minat_sosial' => 28,
                    'keteraturan' => 78, 'daya_juang' => 88, 'konsistensi' => 85, 'logika' => 95,
                ],
                'riasec_profile' => ['R' => 90, 'I' => 90, 'A' => 15, 'S' => 20, 'E' => 30, 'C' => 65],
            ],
            [
                'name' => 'Arsitektur',
                'slug' => 'arsitektur',
                'description' => 'Memadukan desain estetika, ketelitian teknis, dan kemampuan menyusun solusi ruang bangunan.',
                'criteria_scores' => ['minat_pribadi' => 90, 'kemampuan_analitis' => 84, 'prospek_karier' => 82, 'kesiapan_akademik' => 88],
                'behavioral_profile' => [
                    'minat_stem' => 65, 'minat_seni' => 88, 'minat_sosial' => 45,
                    'keteraturan' => 80, 'daya_juang' => 85, 'konsistensi' => 90, 'logika' => 82,
                ],
                'riasec_profile' => ['R' => 70, 'I' => 60, 'A' => 90, 'S' => 35, 'E' => 40, 'C' => 55],
            ],

            // ═══════════════════════════════════════════════
            // KEDOKTERAN & KESEHATAN
            // ═══════════════════════════════════════════════
            [
                'name' => 'Kedokteran Umum',
                'slug' => 'kedokteran-umum',
                'description' => 'Mempelajari ilmu medis, anatomi, penyakit, dan penanganan kesehatan pasien secara komprehensif.',
                'criteria_scores' => ['minat_pribadi' => 95, 'kemampuan_analitis' => 90, 'prospek_karier' => 95, 'kesiapan_akademik' => 98],
                'behavioral_profile' => [
                    'minat_stem' => 85, 'minat_seni' => 20, 'minat_sosial' => 80,
                    'keteraturan' => 90, 'daya_juang' => 96, 'konsistensi' => 98, 'logika' => 88,
                ],
                'riasec_profile' => ['R' => 55, 'I' => 95, 'A' => 20, 'S' => 85, 'E' => 40, 'C' => 60],
            ],
            [
                'name' => 'Kedokteran Gigi',
                'slug' => 'kedokteran-gigi',
                'description' => 'Berfokus pada kesehatan oral, anatomi regio mulut, dan prosedur dental.',
                'criteria_scores' => ['minat_pribadi' => 90, 'kemampuan_analitis' => 85, 'prospek_karier' => 92, 'kesiapan_akademik' => 95],
                'behavioral_profile' => [
                    'minat_stem' => 80, 'minat_seni' => 35, 'minat_sosial' => 72,
                    'keteraturan' => 88, 'daya_juang' => 92, 'konsistensi' => 95, 'logika' => 84,
                ],
                'riasec_profile' => ['R' => 70, 'I' => 85, 'A' => 30, 'S' => 75, 'E' => 35, 'C' => 55],
            ],
            [
                'name' => 'Farmasi',
                'slug' => 'farmasi',
                'description' => 'Mempelajari sintesis obat, kimia medisinal, dan kefarmasian klinis.',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 92, 'prospek_karier' => 90, 'kesiapan_akademik' => 94],
                'behavioral_profile' => [
                    'minat_stem' => 88, 'minat_seni' => 18, 'minat_sosial' => 45,
                    'keteraturan' => 92, 'daya_juang' => 90, 'konsistensi' => 96, 'logika' => 90,
                ],
                'riasec_profile' => ['R' => 50, 'I' => 90, 'A' => 15, 'S' => 55, 'E' => 30, 'C' => 85],
            ],
            [
                'name' => 'Ilmu Keperawatan',
                'slug' => 'ilmu-keperawatan',
                'description' => 'Asuhan keperawatan profesional yang butuh ketahanan fisik, empati tinggi, & pengetahuan medis.',
                'criteria_scores' => ['minat_pribadi' => 92, 'kemampuan_analitis' => 78, 'prospek_karier' => 92, 'kesiapan_akademik' => 85],
                'behavioral_profile' => [
                    'minat_stem' => 60, 'minat_seni' => 20, 'minat_sosial' => 92,
                    'keteraturan' => 85, 'daya_juang' => 90, 'konsistensi' => 92, 'logika' => 75,
                ],
                'riasec_profile' => ['R' => 45, 'I' => 60, 'A' => 15, 'S' => 95, 'E' => 30, 'C' => 65],
            ],
            [
                'name' => 'Kesehatan Masyarakat',
                'slug' => 'kesehatan-masyarakat',
                'description' => 'Fokus ke epidemiologi, pencegahan penyakit, biostatistik, dan kebijakan kesehatan komunitas.',
                'criteria_scores' => ['minat_pribadi' => 82, 'kemampuan_analitis' => 82, 'prospek_karier' => 85, 'kesiapan_akademik' => 83],
                'behavioral_profile' => [
                    'minat_stem' => 62, 'minat_seni' => 20, 'minat_sosial' => 80,
                    'keteraturan' => 78, 'daya_juang' => 80, 'konsistensi' => 84, 'logika' => 80,
                ],
                'riasec_profile' => ['R' => 35, 'I' => 75, 'A' => 15, 'S' => 85, 'E' => 55, 'C' => 65],
            ],
            [
                'name' => 'Gizi',
                'slug' => 'gizi',
                'description' => 'Ilmu asupan nutrisi, metabolisme, dan penyusunan diet medis/klinik bagi masyarakat.',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 84, 'prospek_karier' => 86, 'kesiapan_akademik' => 86],
                'behavioral_profile' => [
                    'minat_stem' => 68, 'minat_seni' => 22, 'minat_sosial' => 75,
                    'keteraturan' => 82, 'daya_juang' => 82, 'konsistensi' => 85, 'logika' => 82,
                ],
                'riasec_profile' => ['R' => 40, 'I' => 80, 'A' => 20, 'S' => 75, 'E' => 35, 'C' => 70],
            ],

            // ═══════════════════════════════════════════════
            // MIPA
            // ═══════════════════════════════════════════════
            [
                'name' => 'Matematika',
                'slug' => 'matematika',
                'description' => 'Ilmu murni tentang struktur, ruang, dan perubahan dengan logika deduktif ekstrem.',
                'criteria_scores' => ['minat_pribadi' => 88, 'kemampuan_analitis' => 98, 'prospek_karier' => 82, 'kesiapan_akademik' => 95],
                'behavioral_profile' => [
                    'minat_stem' => 95, 'minat_seni' => 15, 'minat_sosial' => 25,
                    'keteraturan' => 82, 'daya_juang' => 90, 'konsistensi' => 86, 'logika' => 98,
                ],
                'riasec_profile' => ['R' => 30, 'I' => 98, 'A' => 20, 'S' => 20, 'E' => 20, 'C' => 80],
            ],
            [
                'name' => 'Statistika',
                'slug' => 'statistika',
                'description' => 'Mempelajari pengumpulan, analisis, interpretasi, dan presentasi data.',
                'criteria_scores' => ['minat_pribadi' => 80, 'kemampuan_analitis' => 95, 'prospek_karier' => 94, 'kesiapan_akademik' => 92],
                'behavioral_profile' => [
                    'minat_stem' => 90, 'minat_seni' => 15, 'minat_sosial' => 30,
                    'keteraturan' => 90, 'daya_juang' => 85, 'konsistensi' => 88, 'logika' => 96,
                ],
                'riasec_profile' => ['R' => 30, 'I' => 92, 'A' => 15, 'S' => 25, 'E' => 35, 'C' => 90],
            ],
            [
                'name' => 'Aktuaria',
                'slug' => 'aktuaria',
                'description' => 'Ilmu statistika dan probabilitas untuk menghitung risiko asuransi dan keuangan.',
                'criteria_scores' => ['minat_pribadi' => 82, 'kemampuan_analitis' => 98, 'prospek_karier' => 96, 'kesiapan_akademik' => 96],
                'behavioral_profile' => [
                    'minat_stem' => 92, 'minat_seni' => 10, 'minat_sosial' => 30,
                    'keteraturan' => 95, 'daya_juang' => 92, 'konsistensi' => 90, 'logika' => 98,
                ],
                'riasec_profile' => ['R' => 25, 'I' => 90, 'A' => 10, 'S' => 20, 'E' => 50, 'C' => 95],
            ],
            [
                'name' => 'Bioteknologi',
                'slug' => 'bioteknologi',
                'description' => 'Menggabungkan sains hayati, eksperimen, dan penerapan teknologi untuk inovasi riset.',
                'criteria_scores' => ['minat_pribadi' => 84, 'kemampuan_analitis' => 88, 'prospek_karier' => 82, 'kesiapan_akademik' => 88],
                'behavioral_profile' => [
                    'minat_stem' => 88, 'minat_seni' => 20, 'minat_sosial' => 35,
                    'keteraturan' => 82, 'daya_juang' => 86, 'konsistensi' => 88, 'logika' => 86,
                ],
                'riasec_profile' => ['R' => 60, 'I' => 92, 'A' => 20, 'S' => 30, 'E' => 30, 'C' => 60],
            ],

            // ═══════════════════════════════════════════════
            // EKONOMI & BISNIS
            // ═══════════════════════════════════════════════
            [
                'name' => 'Manajemen',
                'slug' => 'manajemen',
                'description' => 'Berfokus pada strategi, kepemimpinan, pemasaran, SDM, dan pengambilan keputusan organisasi.',
                'criteria_scores' => ['minat_pribadi' => 80, 'kemampuan_analitis' => 78, 'prospek_karier' => 88, 'kesiapan_akademik' => 80],
                'behavioral_profile' => [
                    'minat_stem' => 35, 'minat_seni' => 30, 'minat_sosial' => 85,
                    'keteraturan' => 70, 'daya_juang' => 80, 'konsistensi' => 82, 'logika' => 76,
                ],
                'riasec_profile' => ['R' => 20, 'I' => 40, 'A' => 30, 'S' => 65, 'E' => 95, 'C' => 60],
            ],
            [
                'name' => 'Akuntansi',
                'slug' => 'akuntansi',
                'description' => 'Menekankan ketelitian laporan, pengelolaan data keuangan, dan audit.',
                'criteria_scores' => ['minat_pribadi' => 80, 'kemampuan_analitis' => 86, 'prospek_karier' => 90, 'kesiapan_akademik' => 85],
                'behavioral_profile' => [
                    'minat_stem' => 45, 'minat_seni' => 12, 'minat_sosial' => 40,
                    'keteraturan' => 95, 'daya_juang' => 82, 'konsistensi' => 95, 'logika' => 85,
                ],
                'riasec_profile' => ['R' => 15, 'I' => 50, 'A' => 10, 'S' => 30, 'E' => 55, 'C' => 98],
            ],
            [
                'name' => 'Ilmu Ekonomi',
                'slug' => 'ilmu-ekonomi',
                'description' => 'Mempelajari makro/mikro ekonomi, moneter, fiskal, dan pembangunan.',
                'criteria_scores' => ['minat_pribadi' => 82, 'kemampuan_analitis' => 88, 'prospek_karier' => 84, 'kesiapan_akademik' => 86],
                'behavioral_profile' => [
                    'minat_stem' => 55, 'minat_seni' => 15, 'minat_sosial' => 55,
                    'keteraturan' => 78, 'daya_juang' => 80, 'konsistensi' => 82, 'logika' => 88,
                ],
                'riasec_profile' => ['R' => 15, 'I' => 75, 'A' => 15, 'S' => 45, 'E' => 70, 'C' => 75],
            ],
            [
                'name' => 'Bisnis Digital',
                'slug' => 'bisnis-digital',
                'description' => 'Perpaduan antara manajemen bisnis dengan inovasi teknologi informasi (startup, e-commerce).',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 80, 'prospek_karier' => 88, 'kesiapan_akademik' => 80],
                'behavioral_profile' => [
                    'minat_stem' => 55, 'minat_seni' => 45, 'minat_sosial' => 72,
                    'keteraturan' => 65, 'daya_juang' => 82, 'konsistensi' => 78, 'logika' => 80,
                ],
                'riasec_profile' => ['R' => 25, 'I' => 50, 'A' => 40, 'S' => 50, 'E' => 90, 'C' => 55],
            ],

            // ═══════════════════════════════════════════════
            // HUKUM & ILMU SOSIAL & POLITIK
            // ═══════════════════════════════════════════════
            [
                'name' => 'Ilmu Hukum',
                'slug' => 'ilmu-hukum',
                'description' => 'Berfokus pada tata peradilan, konstitusi, regulasi bisnis, dan penyelesaian sengketa.',
                'criteria_scores' => ['minat_pribadi' => 86, 'kemampuan_analitis' => 90, 'prospek_karier' => 88, 'kesiapan_akademik' => 86],
                'behavioral_profile' => [
                    'minat_stem' => 25, 'minat_seni' => 25, 'minat_sosial' => 75,
                    'keteraturan' => 88, 'daya_juang' => 88, 'konsistensi' => 92, 'logika' => 90,
                ],
                'riasec_profile' => ['R' => 10, 'I' => 65, 'A' => 25, 'S' => 60, 'E' => 80, 'C' => 75],
            ],
            [
                'name' => 'Ilmu Komunikasi',
                'slug' => 'ilmu-komunikasi',
                'description' => 'Mempelajari media, relasi publik (PR), broadcasting, dan interaksi interpersonal manusia.',
                'criteria_scores' => ['minat_pribadi' => 88, 'kemampuan_analitis' => 74, 'prospek_karier' => 85, 'kesiapan_akademik' => 78],
                'behavioral_profile' => [
                    'minat_stem' => 20, 'minat_seni' => 70, 'minat_sosial' => 90,
                    'keteraturan' => 55, 'daya_juang' => 72, 'konsistensi' => 78, 'logika' => 72,
                ],
                'riasec_profile' => ['R' => 15, 'I' => 30, 'A' => 75, 'S' => 80, 'E' => 75, 'C' => 35],
            ],
            [
                'name' => 'Hubungan Internasional',
                'slug' => 'hubungan-internasional',
                'description' => 'Mengkaji dinamika politik global, diplomasi, hukum internasional, dan organisasi lintas negara.',
                'criteria_scores' => ['minat_pribadi' => 90, 'kemampuan_analitis' => 84, 'prospek_karier' => 82, 'kesiapan_akademik' => 85],
                'behavioral_profile' => [
                    'minat_stem' => 20, 'minat_seni' => 35, 'minat_sosial' => 88,
                    'keteraturan' => 68, 'daya_juang' => 82, 'konsistensi' => 82, 'logika' => 82,
                ],
                'riasec_profile' => ['R' => 10, 'I' => 55, 'A' => 35, 'S' => 75, 'E' => 85, 'C' => 50],
            ],
            [
                'name' => 'Ilmu Politik',
                'slug' => 'ilmu-politik',
                'description' => 'Menganalisis sistem pemerintahan, kebijakan negara, dan perilaku institusi politis.',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 82, 'prospek_karier' => 78, 'kesiapan_akademik' => 82],
                'behavioral_profile' => [
                    'minat_stem' => 18, 'minat_seni' => 30, 'minat_sosial' => 85,
                    'keteraturan' => 62, 'daya_juang' => 78, 'konsistensi' => 78, 'logika' => 82,
                ],
                'riasec_profile' => ['R' => 10, 'I' => 55, 'A' => 30, 'S' => 70, 'E' => 90, 'C' => 45],
            ],
            [
                'name' => 'Kriminologi',
                'slug' => 'kriminologi',
                'description' => 'Ilmu sosiologi terapan untuk meneliti pola kejahatan, perilaku pelaku, dan sistem peradilan.',
                'criteria_scores' => ['minat_pribadi' => 88, 'kemampuan_analitis' => 85, 'prospek_karier' => 78, 'kesiapan_akademik' => 83],
                'behavioral_profile' => [
                    'minat_stem' => 30, 'minat_seni' => 22, 'minat_sosial' => 78,
                    'keteraturan' => 72, 'daya_juang' => 80, 'konsistensi' => 80, 'logika' => 85,
                ],
                'riasec_profile' => ['R' => 20, 'I' => 75, 'A' => 20, 'S' => 70, 'E' => 55, 'C' => 60],
            ],
            [
                'name' => 'Sosiologi',
                'slug' => 'sosiologi',
                'description' => 'Mempelajari struktur, pergerakan, dan fenomena di masyarakat secara empiris.',
                'criteria_scores' => ['minat_pribadi' => 82, 'kemampuan_analitis' => 80, 'prospek_karier' => 76, 'kesiapan_akademik' => 80],
                'behavioral_profile' => [
                    'minat_stem' => 22, 'minat_seni' => 30, 'minat_sosial' => 88,
                    'keteraturan' => 60, 'daya_juang' => 75, 'konsistensi' => 78, 'logika' => 80,
                ],
                'riasec_profile' => ['R' => 10, 'I' => 65, 'A' => 30, 'S' => 90, 'E' => 40, 'C' => 40],
            ],

            // ═══════════════════════════════════════════════
            // PSIKOLOGI & HUMANIORA
            // ═══════════════════════════════════════════════
            [
                'name' => 'Psikologi',
                'slug' => 'psikologi',
                'description' => 'Mempelajari perilaku manusia, alat tes, neuropsikologi, riset kognitif dan industri.',
                'criteria_scores' => ['minat_pribadi' => 88, 'kemampuan_analitis' => 82, 'prospek_karier' => 85, 'kesiapan_akademik' => 85],
                'behavioral_profile' => [
                    'minat_stem' => 40, 'minat_seni' => 35, 'minat_sosial' => 90,
                    'keteraturan' => 72, 'daya_juang' => 82, 'konsistensi' => 84, 'logika' => 80,
                ],
                'riasec_profile' => ['R' => 15, 'I' => 80, 'A' => 35, 'S' => 92, 'E' => 45, 'C' => 50],
            ],
            [
                'name' => 'Sastra Inggris',
                'slug' => 'sastra-inggris',
                'description' => 'Kajian sejarah sastra, linguistik bahasa Inggris, dan cultural studies.',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 78, 'prospek_karier' => 82, 'kesiapan_akademik' => 80],
                'behavioral_profile' => [
                    'minat_stem' => 15, 'minat_seni' => 88, 'minat_sosial' => 62,
                    'keteraturan' => 58, 'daya_juang' => 78, 'konsistensi' => 80, 'logika' => 75,
                ],
                'riasec_profile' => ['R' => 10, 'I' => 45, 'A' => 92, 'S' => 55, 'E' => 30, 'C' => 35],
            ],
            [
                'name' => 'Ilmu Sejarah',
                'slug' => 'ilmu-sejarah',
                'description' => 'Kajian runut waktu kejadian masa lalu melalui artefak, arsip, dan literatur.',
                'criteria_scores' => ['minat_pribadi' => 90, 'kemampuan_analitis' => 80, 'prospek_karier' => 75, 'kesiapan_akademik' => 82],
                'behavioral_profile' => [
                    'minat_stem' => 15, 'minat_seni' => 65, 'minat_sosial' => 55,
                    'keteraturan' => 72, 'daya_juang' => 82, 'konsistensi' => 85, 'logika' => 78,
                ],
                'riasec_profile' => ['R' => 10, 'I' => 70, 'A' => 65, 'S' => 50, 'E' => 25, 'C' => 55],
            ],
            [
                'name' => 'Desain Komunikasi Visual',
                'slug' => 'desain-komunikasi-visual',
                'description' => 'Jalur seni yang menekankan ide visual, desain grafis, animasi, dan pemecahan masalah desain.',
                'criteria_scores' => ['minat_pribadi' => 92, 'kemampuan_analitis' => 70, 'prospek_karier' => 84, 'kesiapan_akademik' => 75],
                'behavioral_profile' => [
                    'minat_stem' => 25, 'minat_seni' => 96, 'minat_sosial' => 50,
                    'keteraturan' => 50, 'daya_juang' => 80, 'konsistensi' => 80, 'logika' => 70,
                ],
                'riasec_profile' => ['R' => 30, 'I' => 25, 'A' => 98, 'S' => 40, 'E' => 45, 'C' => 25],
            ],

            // ═══════════════════════════════════════════════
            // PERTANIAN, PETERNAKAN & AGROTEK
            // ═══════════════════════════════════════════════
            [
                'name' => 'Agribisnis',
                'slug' => 'agribisnis',
                'description' => 'Perpaduan ilmu pertanian dan ekonomi untuk memaksimalkan hasil bisnis komoditas.',
                'criteria_scores' => ['minat_pribadi' => 80, 'kemampuan_analitis' => 78, 'prospek_karier' => 82, 'kesiapan_akademik' => 80],
                'behavioral_profile' => [
                    'minat_stem' => 50, 'minat_seni' => 18, 'minat_sosial' => 60,
                    'keteraturan' => 72, 'daya_juang' => 80, 'konsistensi' => 82, 'logika' => 78,
                ],
                'riasec_profile' => ['R' => 55, 'I' => 45, 'A' => 15, 'S' => 40, 'E' => 75, 'C' => 65],
            ],
            [
                'name' => 'Agroteknologi',
                'slug' => 'agroteknologi',
                'description' => 'Ilmu budidaya tanaman dan optimasi lahan menggunakan teknologi modern.',
                'criteria_scores' => ['minat_pribadi' => 82, 'kemampuan_analitis' => 82, 'prospek_karier' => 80, 'kesiapan_akademik' => 82],
                'behavioral_profile' => [
                    'minat_stem' => 65, 'minat_seni' => 15, 'minat_sosial' => 40,
                    'keteraturan' => 75, 'daya_juang' => 82, 'konsistensi' => 82, 'logika' => 80,
                ],
                'riasec_profile' => ['R' => 80, 'I' => 65, 'A' => 10, 'S' => 30, 'E' => 40, 'C' => 55],
            ],
            [
                'name' => 'Ilmu Kehutanan',
                'slug' => 'ilmu-kehutanan',
                'description' => 'Manajemen ekosistem hutan, konservasi alam, dan pengelolaan hasil hutan lestari.',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 80, 'prospek_karier' => 78, 'kesiapan_akademik' => 80],
                'behavioral_profile' => [
                    'minat_stem' => 58, 'minat_seni' => 20, 'minat_sosial' => 45,
                    'keteraturan' => 70, 'daya_juang' => 84, 'konsistensi' => 85, 'logika' => 78,
                ],
                'riasec_profile' => ['R' => 85, 'I' => 60, 'A' => 15, 'S' => 35, 'E' => 30, 'C' => 50],
            ],

            // ═══════════════════════════════════════════════
            // PENDIDIKAN
            // ═══════════════════════════════════════════════
            [
                'name' => 'Pendidikan Guru Sekolah Dasar',
                'slug' => 'pgsd',
                'description' => 'Mencetak pendidik tingkat dasar, menuntut kesabaran ekstra dan metodologi pengajaran.',
                'criteria_scores' => ['minat_pribadi' => 92, 'kemampuan_analitis' => 70, 'prospek_karier' => 88, 'kesiapan_akademik' => 75],
                'behavioral_profile' => [
                    'minat_stem' => 25, 'minat_seni' => 45, 'minat_sosial' => 95,
                    'keteraturan' => 72, 'daya_juang' => 88, 'konsistensi' => 90, 'logika' => 70,
                ],
                'riasec_profile' => ['R' => 15, 'I' => 30, 'A' => 50, 'S' => 98, 'E' => 45, 'C' => 45],
            ],
            [
                'name' => 'Pendidikan Bahasa Inggris',
                'slug' => 'pendidikan-bahasa-inggris',
                'description' => 'Berorientasi pada penguasaan linguistik inggris dan pedagogi mengajar.',
                'criteria_scores' => ['minat_pribadi' => 85, 'kemampuan_analitis' => 74, 'prospek_karier' => 82, 'kesiapan_akademik' => 80],
                'behavioral_profile' => [
                    'minat_stem' => 15, 'minat_seni' => 62, 'minat_sosial' => 88,
                    'keteraturan' => 65, 'daya_juang' => 80, 'konsistensi' => 84, 'logika' => 72,
                ],
                'riasec_profile' => ['R' => 10, 'I' => 35, 'A' => 70, 'S' => 90, 'E' => 40, 'C' => 40],
            ],
            [
                'name' => 'Pendidikan Matematika',
                'slug' => 'pendidikan-matematika',
                'description' => 'Memadukan kemampuan logika matematis tinggi dengan kurikulum keguruan.',
                'criteria_scores' => ['minat_pribadi' => 82, 'kemampuan_analitis' => 92, 'prospek_karier' => 84, 'kesiapan_akademik' => 88],
                'behavioral_profile' => [
                    'minat_stem' => 75, 'minat_seni' => 15, 'minat_sosial' => 78,
                    'keteraturan' => 80, 'daya_juang' => 85, 'konsistensi' => 86, 'logika' => 92,
                ],
                'riasec_profile' => ['R' => 20, 'I' => 85, 'A' => 15, 'S' => 85, 'E' => 35, 'C' => 65],
            ],
        ];

        foreach ($majors as $major) {
            Major::query()->updateOrCreate(
                ['slug' => $major['slug']],
                $major,
            );
        }
    }
}
