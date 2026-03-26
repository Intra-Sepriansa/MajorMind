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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('dimension')->index(); // e.g. 'C1', 'C2'
            $table->text('content');
            $table->string('correct_answer')->nullable();
            $table->decimal('a_param', 8, 4)->default(1.0); // Discrimination
            $table->decimal('b_param', 8, 4)->default(0.0); // Difficulty (Location)
            $table->decimal('c_param', 8, 4)->default(0.2); // Pseudo-guessing
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
