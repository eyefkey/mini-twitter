<?php

use App\Models\User;
use App\Models\Post;
use App\Models\Reaction;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can like a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson("/api/posts/{$post->id}/reaction");

    $response->assertStatus(200)
        ->assertJson(['message' => 'Reaction added']);

    $this->assertDatabaseHas('reactions', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
});

test('user can unlike a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    // First like
    Reaction::create([
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);

    // Then unlike
    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson("/api/posts/{$post->id}/reaction");

    $response->assertStatus(200)
        ->assertJson(['message' => 'Reaction removed']);

    $this->assertDatabaseMissing('reactions', [
        'user_id' => $user->id,
        'post_id' => $post->id,
    ]);
});

test('user cannot react to non-existent post', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson("/api/posts/99999/reaction");

    $response->assertStatus(404);
});