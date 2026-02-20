import { useState, useEffect } from 'react';
import { useStore } from '../store';
import api from '../api/client';

interface Stats {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    todayListings: number;
    totalViews: number;
}

interface AdminUser {
    id: number;
    telegramId: string;
    username: string | null;
    firstName: string;
    isBlocked: boolean;
    isAdmin: boolean;
    createdAt: string;
    _count: { cars: number };
}

interface AdminCar {
    id: number;
    title: string;
    brand: string;
    price: number;
    status: string;
    createdAt: string;
    user: { firstName: string; username: string | null; telegramId: string };
}

function AdminPage() {
    const { user, t } = useStore();
    const [tab, setTab] = useState<'stats' | 'listings' | 'users'>('stats');
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [cars, setCars] = useState<AdminCar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tab === 'stats') fetchStats();
        if (tab === 'listings') fetchCars();
        if (tab === 'users') fetchUsers();
    }, [tab]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/cars');
            setCars(res.data.cars);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.users);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCar = async (id: number) => {
        try {
            await api.delete(`/admin/cars/${id}`);
            setCars((prev) => prev.filter((c) => c.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const handleBlockUser = async (id: number) => {
        try {
            const res = await api.put(`/admin/users/${id}/block`);
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, isBlocked: res.data.user.isBlocked } : u))
            );
        } catch (e) {
            console.error(e);
        }
    };

    if (!user?.isAdmin) {
        return (
            <div className="empty">
                <div className="empty__icon">🔒</div>
                <div className="empty__text">Admin huquqi talab etiladi</div>
            </div>
        );
    }

    return (
        <div className="admin">
            <h1 className="admin__title">⚙️ {t('admin')}</h1>

            {/* Tabs */}
            <div className="admin__tabs">
                <button
                    className={`admin__tab ${tab === 'stats' ? 'admin__tab--active' : ''}`}
                    onClick={() => setTab('stats')}
                >
                    📊 {t('stats')}
                </button>
                <button
                    className={`admin__tab ${tab === 'listings' ? 'admin__tab--active' : ''}`}
                    onClick={() => setTab('listings')}
                >
                    🚗 {t('listings')}
                </button>
                <button
                    className={`admin__tab ${tab === 'users' ? 'admin__tab--active' : ''}`}
                    onClick={() => setTab('users')}
                >
                    👥 {t('users')}
                </button>
            </div>

            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                </div>
            ) : (
                <>
                    {/* Stats Tab */}
                    {tab === 'stats' && stats && (
                        <div className="admin__stats">
                            <div className="admin__stat">
                                <div className="admin__stat-value">{stats.totalUsers}</div>
                                <div className="admin__stat-label">{t('totalUsers')}</div>
                            </div>
                            <div className="admin__stat">
                                <div className="admin__stat-value">{stats.totalListings}</div>
                                <div className="admin__stat-label">{t('totalListings')}</div>
                            </div>
                            <div className="admin__stat">
                                <div className="admin__stat-value">{stats.activeListings}</div>
                                <div className="admin__stat-label">{t('activeListings')}</div>
                            </div>
                            <div className="admin__stat">
                                <div className="admin__stat-value">{stats.totalViews}</div>
                                <div className="admin__stat-label">{t('todayViews')}</div>
                            </div>
                        </div>
                    )}

                    {/* Listings Tab */}
                    {tab === 'listings' && (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>{t('title')}</th>
                                        <th>{t('brand')}</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cars.map((car) => (
                                        <tr key={car.id}>
                                            <td>{car.id}</td>
                                            <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{car.title}</td>
                                            <td>{car.brand}</td>
                                            <td>
                                                <span className={`profile__listing-status profile__listing-status--${car.status}`}>
                                                    {car.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn--danger btn--sm" onClick={() => handleDeleteCar(car.id)}>
                                                    {t('delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Users Tab */}
                    {tab === 'users' && (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>{t('title')}</th>
                                        <th>{t('listings')}</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.firstName} {u.username && `(@${u.username})`}</td>
                                            <td>{u._count.cars}</td>
                                            <td>
                                                {u.isBlocked ? (
                                                    <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>🔴 Blocked</span>
                                                ) : (
                                                    <span style={{ color: 'var(--success)', fontSize: '0.75rem' }}>🟢 Active</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn--sm ${u.isBlocked ? 'btn--primary' : 'btn--danger'}`}
                                                    onClick={() => handleBlockUser(u.id)}
                                                >
                                                    {u.isBlocked ? t('unblockUser') : t('blockUser')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminPage;
