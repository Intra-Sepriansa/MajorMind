<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->string('mode')->default('primary')->after('student_name');
            $table->string('label')->nullable()->after('mode');
            $table->foreignId('parent_assessment_id')
                ->nullable()
                ->after('user_id')
                ->constrained('assessments')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_assessment_id');
            $table->dropColumn(['mode', 'label']);
        });
    }
};
