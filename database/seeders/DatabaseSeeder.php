<?php

namespace Database\Seeders;

use App\Models\Criterion;
use App\Models\Major;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MahasiswaSqlSeeder::class,
            QuestionsTableSeeder::class,
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

        $majors = [
            // TEKNIK & ILMU KOMPUTER
            [
                'name' => 'Teknik Informatika',
                'slug' => 'teknik-informatika',
                'description' => 'Fokus pada rekayasa perangkat lunak, algoritma, sistem abstraksi, dan komputasi modern.',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 92,
                    'prospek_karier' => 95,
                    'kesiapan_akademik' => 85,
                ],
                'behavioral_profile' => ['minat' => 88, 'logika' => 92, 'konsistensi' => 82],
            ],
            [
                'name' => 'Sistem Informasi',
                'slug' => 'sistem-informasi',
                'description' => 'Kombinasi analisis bisnis, manajemen proses, dan implementasi teknologi informasi.',
                'criteria_scores' => [
                    'minat_pribadi' => 80,
                    'kemampuan_analitis' => 84,
                    'prospek_karier' => 90,
                    'kesiapan_akademik' => 82,
                ],
                'behavioral_profile' => ['minat' => 82, 'logika' => 84, 'konsistensi' => 85],
            ],
            [
                'name' => 'Teknik Industri',
                'slug' => 'teknik-industri',
                'description' => 'Integrasi optimasi sistem, analisis proses, ergonomi, dan efisiensi operasional pabrik.',
                'criteria_scores' => [
                    'minat_pribadi' => 78,
                    'kemampuan_analitis' => 88,
                    'prospek_karier' => 88,
                    'kesiapan_akademik' => 85,
                ],
                'behavioral_profile' => ['minat' => 76, 'logika' => 88, 'konsistensi' => 86],
            ],
            [
                'name' => 'Teknik Sipil',
                'slug' => 'teknik-sipil',
                'description' => 'Mempelajari perancangan, pembangunan, dan pemeliharaan lingkungan fisik seperti gedung dan infrastruktur.',
                'criteria_scores' => [
                    'minat_pribadi' => 75,
                    'kemampuan_analitis' => 90,
                    'prospek_karier' => 85,
                    'kesiapan_akademik' => 88,
                ],
                'behavioral_profile' => ['minat' => 78, 'logika' => 89, 'konsistensi' => 85],
            ],
            [
                'name' => 'Teknik Mesin',
                'slug' => 'teknik-mesin',
                'description' => 'Mengaplikasikan prinsip fisika (kinematika, termodinamika) untuk perancangan mekanis.',
                'criteria_scores' => [
                    'minat_pribadi' => 80,
                    'kemampuan_analitis' => 94,
                    'prospek_karier' => 86,
                    'kesiapan_akademik' => 92,
                ],
                'behavioral_profile' => ['minat' => 82, 'logika' => 94, 'konsistensi' => 84],
            ],
            [
                'name' => 'Teknik Elektro',
                'slug' => 'teknik-elektro',
                'description' => 'Mempelajari kelistrikan, elektronika, dan elektromagnetisme dalam sistem modern.',
                'criteria_scores' => [
                    'minat_pribadi' => 80,
                    'kemampuan_analitis' => 95,
                    'prospek_karier' => 86,
                    'kesiapan_akademik' => 93,
                ],
                'behavioral_profile' => ['minat' => 80, 'logika' => 95, 'konsistensi' => 85],
            ],
            [
                'name' => 'Arsitektur',
                'slug' => 'arsitektur',
                'description' => 'Memadukan desain estetika, ketelitian teknis, dan kemampuan menyusun solusi ruang bangunan.',
                'criteria_scores' => [
                    'minat_pribadi' => 90,
                    'kemampuan_analitis' => 84,
                    'prospek_karier' => 82,
                    'kesiapan_akademik' => 88,
                ],
                'behavioral_profile' => ['minat' => 92, 'logika' => 82, 'konsistensi' => 90],
            ],

            // KEDOKTERAN & KESEHATAN
            [
                'name' => 'Kedokteran Umum',
                'slug' => 'kedokteran-umum',
                'description' => 'Mempelajari ilmu medis, anatomi, penyakit, dan penanganan kesehatan pasien secara komprehensif.',
                'criteria_scores' => [
                    'minat_pribadi' => 95,
                    'kemampuan_analitis' => 90,
                    'prospek_karier' => 95,
                    'kesiapan_akademik' => 98,
                ],
                'behavioral_profile' => ['minat' => 95, 'logika' => 88, 'konsistensi' => 98],
            ],
            [
                'name' => 'Kedokteran Gigi',
                'slug' => 'kedokteran-gigi',
                'description' => 'Berfokus pada kesehatan oral, anatomi regio mulut, dan prosedur dental.',
                'criteria_scores' => [
                    'minat_pribadi' => 90,
                    'kemampuan_analitis' => 85,
                    'prospek_karier' => 92,
                    'kesiapan_akademik' => 95,
                ],
                'behavioral_profile' => ['minat' => 90, 'logika' => 84, 'konsistensi' => 95],
            ],
            [
                'name' => 'Farmasi',
                'slug' => 'farmasi',
                'description' => 'Mempelajari sintesis obat, kimia medisinal, dan kefarmasian klinis.',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 92,
                    'prospek_karier' => 90,
                    'kesiapan_akademik' => 94,
                ],
                'behavioral_profile' => ['minat' => 84, 'logika' => 90, 'konsistensi' => 96],
            ],
            [
                'name' => 'Ilmu Keperawatan',
                'slug' => 'ilmu-keperawatan',
                'description' => 'Asuhan keperawatan profesional yang butuh ketahanan fisik, empati tinggi, & pengetahuan medis.',
                'criteria_scores' => [
                    'minat_pribadi' => 92,
                    'kemampuan_analitis' => 78,
                    'prospek_karier' => 92,
                    'kesiapan_akademik' => 85,
                ],
                'behavioral_profile' => ['minat' => 94, 'logika' => 75, 'konsistensi' => 92],
            ],
            [
                'name' => 'Kesehatan Masyarakat',
                'slug' => 'kesehatan-masyarakat',
                'description' => 'Fokus ke epidemiologi, pencegahan penyakit, biostatistik, dan kebijakan kesehatan komunitas.',
                'criteria_scores' => [
                    'minat_pribadi' => 82,
                    'kemampuan_analitis' => 82,
                    'prospek_karier' => 85,
                    'kesiapan_akademik' => 83,
                ],
                'behavioral_profile' => ['minat' => 82, 'logika' => 80, 'konsistensi' => 84],
            ],
            [
                'name' => 'Gizi',
                'slug' => 'gizi',
                'description' => 'Ilmu asupan nutrisi, metabolisme, dan penyusunan diet medis/klinik bagi masyarakat.',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 84,
                    'prospek_karier' => 86,
                    'kesiapan_akademik' => 86,
                ],
                'behavioral_profile' => ['minat' => 86, 'logika' => 82, 'konsistensi' => 85],
            ],

            // MIPA
            [
                'name' => 'Matematika',
                'slug' => 'matematika',
                'description' => 'Ilmu murni tentang struktur, ruang, dan perubahan dengan logika deduktif ekstrem.',
                'criteria_scores' => [
                    'minat_pribadi' => 88,
                    'kemampuan_analitis' => 98,
                    'prospek_karier' => 82,
                    'kesiapan_akademik' => 95,
                ],
                'behavioral_profile' => ['minat' => 85, 'logika' => 98, 'konsistensi' => 86],
            ],
            [
                'name' => 'Statistika',
                'slug' => 'statistika',
                'description' => 'Mempelajari pengumpulan, analisis, interpretasi, dan presentasi data.',
                'criteria_scores' => [
                    'minat_pribadi' => 80,
                    'kemampuan_analitis' => 95,
                    'prospek_karier' => 94,
                    'kesiapan_akademik' => 92,
                ],
                'behavioral_profile' => ['minat' => 80, 'logika' => 96, 'konsistensi' => 88],
            ],
            [
                'name' => 'Aktuaria',
                'slug' => 'aktuaria',
                'description' => 'Ilmu statistika dan probabilitas untuk menghitung risiko asuransi dan keuangan.',
                'criteria_scores' => [
                    'minat_pribadi' => 82,
                    'kemampuan_analitis' => 98,
                    'prospek_karier' => 96,
                    'kesiapan_akademik' => 96,
                ],
                'behavioral_profile' => ['minat' => 80, 'logika' => 98, 'konsistensi' => 90],
            ],
            [
                'name' => 'Bioteknologi',
                'slug' => 'bioteknologi',
                'description' => 'Menggabungkan sains hayati, eksperimen, dan penerapan teknologi untuk inovasi riset.',
                'criteria_scores' => [
                    'minat_pribadi' => 84,
                    'kemampuan_analitis' => 88,
                    'prospek_karier' => 82,
                    'kesiapan_akademik' => 88,
                ],
                'behavioral_profile' => ['minat' => 85, 'logika' => 86, 'konsistensi' => 88],
            ],

            // EKONOMI & BISNIS
            [
                'name' => 'Manajemen',
                'slug' => 'manajemen',
                'description' => 'Berfokus pada strategi, kepemimpinan, pemasaran, SDM, dan pengambilan keputusan organisasi.',
                'criteria_scores' => [
                    'minat_pribadi' => 80,
                    'kemampuan_analitis' => 78,
                    'prospek_karier' => 88,
                    'kesiapan_akademik' => 80,
                ],
                'behavioral_profile' => ['minat' => 82, 'logika' => 76, 'konsistensi' => 82],
            ],
            [
                'name' => 'Akuntansi',
                'slug' => 'akuntansi',
                'description' => 'Menekankan ketelitian laporan, pengelolaan data keuangan, dan audit.',
                'criteria_scores' => [
                    'minat_pribadi' => 80,
                    'kemampuan_analitis' => 86,
                    'prospek_karier' => 90,
                    'kesiapan_akademik' => 85,
                ],
                'behavioral_profile' => ['minat' => 78, 'logika' => 85, 'konsistensi' => 95],
            ],
            [
                'name' => 'Ilmu Ekonomi',
                'slug' => 'ilmu-ekonomi',
                'description' => 'Mempelajari makro/mikro ekonomi, moneter, fiskal, dan pembangunan.',
                'criteria_scores' => [
                    'minat_pribadi' => 82,
                    'kemampuan_analitis' => 88,
                    'prospek_karier' => 84,
                    'kesiapan_akademik' => 86,
                ],
                'behavioral_profile' => ['minat' => 82, 'logika' => 88, 'konsistensi' => 82],
            ],
            [
                'name' => 'Bisnis Digital',
                'slug' => 'bisnis-digital',
                'description' => 'Perpaduan antara manajemen bisnis dengan inovasi teknologi informasi (startup, e-commerce).',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 80,
                    'prospek_karier' => 88,
                    'kesiapan_akademik' => 80,
                ],
                'behavioral_profile' => ['minat' => 85, 'logika' => 80, 'konsistensi' => 78],
            ],

            // HUKUM & ILMU SOSIAL & POLITIK
            [
                'name' => 'Ilmu Hukum',
                'slug' => 'ilmu-hukum',
                'description' => 'Berfokus pada tata peradilan, konstitusi, regulasi bisnis, dan penyelesaian sengketa.',
                'criteria_scores' => [
                    'minat_pribadi' => 86,
                    'kemampuan_analitis' => 90, // Legal reasoning
                    'prospek_karier' => 88,
                    'kesiapan_akademik' => 86,
                ],
                'behavioral_profile' => ['minat' => 86, 'logika' => 90, 'konsistensi' => 92],
            ],
            [
                'name' => 'Ilmu Komunikasi',
                'slug' => 'ilmu-komunikasi',
                'description' => 'Mempelajari media, relasi publik (PR), broadcasting, dan interaksi interpersonal manusia.',
                'criteria_scores' => [
                    'minat_pribadi' => 88,
                    'kemampuan_analitis' => 74,
                    'prospek_karier' => 85,
                    'kesiapan_akademik' => 78,
                ],
                'behavioral_profile' => ['minat' => 88, 'logika' => 72, 'konsistensi' => 78],
            ],
            [
                'name' => 'Hubungan Internasional',
                'slug' => 'hubungan-internasional',
                'description' => 'Mengkaji dinamika politik global, diplomasi, hukum intenasional, dan organisasi lintas negara.',
                'criteria_scores' => [
                    'minat_pribadi' => 90,
                    'kemampuan_analitis' => 84,
                    'prospek_karier' => 82,
                    'kesiapan_akademik' => 85,
                ],
                'behavioral_profile' => ['minat' => 90, 'logika' => 82, 'konsistensi' => 82],
            ],
            [
                'name' => 'Ilmu Politik',
                'slug' => 'ilmu-politik',
                'description' => 'Menganalisis sistem pemerintahan, kebijakan negara, dan perilaku institusi politis.',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 82,
                    'prospek_karier' => 78,
                    'kesiapan_akademik' => 82,
                ],
                'behavioral_profile' => ['minat' => 86, 'logika' => 82, 'konsistensi' => 78],
            ],
            [
                'name' => 'Kriminologi',
                'slug' => 'kriminologi',
                'description' => 'Ilmu sosiologi terapan untuk meneliti pola kejahatan, perilaku pelaku, dan sistem peradilan.',
                'criteria_scores' => [
                    'minat_pribadi' => 88,
                    'kemampuan_analitis' => 85,
                    'prospek_karier' => 78,
                    'kesiapan_akademik' => 83,
                ],
                'behavioral_profile' => ['minat' => 88, 'logika' => 85, 'konsistensi' => 80],
            ],
            [
                'name' => 'Sosiologi',
                'slug' => 'sosiologi',
                'description' => 'Mempelajari struktur, pergerakan, dan fenomena di masyarakat secara empiris.',
                'criteria_scores' => [
                    'minat_pribadi' => 82,
                    'kemampuan_analitis' => 80,
                    'prospek_karier' => 76,
                    'kesiapan_akademik' => 80,
                ],
                'behavioral_profile' => ['minat' => 84, 'logika' => 80, 'konsistensi' => 78],
            ],

            // PSIKOLOGI & HUMANIORA
            [
                'name' => 'Psikologi',
                'slug' => 'psikologi',
                'description' => 'Mempelajari perilaku manusia, alat tes, neuropsikologi, riset kognitif dan industri.',
                'criteria_scores' => [
                    'minat_pribadi' => 88,
                    'kemampuan_analitis' => 82,
                    'prospek_karier' => 85,
                    'kesiapan_akademik' => 85,
                ],
                'behavioral_profile' => ['minat' => 88, 'logika' => 80, 'konsistensi' => 84],
            ],
            [
                'name' => 'Sastra Inggris',
                'slug' => 'sastra-inggris',
                'description' => 'Kajian sejarah sastra, linguistik bahasa Inggris, dan cultural studies.',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 78,
                    'prospek_karier' => 82,
                    'kesiapan_akademik' => 80,
                ],
                'behavioral_profile' => ['minat' => 88, 'logika' => 75, 'konsistensi' => 80],
            ],
            [
                'name' => 'Ilmu Sejarah',
                'slug' => 'ilmu-sejarah',
                'description' => 'Kajian runut waktu kejadian masa lalu melalui artefak, arsip, dan literatur.',
                'criteria_scores' => [
                    'minat_pribadi' => 90,
                    'kemampuan_analitis' => 80,
                    'prospek_karier' => 75,
                    'kesiapan_akademik' => 82,
                ],
                'behavioral_profile' => ['minat' => 92, 'logika' => 78, 'konsistensi' => 85],
            ],
            [
                'name' => 'Desain Komunikasi Visual',
                'slug' => 'desain-komunikasi-visual',
                'description' => 'Jalur seni yang menekankan ide visual, desain grafis, animasi, dan pemecahan masalah desain.',
                'criteria_scores' => [
                    'minat_pribadi' => 92,
                    'kemampuan_analitis' => 70,
                    'prospek_karier' => 84,
                    'kesiapan_akademik' => 75,
                ],
                'behavioral_profile' => ['minat' => 95, 'logika' => 70, 'konsistensi' => 80],
            ],

            // PERTANIAN, PETERNAKAN & AGROTEK
            [
                'name' => 'Agribisnis',
                'slug' => 'agribisnis',
                'description' => 'Perpaduan ilmu pertanian dan ekonomi untuk memaksimalkan hasil bisnis komoditas.',
                'criteria_scores' => [
                    'minat_pribadi' => 80,
                    'kemampuan_analitis' => 78,
                    'prospek_karier' => 82,
                    'kesiapan_akademik' => 80,
                ],
                'behavioral_profile' => ['minat' => 80, 'logika' => 78, 'konsistensi' => 82],
            ],
            [
                'name' => 'Agroteknologi',
                'slug' => 'agroteknologi',
                'description' => 'Ilmu budidaya tanaman dan optimasi lahan menggunakan teknologi modern.',
                'criteria_scores' => [
                    'minat_pribadi' => 82,
                    'kemampuan_analitis' => 82,
                    'prospek_karier' => 80,
                    'kesiapan_akademik' => 82,
                ],
                'behavioral_profile' => ['minat' => 82, 'logika' => 80, 'konsistensi' => 82],
            ],
            [
                'name' => 'Ilmu Kehutanan',
                'slug' => 'ilmu-kehutanan',
                'description' => 'Manajemen ekosistem hutan, konservasi alam, dan pengelolaan hasil hutan lestari.',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 80,
                    'prospek_karier' => 78,
                    'kesiapan_akademik' => 80,
                ],
                'behavioral_profile' => ['minat' => 86, 'logika' => 78, 'konsistensi' => 85],
            ],

            // PENDIDIKAN
            [
                'name' => 'Pendidikan Guru Sekolah Dasar',
                'slug' => 'pgsd',
                'description' => 'Mencetak pendidik tingkat dasar, menuntut kesabaran ekstra dan metodologi pengajaran.',
                'criteria_scores' => [
                    'minat_pribadi' => 92,
                    'kemampuan_analitis' => 70,
                    'prospek_karier' => 88,
                    'kesiapan_akademik' => 75,
                ],
                'behavioral_profile' => ['minat' => 95, 'logika' => 70, 'konsistensi' => 90],
            ],
            [
                'name' => 'Pendidikan Bahasa Inggris',
                'slug' => 'pendidikan-bahasa-inggris',
                'description' => 'Berorientasi pada penguasaan linguistik inggris dan pedagogi mengajar.',
                'criteria_scores' => [
                    'minat_pribadi' => 85,
                    'kemampuan_analitis' => 74,
                    'prospek_karier' => 82,
                    'kesiapan_akademik' => 80,
                ],
                'behavioral_profile' => ['minat' => 86, 'logika' => 72, 'konsistensi' => 84],
            ],
            [
                'name' => 'Pendidikan Matematika',
                'slug' => 'pendidikan-matematika',
                'description' => 'Memadukan kemampuan logika matematis tinggi dengan kurikulum keguruan.',
                'criteria_scores' => [
                    'minat_pribadi' => 82,
                    'kemampuan_analitis' => 92,
                    'prospek_karier' => 84,
                    'kesiapan_akademik' => 88,
                ],
                'behavioral_profile' => ['minat' => 82, 'logika' => 92, 'konsistensi' => 86],
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
