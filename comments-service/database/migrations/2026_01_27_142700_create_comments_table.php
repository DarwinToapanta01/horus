<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            // Sin FKs cruzadas: report y user viven en otras BDs
            $table->unsignedBigInteger('report_id');
            $table->unsignedBigInteger('user_id');
            $table->string('user_name')->default('Usuario'); // desnormalizado desde auth-service
            $table->unsignedBigInteger('parent_id')->nullable(); // para respuestas anidadas
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
