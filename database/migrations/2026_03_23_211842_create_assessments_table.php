<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('student_name')->nullable();
            $table->json('criterion_order');
            $table->json('pairwise_matrix');
            $table->json('criterion_weights');
            $table->decimal('consistency_ratio', 8, 4);
            $table->json('behavioral_profile');
            $table->foreignId('top_major_id')->nullable()->constrained('majors')->nullOnDelete();
            $table->json('summary')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
