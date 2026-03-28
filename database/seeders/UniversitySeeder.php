<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\University;
use Illuminate\Database\Seeder;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            [
                'name' => 'Universitas Indonesia',
                'slug' => 'universitas-indonesia',
                'short_name' => 'UI',
                'location' => 'Depok, Jawa Barat',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Makara_of_Universitas_Indonesia.svg/500px-Makara_of_Universitas_Indonesia.svg.png',
                'description' => 'Universitas negeri terkemuka dan tertua di Indonesia dengan kampus utama di Depok.',
            ],
            [
                'name' => 'Institut Teknologi Bandung',
                'slug' => 'institut-teknologi-bandung',
                'short_name' => 'ITB',
                'location' => 'Bandung, Jawa Barat',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/a/ab/Logo_ITB.svg/500px-Logo_ITB.svg.png',
                'description' => 'Perguruan tinggi teknik pertama di Indonesia yang berfokus pada sains, teknologi, dan seni.',
            ],
            [
                'name' => 'Universitas Gadjah Mada',
                'slug' => 'universitas-gadjah-mada',
                'short_name' => 'UGM',
                'location' => 'Sleman, DI Yogyakarta',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/a/aa/Logo_Universitas_Gadjah_Mada.svg/500px-Logo_Universitas_Gadjah_Mada.svg.png',
                'description' => 'Universitas kerakyatan dengan program studi terbanyak di Indonesia, berlokasi di Yogyakarta.',
            ],
            [
                'name' => 'Institut Teknologi Sepuluh Nopember',
                'slug' => 'institut-teknologi-sepuluh-nopember',
                'short_name' => 'ITS',
                'location' => 'Surabaya, Jawa Timur',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/7/75/Logo_ITS.svg/500px-Logo_ITS.svg.png',
                'description' => 'Institut teknologi unggulan di wilayah timur Indonesia dengan fokus kuat pada riset maritim dan teknik aplikatif.',
            ],
            [
                'name' => 'Universitas Airlangga',
                'slug' => 'universitas-airlangga',
                'short_name' => 'UNAIR',
                'location' => 'Surabaya, Jawa Timur',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/0/07/Logo_UNAIR.svg/500px-Logo_UNAIR.svg.png',
                'description' => 'Universitas top di Surabaya dengan reputasi kuat di bidang kedokteran, hukum, dan ilmu sosial.',
            ],
            [
                'name' => 'Universitas Brawijaya',
                'slug' => 'universitas-brawijaya',
                'short_name' => 'UB',
                'location' => 'Malang, Jawa Timur',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/2/23/Logo_Universitas_Brawijaya.svg/500px-Logo_Universitas_Brawijaya.svg.png',
                'description' => 'Universitas dengan jumlah mahasiswa terbanyak dan penerimaan SNBT terbesar.',
            ],
            [
                'name' => 'Universitas Padjadjaran',
                'slug' => 'universitas-padjadjaran',
                'short_name' => 'UNPAD',
                'location' => 'Jatinangor, Jawa Barat',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/9/90/Logo_Universitas_Padjadjaran.svg/500px-Logo_Universitas_Padjadjaran.svg.png',
                'description' => 'Kampus idaman di Jawa Barat dengan peminat tertinggi di rumpun Soshum dan Kedokteran.',
            ],
            [
                'name' => 'Universitas Diponegoro',
                'slug' => 'universitas-diponegoro',
                'short_name' => 'UNDIP',
                'location' => 'Semarang, Jawa Tengah',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/1/1a/Logo_Undip_Universitas_Diponegoro.png/500px-Logo_Undip_Universitas_Diponegoro.png',
                'description' => 'Perguruan tinggi terkemuka di pantura Jawa Tengah dengan kualitas lulusan yang sangat diminati dunia kerja.',
            ],
            [
                'name' => 'Universitas Hasanuddin',
                'slug' => 'universitas-hasanuddin',
                'short_name' => 'UNHAS',
                'location' => 'Makassar, Sulawesi Selatan',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/7/7b/Logo_Universitas_Hasanuddin.svg/500px-Logo_Universitas_Hasanuddin.svg.png',
                'description' => 'Pusat keunggulan pendidikan tinggi di Kawasan Timur Indonesia.',
            ],
            [
                'name' => 'Universitas Sebelas Maret',
                'slug' => 'universitas-sebelas-maret',
                'short_name' => 'UNS',
                'location' => 'Surakarta, Jawa Tengah',
                'type' => 'PTN',
                'accreditation' => 'Unggul',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/id/thumb/8/87/Logo_UNS.svg/500px-Logo_UNS.svg.png',
                'description' => 'Kampus hijau yang kental dengan budaya dan seni, serta biaya hidup yang sangat terjangkau.',
            ],
        ];

        // Insert Universities
        foreach ($universities as $univData) {
            University::query()->updateOrCreate(
                ['slug' => $univData['slug']],
                $univData
            );
        }

        /**
         * Mapping Majors to Universities (Realistic SNBT Data Simulation)
         * Data structure:
         * [
         *   'major_slug' => [
         *      'university_slug' => ['capacity' => X, 'acceptance_rate' => Y.Y, 'accreditation' => 'Z', 'ukt_tier' => 'Rp...']
         *   ]
         * ]
         * 
         * Acceptance Rate:
         * < 2.5% : Sangat Ketat (Dream)
         * 2.5% - 5% : Ketat
         * 5% - 10% : Sedang
         * > 10% : Terjangkau (Safety)
         */
        
        $majorMappings = [
            // ==========================================
            // TEKNIK INFORMATIKA / ILMU KOMPUTER (Sangat Ketat)
            // ==========================================
            'teknik-informatika' => [
                'universitas-indonesia' => ['capacity' => 60, 'acceptance_rate' => 1.8, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp17,5jt'], // Fasilkom UI (Ilmu Komputer)
                'institut-teknologi-bandung' => ['capacity' => 85, 'acceptance_rate' => 1.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp0 - Rp12,5jt'], // STEI ITB
                'universitas-gadjah-mada' => ['capacity' => 75, 'acceptance_rate' => 2.1, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp11jt'], // Ilmu Komputer UGM
                'institut-teknologi-sepuluh-nopember' => ['capacity' => 90, 'acceptance_rate' => 3.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp7,5jt'],
                'universitas-brawijaya' => ['capacity' => 120, 'acceptance_rate' => 4.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp9,5jt'],
                'universitas-sebelas-maret' => ['capacity' => 80, 'acceptance_rate' => 5.2, 'accreditation' => 'A', 'ukt_tier' => 'Rp500rb - Rp8jt'],
            ],
            
            // ==========================================
            // KEDOKTERAN UMUM (Paling Ketat)
            // ==========================================
            'kedokteran-umum' => [
                'universitas-indonesia' => ['capacity' => 54, 'acceptance_rate' => 1.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp20jt'],
                'universitas-gadjah-mada' => ['capacity' => 85, 'acceptance_rate' => 1.4, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp22,5jt'],
                'universitas-airlangga' => ['capacity' => 90, 'acceptance_rate' => 1.7, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp25jt'],
                'universitas-padjadjaran' => ['capacity' => 125, 'acceptance_rate' => 2.0, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp24jt'], // Peminat terbanyak se-Indonesia
                'universitas-brawijaya' => ['capacity' => 150, 'acceptance_rate' => 2.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp23jt'],
                'universitas-diponegoro' => ['capacity' => 110, 'acceptance_rate' => 2.8, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp22jt'],
                'universitas-hasanuddin' => ['capacity' => 100, 'acceptance_rate' => 3.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp20jt'],
            ],

            // ==========================================
            // SISTEM INFORMASI
            // ==========================================
            'sistem-informasi' => [
                'universitas-indonesia' => ['capacity' => 60, 'acceptance_rate' => 2.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp17,5jt'],
                'institut-teknologi-sepuluh-nopember' => ['capacity' => 95, 'acceptance_rate' => 3.8, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp7,5jt'],
                'universitas-airlangga' => ['capacity' => 70, 'acceptance_rate' => 4.2, 'accreditation' => 'A', 'ukt_tier' => 'Rp500rb - Rp10jt'],
                'universitas-brawijaya' => ['capacity' => 130, 'acceptance_rate' => 5.5, 'accreditation' => 'A', 'ukt_tier' => 'Rp500rb - Rp9,5jt'],
            ],

            // ==========================================
            // TEKNIK INDUSTRI
            // ==========================================
            'teknik-industri' => [
                'institut-teknologi-bandung' => ['capacity' => 75, 'acceptance_rate' => 1.7, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp0 - Rp12,5jt'], // FTI ITB
                'universitas-indonesia' => ['capacity' => 55, 'acceptance_rate' => 2.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp17,5jt'],
                'universitas-gadjah-mada' => ['capacity' => 65, 'acceptance_rate' => 2.9, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp11jt'],
                'institut-teknologi-sepuluh-nopember' => ['capacity' => 120, 'acceptance_rate' => 3.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp7,5jt'],
                'universitas-diponegoro' => ['capacity' => 100, 'acceptance_rate' => 5.1, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp9jd'],
            ],

            // ==========================================
            // PSIKOLOGI (Soshum Terketat)
            // ==========================================
            'psikologi' => [
                'universitas-indonesia' => ['capacity' => 75, 'acceptance_rate' => 1.9, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp15jt'],
                'universitas-gadjah-mada' => ['capacity' => 90, 'acceptance_rate' => 1.8, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp10jt'],
                'universitas-padjadjaran' => ['capacity' => 105, 'acceptance_rate' => 2.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp9,5jt'],
                'universitas-airlangga' => ['capacity' => 110, 'acceptance_rate' => 3.1, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp10jt'],
                'universitas-diponegoro' => ['capacity' => 120, 'acceptance_rate' => 3.8, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp8jt'],
            ],

            // ==========================================
            // MANAJEMEN
            // ==========================================
            'manajemen' => [
                'universitas-indonesia' => ['capacity' => 60, 'acceptance_rate' => 1.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp18jt'],
                'universitas-gadjah-mada' => ['capacity' => 70, 'acceptance_rate' => 1.6, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp12jt'],
                'universitas-padjadjaran' => ['capacity' => 90, 'acceptance_rate' => 2.4, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp9jt'],
                'universitas-brawijaya' => ['capacity' => 180, 'acceptance_rate' => 3.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp8,5jt'],
                'universitas-sebelas-maret' => ['capacity' => 95, 'acceptance_rate' => 4.0, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp7,5jt'],
            ],

            // ==========================================
            // ILMU HUKUM
            // ==========================================
            'ilmu-hukum' => [
                'universitas-indonesia' => ['capacity' => 120, 'acceptance_rate' => 2.1, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp15jt'],
                'universitas-gadjah-mada' => ['capacity' => 150, 'acceptance_rate' => 2.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp11jt'],
                'universitas-padjadjaran' => ['capacity' => 200, 'acceptance_rate' => 3.0, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp9jt'],
                'universitas-airlangga' => ['capacity' => 135, 'acceptance_rate' => 3.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp10jt'],
                'universitas-brawijaya' => ['capacity' => 250, 'acceptance_rate' => 4.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp8,5jt'],
            ],

            // ==========================================
            // ILMU KOMUNIKASI
            // ==========================================
            'ilmu-komunikasi' => [
                'universitas-indonesia' => ['capacity' => 50, 'acceptance_rate' => 1.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp15jt'], // Sangat ketat UI
                'universitas-gadjah-mada' => ['capacity' => 40, 'acceptance_rate' => 1.1, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp10jt'], // Sangat ketat UGM
                'universitas-padjadjaran' => ['capacity' => 60, 'acceptance_rate' => 1.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp9jt'], // Fikom Unpad (Legendaris)
                'universitas-brawijaya' => ['capacity' => 100, 'acceptance_rate' => 3.8, 'accreditation' => 'A', 'ukt_tier' => 'Rp500rb - Rp8,5jt'],
            ],

            // ==========================================
            // ARSITEKTUR
            // ==========================================
            'arsitektur' => [
                'institut-teknologi-bandung' => ['capacity' => 65, 'acceptance_rate' => 2.0, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp0 - Rp12,5jt'], // SAPPK ITB
                'universitas-indonesia' => ['capacity' => 45, 'acceptance_rate' => 2.8, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp17,5jt'],
                'universitas-gadjah-mada' => ['capacity' => 55, 'acceptance_rate' => 3.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp11jt'],
                'institut-teknologi-sepuluh-nopember' => ['capacity' => 70, 'acceptance_rate' => 4.2, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp7,5jt'],
            ],
            
            // ==========================================
            // AKUNTANSI
            // ==========================================
            'akuntansi' => [
                'universitas-indonesia' => ['capacity' => 65, 'acceptance_rate' => 1.8, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp18jt'],
                'universitas-gadjah-mada' => ['capacity' => 75, 'acceptance_rate' => 2.0, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp12jt'],
                'universitas-brawijaya' => ['capacity' => 150, 'acceptance_rate' => 4.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp500rb - Rp8,5jt'],
            ],
            
            // ==========================================
            // DESAIN KOMUNIKASI VISUAL (DKV)
            // ==========================================
            'desain-komunikasi-visual' => [
                'institut-teknologi-bandung' => ['capacity' => 80, 'acceptance_rate' => 1.5, 'accreditation' => 'Unggul', 'ukt_tier' => 'Rp0 - Rp12,5jt'], // FSRD ITB
                'universitas-sebelas-maret' => ['capacity' => 65, 'acceptance_rate' => 4.2, 'accreditation' => 'A', 'ukt_tier' => 'Rp500rb - Rp8jt'],
                'institut-teknologi-sepuluh-nopember' => ['capacity' => 50, 'acceptance_rate' => 3.8, 'accreditation' => 'A', 'ukt_tier' => 'Rp500rb - Rp7,5jt'],
            ],
        ];

        // Process mapping
        foreach ($majorMappings as $majorSlug => $univMappings) {
            $major = Major::where('slug', $majorSlug)->first();
            
            if (!$major) {
                continue; // Skip if major doesn't exist yet
            }

            foreach ($univMappings as $univSlug => $stats) {
                $university = University::where('slug', $univSlug)->first();
                
                if ($university) {
                    $major->universities()->syncWithoutDetaching([
                        $university->id => [
                            'capacity' => $stats['capacity'],
                            'acceptance_rate' => $stats['acceptance_rate'],
                            'applicants' => (int) round($stats['capacity'] / ($stats['acceptance_rate'] / 100)), // Reverse engineer applicants
                            'accreditation' => $stats['accreditation'],
                            'ukt_tier' => $stats['ukt_tier'],
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    ]);
                }
            }
        }
    }
}
