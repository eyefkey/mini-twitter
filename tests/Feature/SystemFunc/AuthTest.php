<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can register with valid data', function () {
    $response = $this->postJson('/api/register', [
        'first_name' => 'John',
        'surname' => 'Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'user' => ['id', 'first_name', 'surname', 'email'],
            'token'
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'first_name' => 'John',
        'surname' => 'Doe',
    ]);
});

test('user cannot register with invalid email', function () {
    $response = $this->postJson('/api/register', [
        'first_name' => 'John',
        'surname' => 'Doe',
        'email' => 'invalid-email',
        'password' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'user' => ['id', 'first_name', 'surname', 'email'],
            'token'
        ]);
});

test('user cannot login with invalid credentials', function () {
    $user = User::factory()->create([
        'email' => 'john@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'john@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
        ->assertJson(['message' => 'Invalid credentials']);
});

test('authenticated user can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/logout');

    $response->assertStatus(200);
    $this->assertDatabaseMissing('personal_access_tokens', [
        'tokenable_id' => $user->id,
    ]);
});