<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wheel_options', function (Blueprint $table) {
            $table->id();
            $table->string('text', 100);
            $table->string('color', 20)->default('#6c757d');
            $table->boolean('is_win')->default(false);
            $table->unsignedSmallInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wheel_options');
    }
};
