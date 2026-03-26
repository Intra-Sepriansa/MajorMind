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
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('theta_c1', 8, 4)->nullable()->after('password');
            $table->decimal('theta_c2', 8, 4)->nullable()->after('theta_c1');
            $table->decimal('theta_c3', 8, 4)->nullable()->after('theta_c2');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['theta_c1', 'theta_c2', 'theta_c3']);
        });
    }
};
