import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import api from './api/client';

// Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Pages
import Home from './pages/Home';
import Detail from './pages/Detail';
import Create from './pages/Create';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Services from './pages/Services';

const App: React.FC = () => {
    const { setUser, setLoading, theme, globalError, setError, isInitialized, setInitialized } = useStore();

    useEffect(() => {
        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // Fetch constants for translations
                await useStore.getState().fetchConstants();

                const telegram = (window as any).Telegram?.WebApp;
                const initData = telegram?.initData;

                if (initData || import.meta.env.DEV) {
                    await useStore.getState().login(initData || 'dev_mode');
                    // Set Telegram theme color
                    telegram?.expand();
                }
            } catch (err: any) {
                console.error('Initialization error:', err);
                setError(err.message || 'Ilovani ishga tushirishda xatolik yuz berdi');
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };
        init();
    }, [setLoading, setError, setInitialized]);

    if (!isInitialized) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="app">
            {globalError && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Xatolik yuz berdi</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px', maxWidth: '300px' }}>{globalError}</div>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                        style={{ padding: '12px 24px', borderRadius: '12px' }}
                    >
                        Qayta yuklash
                    </button>
                    <button
                        onClick={() => setError(null)}
                        style={{ marginTop: '16px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', fontSize: '12px' }}
                    >
                        Yopish
                    </button>
                </div>
            )}
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/cars/:id" element={<Detail />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <BottomNav />
        </div>
    );
};

export default App;
