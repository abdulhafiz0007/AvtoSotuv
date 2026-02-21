import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from './store';

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
    const { setUser, setLoading } = useStore();

    useEffect(() => {
        const login = async () => {
            setLoading(true);
            try {
                const telegram = (window as any).Telegram?.WebApp;
                const initData = telegram?.initData;

                if (initData || import.meta.env.DEV) {
                    const res = await axios.post('/api/auth/login', { initData });
                    setUser(res.data.user);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

                    // Set Telegram theme color
                    telegram?.expand();
                }
            } catch (err) {
                console.error('Login error:', err);
            } finally {
                setLoading(false);
            }
        };
        login();
    }, [setUser, setLoading]);

    return (
        <div className="app">
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
