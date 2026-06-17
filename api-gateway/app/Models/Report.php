<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    // Aquí autorizamos las columnas para que Laravel permita el guardado
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'radius',
        'danger_level',
        'description',
        'status',
    ];

    /**
     * Relación: Un reporte pertenece a un usuario
     */
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
