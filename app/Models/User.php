<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class User extends Authenticatable implements AuthenticatableContract
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username', 'email', 'password', 'image'
    ];
}


