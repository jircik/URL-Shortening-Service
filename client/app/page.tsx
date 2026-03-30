'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const [longUrl, setLongUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [duration, setDuration] = useState<string>('24');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async () => {
        setError('');
        setIsSubmitting(true);
        try {
            const body: Record<string, unknown> = { longUrl };
            if (customCode) body.shortCode = customCode;
            if (user) body.duration = duration === 'null' ? null : Number(duration);

            const res = await apiFetch('/shorten', {
                method: 'POST',
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Something went wrong.');
                return;
            }

            sessionStorage.setItem('lastCreated', JSON.stringify(data));
            router.push('/result');
        } catch {
            setError('Network error. Is the backend running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header isLoggedIn={!!user} />

            <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="space-y-8">
                    <div className="bg-card border border-border rounded-lg p-8 sm:p-12 space-y-8 max-w-2xl mx-auto">

                        {/* Shorten your URL label */}
                        <div className="text-center">
                            <button className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-mono">
                                Shorten your URL
                            </button>
                        </div>

                        {/* URL Input */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="https://yourlongurl.com..."
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                            />
                        </div>

                        {/* Custom Shortcode and Expiry */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="7" y1="17" x2="17" y2="7"></line>
                                        <polyline points="7 7 7 17 17 17"></polyline>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Custom Shortcode..."
                                    value={customCode}
                                    onChange={(e) => setCustomCode(e.target.value)}
                                    className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                                {!loading && user ? (
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="1">1 hour</option>
                                        <option value="24">24 hours</option>
                                        <option value="168">7 days</option>
                                        <option value="720">30 days</option>
                                        <option value="null">Never</option>
                                    </select>
                                ) : (
                                    <div className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm opacity-60">
                                        24h (fixed)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CREATE Button */}
                        <div className="flex flex-col items-center gap-3">
                            <button
                                onClick={handleCreate}
                                disabled={isSubmitting || !longUrl}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-mono font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'CREATE'}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                            {error && (
                                <p className="text-red-500 font-mono text-sm text-center">{error}</p>
                            )}
                        </div>

                        {/* Info Box — logged-out only */}
                        {!user && (
                            <div className="bg-muted rounded-lg p-6 text-center text-secondary text-sm font-mono">
                                <p>Links created without being connected to an account expire in 24 hours.</p>
                                <p className="mt-2">To customize the status and view statistics such as Access Count for your URL</p>
                                <Link href="/login" className="text-primary hover:opacity-80 transition-opacity">[log in or register]</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
