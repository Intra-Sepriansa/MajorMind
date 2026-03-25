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
        Schema::create('saved_scenarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assessment_id')->constrained()->cascadeOnDelete();
            $table->string('scenario_name');
            $table->text('scenario_description')->nullable();
            $table->json('adjustments')->nullable();
            $table->json('recommendations')->nullable();
            $table->json('stability_metrics')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->json('tags')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'assessment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_scenarios');
    }
};
