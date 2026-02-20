import { create } from 'zustand';
import api from '../api/client';
import type { User, Car, Constants, Filters, Locale } from '../types';

interface AppState {
    // Auth
    user: User | null;
    token: string | null;
    isLoading: boolean;

    // Data
    cars: Car[];
    totalCars: number;
    totalPages: number;
    currentPage: number;
    constants: Constants | null;

    // UI
    locale: Locale;
    filters: Filters;

    // Actions
    login: (initData: string) => Promise<void>;
    logout: () => void;
    setLocale: (locale: Locale) => void;
    fetchCars: (filters?: Filters) => Promise<void>;
    fetchConstants: () => Promise<void>;
    setFilters: (filters: Partial<Filters>) => void;
    resetFilters: () => void;

    // Translation helper
    t: (key: string) => string;
}

const defaultFilters: Filters = {
    sort: 'newest',
    page: 1,
};

export const useStore = create<AppState>((set, get) => ({
    // Initial state
    user: null,
    token: localStorage.getItem('avtosotuv_token'),
    isLoading: false,
    cars: [],
    totalCars: 0,
    totalPages: 0,
    currentPage: 1,
    constants: null,
    locale: (localStorage.getItem('avtosotuv_locale') as Locale) || 'uz',
    filters: { ...defaultFilters },

    login: async (initData: string) => {
        try {
            set({ isLoading: true });
            const res = await api.post('/auth/login', { initData });
            const { token, user } = res.data;
            localStorage.setItem('avtosotuv_token', token);
            set({ user, token, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Login failed:', error);
        }
    },

    logout: () => {
        localStorage.removeItem('avtosotuv_token');
        set({ user: null, token: null });
    },

    setLocale: (locale: Locale) => {
        localStorage.setItem('avtosotuv_locale', locale);
        set({ locale });
    },

    fetchCars: async (filters?: Filters) => {
        try {
            set({ isLoading: true });
            const params = filters || get().filters;
            const cleanParams: Record<string, string> = {};
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== '' && value !== null) {
                    cleanParams[key] = String(value);
                }
            });
            const res = await api.get('/cars', { params: cleanParams });
            set({
                cars: res.data.cars,
                totalCars: res.data.total,
                totalPages: res.data.totalPages,
                currentPage: res.data.page,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            console.error('Fetch cars failed:', error);
        }
    },

    fetchConstants: async () => {
        try {
            const res = await api.get('/constants');
            set({ constants: res.data });
        } catch (error) {
            console.error('Fetch constants failed:', error);
        }
    },

    setFilters: (newFilters: Partial<Filters>) => {
        const current = get().filters;
        const updated = { ...current, ...newFilters, page: 1 };
        set({ filters: updated });
        get().fetchCars(updated);
    },

    resetFilters: () => {
        set({ filters: { ...defaultFilters } });
        get().fetchCars({ ...defaultFilters });
    },

    t: (key: string) => {
        const { locale, constants } = get();
        if (!constants) return key;
        return constants.i18n[locale]?.[key] || constants.i18n.uz?.[key] || key;
    },
}));
