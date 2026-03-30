'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';

interface ShortUrl {
    _id: string;
    longUrl: string;
    shortCode: string;
    expiresAt: string | null;
    accessCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const [urls, setUrls] = useState<ShortUrl[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState({ longUrl: '', shortCode: '' });
    const [isFetching, setIsFetching] = useState(false);
    const [sort, setSort] = useState<'createdAt' | 'accessCount'>('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    useEffect(() => {
        if (user) fetchUrls(1);
    }, [user, sort, order]);

    async function fetchUrls(page: number) {
        setIsFetching(true);
        try {
            const res = await apiFetch(`/urls?page=${page}&limit=10&sort=${sort}&order=${order}`);
            const data = await res.json();
            if (!res.ok) return;
            if (page === 1) {
                setUrls(data.data);
            } else {
                setUrls((prev) => [...prev, ...data.data]);
            }
            setPagination(data.pagination);
        } finally {
            setIsFetching(false);
        }
    }

    function startEdit(url: ShortUrl) {
        setEditingId(url._id);
        setEditValues({ longUrl: url.longUrl, shortCode: url.shortCode });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValues({ longUrl: '', shortCode: '' });
    }

    async function saveEdit(id: string) {
        const res = await apiFetch(`/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ longUrl: editValues.longUrl, shortCode: editValues.shortCode }),
        });
        if (res.ok) {
            setUrls((prev) =>
                prev.map((u) =>
                    u._id === id ? { ...u, longUrl: editValues.longUrl, shortCode: editValues.shortCode } : u
                )
            );
            setEditingId(null);
        }
    }

    async function toggleActive(url: ShortUrl) {
        const res = await apiFetch(`/state/${url._id}`, {
            method: 'PATCH',
            body: JSON.stringify({ isActive: !url.isActive }),
        });
        if (res.ok) {
            setUrls((prev) =>
                prev.map((u) => (u._id === url._id ? { ...u, isActive: !url.isActive } : u))
            );
        }
    }

    if (loading || !user) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header showHomeLink />

            <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="space-y-8">
                    <div className="bg-card border border-border rounded-lg p-8">
                        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                            <button className="px-6 py-2 rounded-lg border border-primary text-primary font-mono">
                                Your URLs
                            </button>
                            <div className="flex items-center gap-2 flex-wrap">
                                <select
                                    value={sort}
                                    onChange={(e) => { setSort(e.target.value as 'createdAt' | 'accessCount'); }}
                                    className="bg-input border border-border rounded-lg px-3 py-2 text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="createdAt">Date created</option>
                                    <option value="accessCount">Access count</option>
                                </select>
                                <button
                                    onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
                                    className="px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-mono text-sm"
                                >
                                    {order === 'desc' ? '↓ Desc' : '↑ Asc'}
                                </button>
                                <Link
                                    href="/"
                                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-mono font-bold"
                                >
                                    + Create New
                                </Link>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Loading skeleton */}
                            {isFetching && urls.length === 0 && (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
                                            <div className="h-8 bg-muted rounded w-full mb-4" />
                                            <div className="h-4 bg-muted rounded w-1/3" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* URL cards */}
                            {urls.map((url, index) => {
                                const isEditing = editingId === url._id;
                                return (
                                    <div
                                        key={url._id}
                                        className="border border-primary rounded-lg p-6 space-y-4 hover:bg-input transition-colors"
                                    >
                                        {/* Top row: number, fields */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-mono font-bold flex-shrink-0">
                                                {index + 1}
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
                                                {/* Long URL */}
                                                <div className="sm:col-span-2">
                                                    <input
                                                        type="text"
                                                        value={isEditing ? editValues.longUrl : url.longUrl}
                                                        readOnly={!isEditing}
                                                        onChange={(e) =>
                                                            setEditValues((v) => ({ ...v, longUrl: e.target.value }))
                                                        }
                                                        className={`w-full bg-input border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none font-mono ${
                                                            isEditing
                                                                ? 'border-primary focus:ring-2 focus:ring-primary'
                                                                : 'border-border'
                                                        }`}
                                                    />
                                                </div>

                                                {/* Short Code */}
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={isEditing ? editValues.shortCode : url.shortCode}
                                                        readOnly={!isEditing}
                                                        onChange={(e) =>
                                                            setEditValues((v) => ({ ...v, shortCode: e.target.value }))
                                                        }
                                                        className={`w-full bg-input border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none font-mono ${
                                                            isEditing
                                                                ? 'border-primary focus:ring-2 focus:ring-primary'
                                                                : 'border-border'
                                                        }`}
                                                    />
                                                </div>

                                                {/* Expires At */}
                                                <div className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-foreground text-sm font-mono flex items-center">
                                                    {url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : 'Never'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom row: status badge + controls */}
                                        <div className="flex items-center justify-between pl-14">
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                                                        url.isActive
                                                            ? 'bg-primary/20 text-primary border border-primary'
                                                            : 'bg-muted text-secondary border border-border'
                                                    }`}
                                                >
                                                    {url.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-xs text-secondary font-mono">
                                                    {url.accessCount} hits · Created{' '}
                                                    {new Date(url.createdAt).toLocaleString()} · Updated{' '}
                                                    {new Date(url.updatedAt).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEdit(url._id)}
                                                            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-mono font-bold hover:opacity-90 transition-opacity"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="px-4 py-1.5 rounded-lg border border-border text-foreground text-sm font-mono hover:bg-muted transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEdit(url)}
                                                            className="px-4 py-1.5 rounded-lg border border-border text-foreground text-sm font-mono hover:bg-muted transition-colors flex items-center gap-1.5"
                                                        >
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L21 6.5z"></path>
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => toggleActive(url)}
                                                            className="px-4 py-1.5 rounded-lg border border-border text-foreground text-sm font-mono hover:bg-muted transition-colors"
                                                        >
                                                            {url.isActive ? 'Disable' : 'Enable'}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty state */}
                            {!isFetching && urls.length === 0 && (
                                <div className="text-center text-secondary font-mono py-12">
                                    <p>You haven{"'"}t created any URLs yet.</p>
                                    <Link href="/" className="text-primary hover:opacity-80 transition-opacity mt-2 inline-block">
                                        Create your first one →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Load More */}
                        {pagination.page < pagination.totalPages && (
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={() => fetchUrls(pagination.page + 1)}
                                    disabled={isFetching}
                                    className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-mono disabled:opacity-50"
                                >
                                    {isFetching ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
