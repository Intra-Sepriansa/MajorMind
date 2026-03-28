<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('university_majors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained()->cascadeOnDelete();
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();

            $table->string('accreditation')->nullable(); // Unggul, A, B, dll
            
            // SNBT / Real data stats
            $table->integer('capacity')->nullable(); // Daya tampung tahun lalu
            $table->integer('applicants')->nullable(); // Peminat tahun lalu
            $table->decimal('acceptance_rate', 5, 2)->nullable(); // Persentase ketetatan (e.g. 2.5)
            
            // Biaya
            $table->string('ukt_tier')->nullable(); // e.g. "Rp500rb - Rp20jt"

            $table->timestamps();

            $table->unique(['university_id', 'major_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('university_majors');
    }
};
