import { Head } from '@inertiajs/react';
import { useState, FormEvent } from 'react';

export default function TwoFactorChallenge() {
    const [code, setCode] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [showRecovery, setShowRecovery] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/two-factor-challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    showRecovery ? { recovery_code: recoveryCode } : { code }
                ),
            });

            if (response.ok) {
                window.location.href = '/feed';
            } else {
                const data = await response.json();
                setError(data.message || 'Authentication failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Two-Factor Authentication" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {showRecovery ? 'Recovery Code' : 'Authentication Code'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {showRecovery
                                ? 'Enter one of your emergency recovery codes'
                                : 'Enter the code from your authenticator app'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {showRecovery ? (
                            <div>
                                <input
                                    type="text"
                                    value={recoveryCode}
                                    onChange={(e) => setRecoveryCode(e.target.value)}
                                    placeholder="Enter recovery code"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Continue'}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowRecovery(!showRecovery);
                                    setError('');
                                    setCode('');
                                    setRecoveryCode('');
                                }}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                {showRecovery
                                    ? 'Use authentication code instead'
                                    : 'Use recovery code instead'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}