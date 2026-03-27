'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface URL {
  id: number;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [urls, setUrls] = useState<URL[]>([]);
  const [email, setEmail] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ longUrl: '', shortCode: '' });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(user);
    setEmail(userData.email);
    setIsLoggedIn(true);

    // Mock data
    setUrls([
      {
        id: 1,
        longUrl: 'https://example.com/very/long/url/path',
        shortCode: 'abc123',
        expiresAt: '2026-04-26T10:00:00Z',
        accessCount: 42,
        isActive: true,
        createdAt: '2026-03-26T10:00:00Z',
        updatedAt: '2026-03-26T10:00:00Z',
      },
      {
        id: 2,
        longUrl: 'https://another-example.com/another/long/path',
        shortCode: 'def456',
        expiresAt: '2026-05-26T10:00:00Z',
        accessCount: 156,
        isActive: false,
        createdAt: '2026-03-20T10:00:00Z',
        updatedAt: '2026-03-25T10:00:00Z',
      },
    ]);
  }, [router]);

  function startEdit(url: URL) {
    setEditingId(url.id);
    setEditValues({ longUrl: url.longUrl, shortCode: url.shortCode });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({ longUrl: '', shortCode: '' });
  }

  function saveEdit(id: number) {
    // Will call PUT /update/:id in 4.7
    setUrls((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, longUrl: editValues.longUrl, shortCode: editValues.shortCode } : u
      )
    );
    setEditingId(null);
  }

  function toggleActive(id: number) {
    // Will call PATCH /state/:id in 4.7
    setUrls((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={true} />

      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <button className="px-6 py-2 rounded-lg border border-primary text-primary font-mono">
                Your URLs
              </button>
              <Link
                href="/"
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-mono font-bold"
              >
                + Create New
              </Link>
            </div>

            <div className="space-y-4">
              {urls.map((url, index) => {
                const isEditing = editingId === url.id;
                return (
                  <div
                    key={url.id}
                    className="border border-primary rounded-lg p-6 space-y-4 hover:bg-input transition-colors"
                  >
                    {/* Top row: number, fields, action buttons */}
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
                              onClick={() => saveEdit(url.id)}
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
                              onClick={() => toggleActive(url.id)}
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
            </div>

            {pagination.page < pagination.totalPages && (
              <div className="flex justify-center mt-8">
                <button className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-mono">
                  Load More
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