const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
   const token = localStorage.getItem('token');

   const headers: HeadersInit = {
       'Content-Type': 'application/json',
       ...(token ? { Authorization: `Bearer ${token}` } : {}),
       ...(options.headers || {}),
   };

   const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
   return res;
}