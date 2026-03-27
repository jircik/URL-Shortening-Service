'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiryHours, setExpiryHours] = useState('24');
  const [shortUrl, setShortUrl] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleCreate = () => {
    // Simulate URL shortening
    const randomCode = customCode || Math.random().toString(36).substring(7);
    setShortUrl(`url.jircik/${randomCode}`);
    setShowResult(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isLoggedIn={false} />
      
      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {!showResult ? (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-8 sm:p-12 space-y-8 max-w-2xl mx-auto">
              {/* Shorten your URL Button */}
              <div className="text-center">
                <button className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-mono">
                  Shorten your URL
                </button>
              </div>

              {/* URL Input */}
              <div>
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
                  <div className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground font-mono text-sm">
                    24h
                  </div>
                </div>
              </div>

              {/* CREATE Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-mono font-bold flex items-center gap-2"
                >
                  CREATE
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

              {/* Info Box */}
              <div className="bg-muted rounded-lg p-6 text-center text-secondary text-sm font-mono">
                <p>Links created without being connected to an account expire in 24 hours.</p>
                <p className="mt-2">To customize the status and view statistics such as Access Count for your URL</p>
                <Link href="/login" className="text-primary hover:opacity-80 transition-opacity">[log in or register]</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-8 sm:p-12 space-y-8 max-w-2xl mx-auto">
              {/* Success Message */}
              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-lg border border-primary text-primary font-mono">
                  Here is your short URL!
                </div>
              </div>

              {/* Short URL Display */}
              <div className="flex items-center gap-3 bg-input border border-primary rounded-lg p-6">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex-1 text-primary font-mono text-center hover:opacity-80 transition-opacity"
                >
                  {shortUrl}
                </button>
                <button
                  onClick={handleCopy}
                  className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </button>
              </div>

              {/* Expiry Info */}
              <div className="text-center text-secondary font-mono text-sm">
                Expires in 24 hours
              </div>

              {/* Info Box */}
              <div className="bg-muted rounded-lg p-6 text-center text-secondary text-sm font-mono">
                <p>Links created without being connected to an account expire in 24 hours.</p>
                <p className="mt-2">To customize the status and view statistics such as Access Count for your URL</p>
                <Link href="/login" className="text-primary hover:opacity-80 transition-opacity">[log in or register]</Link>
              </div>

              {/* Back Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowResult(false);
                    setLongUrl('');
                    setCustomCode('');
                    setShortUrl('');
                  }}
                  className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-mono"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
