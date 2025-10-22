import { Head } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';

interface User {
    id: number;
    full_name: string;
    first_name: string;
    surname: string;
}

interface Post {
    id: number;
    content: string;
    created_at: string;
    user: User;
    reactions_count: number;
    is_reacted: boolean;
}

export default function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [charCount, setCharCount] = useState(280);

    const getToken = () => localStorage.getItem('auth_token');

    const fetchPosts = useCallback(async () => {
        try {
            const response = await fetch('/api/posts', {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            // Unauthorized, return to login
            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                window.location.href = '/';
                return;
            }

            if (response.ok) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            window.location.href = '/';
            return;
        }
        fetchPosts();
    }, [fetchPosts]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();

            if (response.ok) {
                setContent('');
                setCharCount(280);
                fetchPosts(); // Refresh posts
            } else {
                setError(data.errors?.content?.[0] || 'Failed to post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleReaction = async (postId: number) => {
        try {
            const response = await fetch(`/api/posts/${postId}/reaction`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Update the post in the list
                setPosts(posts.map(post =>
                    post.id === postId
                        ? {
                            ...post,
                            is_reacted: data.is_reacted,
                            reactions_count: data.reactions_count
                        }
                        : post
                ));
            }
        } catch (error) {
            console.error('Error toggling reaction:', error);
        }
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 280) {
            setContent(value);
            setCharCount(280 - value.length);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Accept': 'application/json',
                },
            });
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <>
            <Head title="Feed">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className='min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a]'>

                {/* Navbar */}
                <nav className='bg-white dark:bg-[#1b1b18] dark:border-gray-800 px-[50px] py-4'>
                    <div className='flex items-center justify-between'>

                        {/* Branding Name */}
                        <h1 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            MiniTweet
                        </h1>

                        {/* Profile and Logout */}
                        <div className='flex items-center gap-4'>

                            {/* Profile */}
                            <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0"></div>

                            {/* Logout button */}
                            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer">

                                {/* Logout Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* MiniTweet Feeds */}
                <div className="container mx-auto px-6 py-8 max-w-2xl">

                    {/* Posting Component */}
                    <div className="bg-white dark:bg-[#1b1b18] rounded-xl shadow-sm p-6 mb-6">
                        <form onSubmit={handlePost} className="flex gap-4">

                            {/* Profile Picture */}
                            <div className="w-12 h-12 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0"></div>

                            {/* Post Description */}
                            <div className="flex-1">
                                <textarea
                                    placeholder="What's happening?"
                                    value={content}
                                    onChange={handleContentChange}
                                    rows={3}
                                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none">
                                </textarea>

                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                                {/* Character Count and Post Button */}
                                <div className="flex items-center justify-between mt-3">

                                    {/* Character Count */}
                                    <span className="text-sm text-gray-500">
                                        {charCount} characters remaining
                                    </span>

                                    {/* Tweet Button */}
                                    <button
                                        type="submit"
                                        disabled={loading || !content.trim()}
                                        className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition disabled:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 rotate-45"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>{loading ? 'Posting...' : 'Tweet'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Feed content */}
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No posts yet. Be the first to post!
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="bg-white dark:bg-[#1b1b18] rounded-xl shadow-sm p-6">
                                    <div className="flex gap-4">

                                        {/* Profile Picture */}
                                        <div className="w-12 h-12 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0"></div>

                                        {/* Post Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {post.user.full_name}
                                                </span>
                                            </div>

                                            {/* Time Posted */}
                                            <span className="text-black text-sm block mb-2">{post.created_at}</span>

                                            {/* Post Description */}
                                            <p className="text-gray-800 dark:text-gray-200 mb-3 ml-[-64px]">
                                                {post.content}
                                            </p>

                                            {/* Post Reaction */}
                                            <button
                                                onClick={() => handleReaction(post.id)}
                                                className="ml-[-64px] flex items-center gap-2 text-black dark:text-white hover:text-red-500 transition"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill={post.is_reacted ? "currentColor" : "none"}
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    style={{ color: post.is_reacted ? '#ef4444' : 'currentColor' }}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                    />
                                                </svg>
                                                <span className="text-sm font-bold">{post.reactions_count}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}