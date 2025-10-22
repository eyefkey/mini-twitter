<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Reaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    // Create a new post
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => ['required', 'string', 'max:280'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $post = Post::create([
                'user_id' => $request->user()->id,
                'content' => $request->content,
            ]);

            $post->load(['user', 'reactions']);

            Log::info('Post created', ['post_id' => $post->id, 'user_id' => $request->user()->id]);

            return response()->json([
                'success' => true,
                'message' => 'Post created successfully',
                'post' => $post
            ], 201);
        } catch (\Exception $e) {
            Log::error('Post creation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create post'
            ], 500);
        }
    }

    // Get all posts (sorted by most recent)
    public function index(Request $request)
    {
        try {
            $posts = Post::with(['user', 'reactions'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($post) use ($request) {
                    return [
                        'id' => $post->id,
                        'content' => $post->content,
                        'created_at' => $post->created_at->diffForHumans(),
                        'user' => [
                            'id' => $post->user->id,
                            'full_name' => $post->user->full_name,
                            'first_name' => $post->user->first_name,
                            'surname' => $post->user->surname,
                            'avatar' => $post->user->avatar ?? '/images/default-avatar.png',
                        ],
                        'reactions_count' => $post->reactions->count(),
                        'is_reacted' => $request->user() ? $post->isReactedBy($request->user()->id) : false,
                    ];
                });

            return response()->json([
                'success' => true,
                'posts' => $posts
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch posts', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch posts'
            ], 500);
        }
    }

    // Toggle reaction (like/unlike)
    public function toggleReaction(Request $request, $postId)
    {
        try {
            $post = Post::findOrFail($postId);
            $userId = $request->user()->id;

            $reaction = Reaction::where('user_id', $userId)
                ->where('post_id', $postId)
                ->first();

            if ($reaction) {
                // Unlike
                $reaction->delete();
                $message = 'Reaction removed';
                $isReacted = false;
            } else {
                // Like
                Reaction::create([
                    'user_id' => $userId,
                    'post_id' => $postId,
                ]);
                $message = 'Reaction added';
                $isReacted = true;
            }

            $reactionsCount = $post->reactions()->count();

            Log::info('Reaction toggled', [
                'post_id' => $postId,
                'user_id' => $userId,
                'action' => $isReacted ? 'liked' : 'unliked'
            ]);

            return response()->json([
                'success' => true,
                'message' => $message,
                'is_reacted' => $isReacted,
                'reactions_count' => $reactionsCount
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to toggle reaction', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle reaction'
            ], 500);
        }
    }
}
