<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/create-account', function () {
    return Inertia::render('create-account');
})->name('create-account');

    Route::get('/feed', function () {
        return Inertia::render('feed');
    })->name('feed');


require __DIR__.'/settings.php';
