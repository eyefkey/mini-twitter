import { Head } from '@inertiajs/react';
import { useState, FormEvent } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to feed
                window.location.href = '/feed';
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert(data.message || 'Login failed');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a] p-6">
                <div className="w-full max-w-md p-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-2 rounded-[10px] px-2 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Welcome to MiniTweet
                    </h2>
                    <span className="text-center text-black mb-6">
                        Connect with friends in 20 characters or less
                    </span>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-200 dark:bg-gray-700 rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.email[0]}</span>
                            )}
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-gray-200 dark:bg-gray-700 rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.password[0]}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-2 rounded-[20px] font-semibold hover:bg-gray-800 transition mt-6 disabled:opacity-50"
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    {canRegister && (
                        <a href="/create-account" className="mt-4 w-full bg-white text-black py-2 rounded-[20px] font-semibold border border-black hover:bg-gray-100 transition block text-center">
                            Create Account
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}