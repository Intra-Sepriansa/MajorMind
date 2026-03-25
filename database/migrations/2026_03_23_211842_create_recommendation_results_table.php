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
        Schema::create('recommendation_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('major_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('rank');
            $table->decimal('topsis_score', 10, 6);
            $table->decimal('behavioral_score', 10, 6);
            $table->decimal('final_score', 10, 6);
            $table->decimal('distance_positive', 10, 6);
            $table->decimal('distance_negative', 10, 6);
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendation_results');
    }
};
