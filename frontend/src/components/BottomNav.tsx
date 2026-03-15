import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store';
import { Home, MapPin, PlusCircle, User } from 'lucide-react';

const BottomNav: React.FC = () => {
    const { t } = useStore();

    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} strokeWidth={2.5} />
                <span>{t('home')}</span>
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <MapPin size={24} strokeWidth={2.5} />
                <span>{t('services')}</span>
            </NavLink>
            <NavLink to="/create" className={({ isActive }) => `nav-item center-btn ${isActive ? 'active' : ''}`}>
                <div className="center-btn-icon">
                    <PlusCircle size={28} strokeWidth={2.5} />
                </div>
                <span>{t('create')}</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <User size={24} strokeWidth={2.5} />
                <span>{t('profile')}</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
