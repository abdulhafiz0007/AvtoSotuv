import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Moon, Sun, Languages, User as UserIcon } from 'lucide-react';
import type { Locale } from '../types';

const Header: React.FC = () => {
    const { user, locale, setLocale, theme, setTheme } = useStore();
    const telegram = (window as any).Telegram?.WebApp;
    const tgUser = telegram?.initDataUnsafe?.user;

    const locales: Locale[] = ['uz', 'ru', 'en'];

    return (
        <header>
            <div className="logo">AvtoSotuv</div>
            <div className="header__actions">
                {/* Language Switcher */}
                <div className="lang-switcher">
                    <div className="lang-icon" style={{ padding: '0 4px', color: 'var(--hint)' }}>
                        <Languages size={14} />
                    </div>
                    {locales.map(l => (
                        <button
                            key={l}
                            className={`lang-btn ${locale === l ? 'active' : ''}`}
                            onClick={() => setLocale(l)}
                        >
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Theme Toggle */}
                <button
                    className="theme-toggle"
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                {/* Profile Avatar */}
                <Link to="/profile" className="profile-trigger" style={{ textDecoration: 'none' }}>
                    {tgUser?.photo_url ? (
                        <img src={tgUser.photo_url} alt="Profile" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: '#fff', borderRadius: '50%' }}>
                            <UserIcon size={20} strokeWidth={2.5} />
                        </div>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;
