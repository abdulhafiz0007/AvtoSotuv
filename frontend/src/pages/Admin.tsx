import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import api from '../api/client';
import { BarChart3, Car, Users, Settings, Lock, Trash2, Ban, Unlock } from 'lucide-react';

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

const Admin: React.FC = () => {
    const { user, t, theme } = useStore();
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
        if (!window.confirm(t('deleteConfirm'))) return;
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
            <div className="admin-page" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <Lock size={64} color="var(--hint)" style={{ margin: '0 auto 20px auto' }} />
                <div style={{ fontWeight: '800', fontSize: '20px' }}>Admin huquqi talab etiladi</div>
                <div style={{ marginTop: '8px', color: 'var(--hint)' }}>Bu sahifa faqat ma'murlar uchun.</div>
            </div>
        );
    }

    return (
        <div className="admin-page" style={{ padding: '24px 16px 120px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <Settings size={28} color="var(--primary)" />
                <h1 className="section-title" style={{ padding: 0, margin: 0 }}>Admin Panel</h1>
            </div>

            {/* Tabs */}
            <div className="filters-scroll" style={{ marginBottom: '24px' }}>
                <div className={`filter-chip ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart3 size={16} /> Statistika
                </div>
                <div className={`filter-chip ${tab === 'listings' ? 'active' : ''}`} onClick={() => setTab('listings')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Car size={16} /> E'lonlar
                </div>
                <div className={`filter-chip ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} /> Userlar
                </div>
            </div>

            {loading ? (
                <div className="loading" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" /></div>
            ) : (
                <div className="admin-content">
                    {tab === 'stats' && stats && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="card" style={{ padding: '20px' }}>
                                <div style={{ background: 'rgba(51,144,236,0.1)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '12px' }}>
                                    <Users size={20} />
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '900' }}>{stats.totalUsers}</div>
                                <div style={{ fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', fontWeight: '700' }}>Userlar</div>
                            </div>
                            <div className="card" style={{ padding: '20px' }}>
                                <div style={{ background: 'rgba(51,144,236,0.1)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '12px' }}>
                                    <Car size={20} />
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '900' }}>{stats.totalListings}</div>
                                <div style={{ fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', fontWeight: '700' }}>E'lonlar</div>
                            </div>
                            <div className="card" style={{ padding: '20px' }}>
                                <div style={{ background: 'rgba(52,199,89,0.1)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34c759', marginBottom: '12px' }}>
                                    <Lock size={20} />
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '900' }}>{stats.activeListings}</div>
                                <div style={{ fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', fontWeight: '700' }}>Faol</div>
                            </div>
                            <div className="card" style={{ padding: '20px' }}>
                                <div style={{ background: 'rgba(255,149,0,0.1)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9500', marginBottom: '12px' }}>
                                    <BarChart3 size={20} />
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: '900' }}>{stats.totalViews}</div>
                                <div style={{ fontSize: '11px', color: 'var(--hint)', textTransform: 'uppercase', fontWeight: '700' }}>Ko'rishlar</div>
                            </div>
                        </div>
                    )}

                    {tab === 'listings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {cars.map(car => (
                                <div key={car.id} className="card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{car.title}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--hint)', display: 'flex', gap: '6px' }}>
                                            <span>{car.user.firstName}</span>
                                            <span>•</span>
                                            <span>{car.brand}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCar(car.id)}
                                        style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,59,48,0.1)', color: '#ff3b30', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'users' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {users.map(u => (
                                <div key={u.id} className="card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{u.firstName}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--hint)' }}>{u._count.cars} e'lonlar | {u.username ? `@${u.username}` : u.telegramId}</div>
                                    </div>
                                    <button
                                        onClick={() => handleBlockUser(u.id)}
                                        style={{ padding: '8px 12px', borderRadius: '10px', background: u.isBlocked ? 'var(--primary)' : 'rgba(255,59,48,0.1)', color: u.isBlocked ? '#fff' : '#ff3b30', border: 'none', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                    >
                                        {u.isBlocked ? <><Unlock size={14} /> Unblock</> : <><Ban size={14} /> Block</>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;
