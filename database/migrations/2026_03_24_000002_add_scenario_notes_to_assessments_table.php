<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->text('scenario_notes')->nullable()->after('label');
            $table->text('decision_rationale')->nullable()->after('scenario_notes');
        });
    }

    public function down(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            $table->dropColumn(['scenario_notes', 'decision_rationale']);
        });
    }
};
