import axios from 'axios';
import { useStore } from '../store';

// In production (Vercel), VITE_API_URL points to the Render backend
// In local dev, it falls back to '/api' which Vite proxies to localhost:3000
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('avtosotuv_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.message || 'Tarmoq xatosi';

        if (error.response?.status === 401) {
            localStorage.removeItem('avtosotuv_token');
            useStore.getState().setUser(null);
        } else if (error.response?.status !== 404) {
            // Don't show global error for 404s (e.g. missing images or individual car details)
            // But show for other critical failures
            useStore.getState().setError(message);
        }

        return Promise.reject(error);
    }
);

export default api;
