<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'first_name',
        'surname',
        'email',
        'password',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->surname;
    }

    public function getAvatarUrlAttribute()
    {
        return $this->avatar ? $this->avatar : '/images/default-avatar.jpg';
    }
}