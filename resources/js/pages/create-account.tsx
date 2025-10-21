import { Head } from '@inertiajs/react';
import { useState, FormEvent } from 'react';

export default function CreateAccount() {
    const [formData, setFormData] = useState({
        first_name: '',
        surname: '',
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
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Successfully registered
                alert('Account created successfully! Please log in.');
                window.location.href = '/';
            } else {
                // Handle validation errors
                setErrors(data.errors || {});
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
    }

    return (
        <>
            <Head title="Create Account">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a] p-6">
                <div className="w-full max-w-md p-8 flex flex-col items-center">

                    {/* Header */}
                    <h2 className="text-2xl font-bold mb-2 rounded-[10px] px-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Sign up with Email
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6">

                        {/* First Name and Surname */}
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="First Name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" />

                                {errors.first_name && (
                                    <span className="text-red-500 text-xs mt-1 block">{errors.first_name[0]}</span>
                                )}
                            </div>

                            <div className="w-1/2">
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder="Surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className="w-full bg-gray-200 dark:bg-gray-700 rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {errors.surname && (
                                    <span className="text-red-500 text-xs mt-1 block">{errors.surname[0]}</span>
                                )}
                            </div>
                        </div>

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
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Terms & Conditions */}
                    <span className="text-center text-gray-500 text-sm mt-4">
                        By signing up, you agree to our Terms & Conditions.
                    </span>

                    {/* Log In Link */}
                    <span className="text-center text-gray-700 dark:text-gray-300 text-sm mt-6">
                        Have an account already?{" "}
                        <a href="/" className="text-black dark:text-white hover:underline">
                            Log In
                        </a>
                    </span>
                </div>
            </div>
        </>
    );
}