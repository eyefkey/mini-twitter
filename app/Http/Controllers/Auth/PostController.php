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
            // Check if post exists
            $post = Post::find($postId);
            
            if (!$post) {
                Log::warning('Reaction attempt on non-existent post', ['post_id' => $postId]);
                return response()->json([
                    'success' => false,
                    'message' => 'Post not found'
                ], 404);
            }

            $user = $request->user();
            
            // Check if user already reacted
            $reaction = Reaction::where('user_id', $user->id)
                ->where('post_id', $postId)
                ->first();

            if ($reaction) {
                // Unlike - remove reaction
                $reaction->delete();
                
                Log::info('Reaction removed', [
                    'user_id' => $user->id,
                    'post_id' => $postId
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Reaction removed',
                    'reactions_count' => $post->reactions()->count(),
                    'is_reacted' => false
                ], 200);
            } else {
                // Like - add reaction
                Reaction::create([
                    'user_id' => $user->id,
                    'post_id' => $postId,
                ]);
                
                Log::info('Reaction added', [
                    'user_id' => $user->id,
                    'post_id' => $postId
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Reaction added',
                    'reactions_count' => $post->reactions()->count(),
                    'is_reacted' => true
                ], 200);
            }
        } catch (\Exception $e) {
            Log::error('Reaction toggle failed', [
                'error' => $e->getMessage(),
                'post_id' => $postId
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle reaction'
            ], 500);
        }
    }
}
