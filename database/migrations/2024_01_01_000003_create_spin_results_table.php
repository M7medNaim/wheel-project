<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spin_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained()->cascadeOnDelete();
            $table->string('phone', 20);
            $table->unsignedSmallInteger('result_index');
            $table->string('result_text', 100);
            $table->boolean('is_win');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spin_results');
    }
};
