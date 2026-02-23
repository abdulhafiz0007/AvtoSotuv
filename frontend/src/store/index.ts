import { create } from 'zustand';
import api from '../api/client';
import type { User, Car, Service, Constants, Filters, Locale } from '../types';

// Local fallback translations so t() always works
const fallbackI18n: Record<Locale, Record<string, string>> = {
    uz: {
        home: 'Asosiy',
        addListing: "E'lon joylash",
        myListings: "Mening e'lonlarim",
        profile: 'Profil',
        admin: 'Admin',
        search: 'Mashina qidirish...',
        brand: 'Marka',
        allBrands: 'Hammasi',
        year: 'Yil',
        price: 'Narx',
        city: 'Shahar',
        allCities: 'Barcha shaharlar',
        mileage: 'Probeg',
        description: 'Tavsif',
        title: 'Nomi',
        photos: 'Rasmlar',
        showPhone: "Telefonni ko'rish",
        views: "Ko'rishlar",
        create: 'Sotish',
        delete: "O'chirish",
        sold: 'Sotilgan',
        active: 'Aktiv',
        noListings: "E'lonlar topilmadi",
        loading: 'Yuklanmoqda...',
        error: 'Xatolik yuz berdi',
        newest: "Eng so'nggi e'lonlar",
        cheapest: 'Eng arzon',
        expensive: 'Eng qimmat',
        services: 'Xizmatlar',
        listings: "E'lonlar",
        sum: "so'm",
        settings: 'Sozlamalar',
        language: 'Til',
        theme: 'Mavzu',
        light: 'Kunduzgi',
        dark: 'Tungi',
        confirm: 'Tasdiqlash',
        cancel: 'Bekor qilish',
    },
    ru: {
        home: 'Главная',
        addListing: 'Добавить',
        myListings: 'Мои объявления',
        profile: 'Профиль',
        admin: 'Админ',
        search: 'Поиск автомобиля...',
        brand: 'Марка',
        allBrands: 'Все',
        year: 'Год',
        price: 'Цена',
        city: 'Город',
        allCities: 'Все города',
        mileage: 'Пробег',
        description: 'Описание',
        title: 'Название',
        photos: 'Фотографии',
        showPhone: 'Показать телефон',
        views: 'Просмотры',
        create: 'Продать',
        delete: 'Удалить',
        sold: 'Продано',
        active: 'Активно',
        noListings: 'Объявления не найдены',
        loading: 'Загрузка...',
        error: 'Произошла ошибка',
        newest: 'Последние объявления',
        cheapest: 'Дешёвые',
        expensive: 'Дорогие',
        services: 'Сервисы',
        listings: 'Объявления',
        sum: 'сум',
        settings: 'Настройки',
        language: 'Язык',
        theme: 'Тема',
        light: 'Светлая',
        dark: 'Тёмная',
        confirm: 'Подтвердить',
        cancel: 'Отмена',
    },
    en: {
        home: 'Home',
        addListing: 'Add Listing',
        myListings: 'My Listings',
        profile: 'Profile',
        admin: 'Admin',
        search: 'Search cars...',
        brand: 'Brand',
        allBrands: 'All',
        year: 'Year',
        price: 'Price',
        city: 'City',
        allCities: 'All Cities',
        mileage: 'Mileage',
        description: 'Description',
        title: 'Title',
        photos: 'Photos',
        showPhone: 'Show Phone',
        views: 'Views',
        create: 'Sell',
        delete: 'Delete',
        sold: 'Sold',
        active: 'Active',
        noListings: 'No listings found',
        loading: 'Loading...',
        error: 'An error occurred',
        newest: 'Latest Listings',
        cheapest: 'Cheapest',
        expensive: 'Expensive',
        services: 'Services',
        listings: 'Listings',
        sum: 'UZS',
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        confirm: 'Confirm',
        cancel: 'Cancel',
    },
};

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
    globalError: string | null;
    isInitialized: boolean;

    // UI
    locale: Locale;
    theme: 'light' | 'dark';
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
    setTheme: (theme: 'light' | 'dark') => void;
    setFilters: (filters: Partial<Filters>) => void;
    resetFilters: () => void;
    setError: (error: string | null) => void;
    setInitialized: (val: boolean) => void;

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
    theme: (localStorage.getItem('avtosotuv_theme') as 'light' | 'dark') || 'light',
    filters: { ...defaultFilters },
    globalError: null,
    isInitialized: false,

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

    setTheme: (theme: 'light' | 'dark') => {
        localStorage.setItem('avtosotuv_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
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
    setError: (error: string | null) => set({ globalError: error }),
    setInitialized: (isInitialized: boolean) => set({ isInitialized }),

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
        // Try backend constants first, then local fallback
        const backendValue = constants?.i18n?.[locale]?.[key];
        if (backendValue) return backendValue;
        // Fallback to local translations
        return fallbackI18n[locale]?.[key] || fallbackI18n.uz?.[key] || key;
    },
}));
