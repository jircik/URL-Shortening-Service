'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuth } from '@/hooks/useAuth';

interface CreatedUrl {
    shortUrl: {
        shortCode: string;
        expiresAt: string | null;
    };
    newUrl: string;
}

export default function ResultPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [data, setData] = useState<CreatedUrl | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem('lastCreated');
        if (!stored) {
            router.replace('/');
            return;
        }
        setData(JSON.parse(stored));
    }, [router]);

    function formatExpiry(expiresAt: string | null): string {
        if (!expiresAt) return 'Never expires';
        const diff = new Date(expiresAt).getTime() - Date.now();
        if (diff <= 0) return 'Expired';
        const hours = Math.ceil(diff / (1000 * 60 * 60));
        if (hours < 48) return `Expires in ${hours} hour${hours === 1 ? '' : 's'}`;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return `Expires in ${days} days`;
    }

    const handleCopy = () => {
        if (!data) return;
        navigator.clipboard.writeText(data.newUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!data) return null;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="space-y-8">
                    <div className="bg-card border border-border rounded-lg p-8 sm:p-12 space-y-8 max-w-2xl mx-auto">

                        {/* Title */}
                        <div className="text-center">
                            <div className="inline-block px-4 py-2 rounded-lg border border-primary text-primary font-mono">
                                Here is your short URL!
                            </div>
                        </div>

                        {/* Short URL display */}
                        <div className="flex items-center gap-3 bg-input border border-primary rounded-lg p-6">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex-1 text-primary font-mono text-center hover:opacity-80 transition-opacity truncate"
                            >
                                {data.newUrl}
                            </button>
                            <button
                                onClick={handleCopy}
                                className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
                            >
                                {copied ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Expiry */}
                        <div className="text-center text-secondary font-mono text-sm">
                            {formatExpiry(data.shortUrl.expiresAt)}
                        </div>

                        {/* Info box — logged-out only */}
                        {!user && (
                            <div className="bg-muted rounded-lg p-6 text-center text-secondary text-sm font-mono">
                                <p>Links created without being connected to an account expire in 24 hours.</p>
                                <p className="mt-2">To customize the status and view statistics such as Access Count for your URL</p>
                                <Link href="/login" className="text-primary hover:opacity-80 transition-opacity">[log in or register]</Link>
                            </div>
                        )}

                        {/* Create Another */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-mono"
                            >
                                Create Another
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
