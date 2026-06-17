<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            // Sin FKs cruzadas: report y user viven en otras BDs
            $table->unsignedBigInteger('report_id');
            $table->unsignedBigInteger('user_id');
            $table->boolean('type'); // true = confirmar, false = rechazar
            $table->timestamps();

            $table->unique(['report_id', 'user_id']); // un voto por usuario por reporte
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
