<?php

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can create a post', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/posts', [
            'content' => 'This is a test tweet!',
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'post' => ['id', 'content', 'user', 'created_at'],
        ]);

    $this->assertDatabaseHas('posts', [
        'content' => 'This is a test tweet!',
        'user_id' => $user->id,
    ]);
});

test('post cannot exceed 280 characters', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/posts', [
            'content' => str_repeat('a', 281),
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['content']);
});

test('unauthenticated user cannot create a post', function () {
    $response = $this->postJson('/api/posts', [
        'content' => 'This should fail',
    ]);

    $response->assertStatus(401);
});

test('user can view all posts', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    Post::factory()->count(3)->create();

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->getJson('/api/posts');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'posts')
        ->assertJsonStructure([
            'posts' => [
                '*' => ['id', 'content', 'user', 'reactions_count', 'is_reacted', 'created_at']
            ]
        ]);
});