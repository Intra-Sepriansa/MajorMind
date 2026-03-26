<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            // C1_Logika (Kemampuan Analitis & Penalaran Abstrak)
            [
                'dimension' => 'C1_Logika',
                'content' => 'Jika semua kura-kura adalah reptil, dan sebagian reptil adalah hewan pemakan daging. Manakah kesimpulan yang tepat?',
                'correct_answer' => 'Tidak dapat disimpulkan bahwa kura-kura pemakan daging.',
                'a_param' => 1.20,
                'b_param' => 0.50, // Medium
                'c_param' => 0.25,
            ],
            [
                'dimension' => 'C1_Logika',
                'content' => 'Lengkapilah deret angka berikut: 2, 6, 12, 20, 30, ...',
                'correct_answer' => '42',
                'a_param' => 0.80,
                'b_param' => -1.20, // Sangat Mudah
                'c_param' => 0.10,
            ],
            [
                'dimension' => 'C1_Logika',
                'content' => 'Dalam sebuah ruangan tertutup rapat, suhu naik 2 kali lipat setiap 10 menit. Jika pada awal menit suhu adalah 10 derajat, pada menit ke berapa suhu mencapai 80 derajat?',
                'correct_answer' => '30',
                'a_param' => 1.50,
                'b_param' => 1.80, // Sulit
                'c_param' => 0.15,
            ],
            [
                'dimension' => 'C1_Logika',
                'content' => 'Budi lebih tinggi dari Andi. Cika lebih tinggi dari Budi. Doni lebih pendek dari Andi. Siapa yang paling tinggi?',
                'correct_answer' => 'Cika',
                'a_param' => 1.00,
                'b_param' => -0.50, // Mudah
                'c_param' => 0.20,
            ],
            [
                'dimension' => 'C1_Logika',
                'content' => 'Sebuah bola dijatuhkan dari ketinggian 10 meter. Setiap kali memantul, bola tersebut mencapai setengah dari ketinggian sebelumnya. Berapa total jarak lintasan bola sampai benar-benar berhenti memantul?',
                'correct_answer' => '30 meter',
                'a_param' => 1.80,
                'b_param' => 2.50, // Sangat Sulit
                'c_param' => 0.20,
            ],

            // C2_Empati (Kecerdasan Emosi & Situational Judgment)
            [
                'dimension' => 'C2_Empati',
                'content' => 'Teman satu kelompok Anda tidak mengerjakan tugas karena harus merawat orang tuanya yang sakit parah. Apa yang Anda lakukan?',
                'correct_answer' => 'Menawarkan bantuan untuk membackup porsinya sambil melaporkan ke dosen agar mendapatkan kebijaksanaan.',
                'a_param' => 1.10,
                'b_param' => -1.00, // Mudah
                'c_param' => 0.33,
            ],
            [
                'dimension' => 'C2_Empati',
                'content' => 'Anda menjadi manajer proyek, namun salah satu staf terus-menerus melakukan kesalahan kecil yang menghambat tim. Apa respons terbaik?',
                'correct_answer' => 'Mengajaknya berdiskusi secara privat untuk mengetahui akar permasalahannya dan menawarkan pelatihan tambahan.',
                'a_param' => 1.40,
                'b_param' => 0.80, // Medium-Sulit
                'c_param' => 0.25,
            ],
            [
                'dimension' => 'C2_Empati',
                'content' => 'Seseorang yang baru Anda kenal membuat lelucon yang sedikit offensif, namun seluruh ruangan tertawa. Apa reaksi Anda?',
                'correct_answer' => 'Tersenyum formal saja tanpa ikut tertawa berlebihan, dan mengalihkan pembicaraan sesudahnya.',
                'a_param' => 1.00,
                'b_param' => 1.20, // Sulit
                'c_param' => 0.20,
            ],
            [
                'dimension' => 'C2_Empati',
                'content' => 'Klien Anda marah besar via telepon atas kesalahan yang sebenarnya dilakukan oleh pihak ketiga (vendor pengiriman). Apa yang Anda lakukan?',
                'correct_answer' => 'Mendengarkan hingga klien tenang, meminta maaf atas ketidaknyamanan, dan segera berkoordinasi dengan vendor untuk diselesaikan.',
                'a_param' => 1.60,
                'b_param' => 1.50, // Sangat Sulit
                'c_param' => 0.20,
            ],
            [
                'dimension' => 'C2_Empati',
                'content' => 'Sahabat Anda gagal memenangkan promosi pekerjaan, sementara Anda mendapatkannya. Bagaimana Anda menyampaikan kabar baik Anda ke dia?',
                'correct_answer' => 'Menahan euforia, memberi ruang padanya untuk memproses kekecewaan, lalu menawarkan dukungan emosional sebelum membicarakan promosi Anda.',
                'a_param' => 1.20,
                'b_param' => 0.40, // Medium
                'c_param' => 0.25,
            ]
        ];

        \Illuminate\Support\Facades\DB::table('questions')->insert($questions);
    }
}
