import React from 'react';
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
                <div className="profile-trigger">
                    {tgUser?.photo_url ? (
                        <img src={tgUser.photo_url} alt="Profile" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: '#fff', fontWeight: 'bold' }}>
                            {tgUser?.first_name?.[0] || user?.firstName?.[0] || 'U'}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
