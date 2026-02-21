export interface User {
    id: number;
    telegramId: string;
    username: string | null;
    firstName: string;
    isAdmin: boolean;
}

export interface CarImage {
    id: number;
    carId: number;
    imageUrl: string;
}

export interface Car {
    id: number;
    userId: number;
    title: string;
    brand: string;
    year: number;
    price: number;
    mileage: number;
    city: string;
    description: string;
    views: number;
    status: string;
    createdAt: string;
    images: CarImage[];
    user?: {
        firstName: string;
        username: string | null;
        phone?: string | null;
    };
}

export interface CarsResponse {
    cars: Car[];
    total: number;
    page: number;
    totalPages: number;
}

export interface Filters {
    brand?: string;
    city?: string;
    yearFrom?: string;
    yearTo?: string;
    priceFrom?: string;
    priceTo?: string;
    search?: string;
    sort?: 'newest' | 'cheapest' | 'expensive';
    page?: number;
}

export interface Constants {
    brands: string[];
    cities: string[];
    years: number[];
    i18n: {
        uz: Record<string, string>;
        ru: Record<string, string>;
    };
}

export type Locale = 'uz' | 'ru' | 'en';

export interface Service {
    id: number;
    title: string;
    type: string;
    address: string;
    city: string;
    lat: number | null;
    lng: number | null;
    phone: string | null;
    description: string | null;
    rating: number;
    createdAt: string;
}
