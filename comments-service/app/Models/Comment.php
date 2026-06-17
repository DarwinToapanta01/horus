<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'report_id',
        'user_id',
        'user_name',
        'content',
        'parent_id',
    ];
}
