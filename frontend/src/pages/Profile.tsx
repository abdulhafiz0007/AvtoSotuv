import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { formatPrice } from '../components/CarCard';
import api from '../api/client';
import type { Car } from '../types';

const Profile: React.FC = () => {
    const { user, t } = useStore();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchMyCars = async () => {
        try {
            const res = await api.get('/cars/my');
            setCars(res.data.cars);
        } catch (err) {
            console.error('Fetch my cars error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCars();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/cars/${id}`);
            setCars((prev) => prev.filter((c) => c.id !== id));
            setDeleteId(null);
        } catch (err) {
            console.error('Delete error:', err);
            alert('O\'chirishda xatolik yuz berdi');
        }
    };

    return (
        <div className="profile-page" style={{ padding: '24px 16px 120px 16px' }}>
            {/* Profile Header */}
            <div className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--primary)', color: '#fff', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontWeight: '900', boxShadow: '0 8px 16px rgba(51, 144, 236, 0.2)' }}>
                    {user?.firstName?.[0] || '?'}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{user?.firstName}</h2>
                {user?.username && <div style={{ color: 'var(--hint)', fontSize: '14px' }}>@{user.username}</div>}

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
                    <div style={{ background: 'var(--secondary-bg)', padding: '8px 16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '18px', fontWeight: '800' }}>{cars.length}</div>
                        <div style={{ fontSize: '10px', color: 'var(--hint)', textTransform: 'uppercase' }}>E'lonlar</div>
                    </div>
                </div>
            </div>

            <h2 className="section-title" style={{ padding: '0 0 12px 0' }}>Mening e'lonlarim</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                    <div className="loading" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" /></div>
                ) : cars.length > 0 ? (
                    cars.map(car => (
                        <div key={car.id} className="card" style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src={car.images?.[0]?.imageUrl || '/uploads/placeholder.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '700', fontSize: '15px' }}>{car.title}</div>
                                <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '14px', marginTop: '2px' }}>{formatPrice(car.price)} so'm</div>
                                <div style={{ fontSize: '11px', color: car.status === 'active' ? '#34c759' : '#8e8e93', marginTop: '4px', fontWeight: '600' }}>
                                    {car.status === 'active' ? '● Sotuvda' : '● Sotilgan'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button
                                    onClick={() => setDeleteId(car.id)}
                                    style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,59,48,0.1)', color: '#ff3b30', border: 'none', cursor: 'pointer' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--hint)', background: 'var(--secondary-bg)', borderRadius: '20px' }}>
                        Sizda hali e'lonlar yo'q
                    </div>
                )}
            </div>

            {/* Simple Delete Confirm */}
            {deleteId && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ padding: '24px', width: '100%', maxWidth: '300px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '16px' }}>E'lonni o'chirishni xohlaysizmi?</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn" onClick={() => setDeleteId(null)} style={{ flex: 1, background: 'var(--secondary-bg)' }}>Yo'q</button>
                            <button className="btn" onClick={() => handleDelete(deleteId)} style={{ flex: 1, background: '#ff3b30', color: '#fff' }}>Ha, o'chirish</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
