'use client';

import { useEffect, useState } from 'react';
import { AuthContext, User } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        apiFetch('/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.userId) setUser(data);
            })
            .catch(() => {
                localStorage.removeItem('token');
            })
            .finally(() => setLoading(false));
    }, []);

    async function login(email: string, password: string) {
        const res = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem('token', data.token);
        setUser({ userId: data.userId, email });
    }

    async function register(email: string, password: string) {
        const res = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem('token', data.token);
        setUser({ userId: data.userId, email });
    }

    function logout() {
        localStorage.removeItem('token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}