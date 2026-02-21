import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';

const Header: React.FC = () => {
    const { user } = useStore();
    const telegram = (window as any).Telegram?.WebApp;

    // Get user from Telegram SDK if it exists
    const tgUser = telegram?.initDataUnsafe?.user;

    return (
        <header>
            <div className="logo">AvtoSotuv</div>
            <div className="header__actions">
                <Link to="/profile" className="profile-trigger" style={{ textDecoration: 'none' }}>
                    {tgUser?.photo_url ? (
                        <img src={tgUser.photo_url} alt="Profile" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: '#fff', fontWeight: '900', fontSize: '16px' }}>
                            {tgUser?.first_name?.[0] || user?.firstName?.[0] || 'U'}
                        </div>
                    )}
                </Link>
            </div>
        </header>
    );
};

export default Header;
