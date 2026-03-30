'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const router = useRouter();
    const { login, register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
            router.push('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header hideNav />

            <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 w-full flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-primary rounded-lg p-8 space-y-6">

                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center gap-3">
                                <svg width="32" height="32" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="8" cy="12" r="6" fill="none" stroke="#888888" strokeWidth="2"/>
                                    <circle cx="32" cy="12" r="6" fill="none" stroke="#03fc90" strokeWidth="2"/>
                                    <line x1="14" y1="12" x2="26" y2="12" stroke="#888888" strokeWidth="2" strokeDasharray="2,2"/>
                                </svg>
                                <div className="font-mono text-lg font-bold">
                                    <span className="text-foreground">url</span>
                                    <span className="text-primary"> .jircik</span>
                                </div>
                            </div>
                        </div>

                        {/* Tab Switch */}
                        <div className="flex justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => { setIsLogin(true); setError(''); }}
                                className={`px-4 py-2 rounded-lg border font-mono transition-colors ${
                                    isLogin
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border text-foreground'
                                }`}
                            >
                                Log in
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsLogin(false); setError(''); }}
                                className={`px-4 py-2 rounded-lg border font-mono transition-colors ${
                                    !isLogin
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border text-foreground'
                                }`}
                            >
                                Register
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                        <path d="m22 7-10 5L2 7"></path>
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-mono font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Please wait...' : 'ACCESS'}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Error message */}
                        {error && (
                            <p className="text-red-500 font-mono text-sm text-center">{error}</p>
                        )}
                    </div>

                    {/* Link to Home */}
                    <div className="text-center mt-8">
                        <Link href="/" className="text-primary opacity-80 hover:opacity-100 transition-opacity font-mono text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
