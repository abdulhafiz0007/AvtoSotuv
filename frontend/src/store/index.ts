import { create } from 'zustand';
import api from '../api/client';
import type { User, Car, Service, Constants, Filters, Locale } from '../types';

interface AppState {
    // Auth
    user: User | null;
    token: string | null;
    loading: boolean;

    // Data
    cars: Car[];
    services: Service[];
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
    fetchServices: (type?: string) => Promise<void>;
    fetchConstants: () => Promise<void>;
    setUser: (user: User | null) => void;
    setCars: (cars: Car[]) => void;
    setServices: (services: Service[]) => void;
    setLoading: (loading: boolean) => void;
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
    loading: false,
    cars: [],
    services: [],
    totalCars: 0,
    totalPages: 0,
    currentPage: 1,
    constants: null,
    locale: (localStorage.getItem('avtosotuv_locale') as Locale) || 'uz',
    filters: { ...defaultFilters },

    login: async (initData: string) => {
        try {
            set({ loading: true });
            const res = await api.post('/auth/login', { initData });
            const { token, user } = res.data;
            localStorage.setItem('avtosotuv_token', token);
            set({ user, token, loading: false });
        } catch (error) {
            set({ loading: false });
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
            set({ loading: true });
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
                loading: false,
            });
        } catch (error) {
            set({ loading: false });
            console.error('Fetch cars failed:', error);
        }
    },

    fetchServices: async (type?: string) => {
        try {
            set({ loading: true });
            const params = type ? { type } : {};
            const res = await api.get('/services', { params });
            set({ services: res.data.services, loading: false });
        } catch (error) {
            set({ loading: false });
            console.error('Fetch services failed:', error);
        }
    },

    setUser: (user: User | null) => set({ user }),
    setCars: (cars: Car[]) => set({ cars }),
    setLoading: (loading: boolean) => set({ loading }),
    setServices: (services: Service[]) => set({ services }),

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
