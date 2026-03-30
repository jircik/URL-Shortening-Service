'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
    hideNav?: boolean;
    showHomeLink?: boolean;
}

export function Header({ hideNav = false, showHomeLink = false }: HeaderProps) {
    const router = useRouter();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        router.push('/');
    }

    return (
        <header className="border-b border-border bg-card">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <svg width="36" height="12" viewBox="0 0 146 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path d="M23.6558 44.3115C35.0636 44.3115 44.3115 35.0636 44.3115 23.6558C44.3115 12.2479 35.0636 3 23.6558 3C12.2479 3 3 12.2479 3 23.6558C3 35.0636 12.2479 44.3115 23.6558 44.3115Z" stroke="#888888" strokeWidth="6"/>
                        <path d="M23.6561 35.1312C29.9938 35.1312 35.1315 29.9934 35.1315 23.6557C35.1315 17.318 29.9938 12.1803 23.6561 12.1803C17.3184 12.1803 12.1807 17.318 12.1807 23.6557C12.1807 29.9934 17.3184 35.1312 23.6561 35.1312Z" fill="#888888"/>
                        <path d="M122.344 44.3115C133.752 44.3115 143 35.0636 143 23.6558C143 12.2479 133.752 3 122.344 3C110.936 3 101.688 12.2479 101.688 23.6558C101.688 35.0636 110.936 44.3115 122.344 44.3115Z" stroke="#03FC90" strokeWidth="6"/>
                        <path d="M122.345 35.1312C128.682 35.1312 133.82 29.9934 133.82 23.6557C133.82 17.318 128.682 12.1803 122.345 12.1803C116.007 12.1803 110.869 17.318 110.869 23.6557C110.869 29.9934 116.007 35.1312 122.345 35.1312Z" fill="#03FC90"/>
                        <path d="M62.6722 21.3606H51.1968V25.9508H62.6722V21.3606Z" fill="#888888"/>
                        <path d="M78.7376 21.3606H67.2622V25.9508H78.7376V21.3606Z" fill="#888888"/>
                        <path d="M94.8033 21.3606H83.3279V25.9508H94.8033V21.3606Z" fill="#888888"/>
                    </svg>
                    <div className="font-mono text-lg font-bold">
                        <span className="text-foreground">url</span>
                        <span className="text-primary"> .jircik</span>
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    {!hideNav && !!user ? (
                        <>
                            <span className="text-secondary font-mono text-sm hidden sm:block">
                                {user.email}
                            </span>
                            {showHomeLink ? (
                                <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-mono text-sm">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    Home
                                </Link>
                            ) : (
                                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-mono text-sm">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Manage your URLs
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-mono text-sm"
                            >
                                Log out
                            </button>
                        </>
                    ) : !hideNav ? (
                        <Link href="/login" className="px-4 py-2 rounded-lg border border-border text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                            Log-in or Sign Up
                        </Link>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
