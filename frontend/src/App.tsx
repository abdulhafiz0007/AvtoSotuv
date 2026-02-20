import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import CreatePage from './pages/CreatePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                ready: () => void;
                expand: () => void;
                initData: string;
                colorScheme: 'light' | 'dark';
                themeParams: Record<string, string>;
                MainButton: {
                    show: () => void;
                    hide: () => void;
                    setText: (text: string) => void;
                    onClick: (cb: () => void) => void;
                };
                BackButton: {
                    show: () => void;
                    hide: () => void;
                    onClick: (cb: () => void) => void;
                };
            };
        };
    }
}

function App() {
    const { login, fetchCars, fetchConstants, token } = useStore();

    useEffect(() => {
        // Initialize Telegram Web App
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
        }

        // Fetch constants (brands, cities, i18n)
        fetchConstants();

        // Auth
        const initData = tg?.initData || 'dev_mode';
        if (!token) {
            login(initData);
        }

        // Fetch initial listings
        fetchCars();
    }, []);

    return (
        <BrowserRouter>
            <div className="app">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/car/:id" element={<DetailPage />} />
                    <Route path="/create" element={<CreatePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
                <BottomNav />
            </div>
        </BrowserRouter>
    );
}

export default App;
