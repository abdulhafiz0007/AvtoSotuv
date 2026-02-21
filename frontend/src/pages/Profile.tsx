import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { formatPrice } from '../components/CarCard';
import api from '../api/client';
import type { Car } from '../types';
import { Trash2, Package } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, t, theme, cars: storeCars } = useStore(); // Using cars from store too
    const [myCars, setMyCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const fetchMyCars = async () => {
        try {
            const res = await api.get('/cars/my');
            setMyCars(res.data.cars);
        } catch (err) {
            console.error('Fetch my cars error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCars();
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/cars/${id}`);
            setMyCars((prev) => prev.filter((c) => c.id !== id));
            setDeleteId(null);
        } catch (err) {
            console.error('Delete error:', err);
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
                    <div style={{ background: 'var(--secondary-bg)', padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Package size={16} color="var(--primary)" />
                        <div style={{ fontSize: '18px', fontWeight: '800' }}>{myCars.length}</div>
                        <div style={{ fontSize: '10px', color: 'var(--hint)', textTransform: 'uppercase' }}>{t('listings')}</div>
                    </div>
                </div>
            </div>

            <h2 className="section-title" style={{ padding: '0 0 12px 0' }}>{t('myListings')}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                    <div className="loading" style={{ textAlign: 'center', padding: '40px' }}><div className="spinner" /></div>
                ) : myCars.length > 0 ? (
                    myCars.map(car => (
                        <div key={car.id} className="card" style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src={car.images?.[0]?.imageUrl || '/uploads/placeholder.jpg'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '700', fontSize: '15px' }}>{car.title}</div>
                                <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '14px', marginTop: '2px' }}>{formatPrice(car.price)} {t('sum')}</div>
                                <div style={{ fontSize: '11px', color: car.status === 'active' ? '#34c759' : '#8e8e93', marginTop: '4px', fontWeight: '600' }}>
                                    {car.status === 'active' ? `● ${t('active')}` : `● ${t('sold')}`}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button
                                    onClick={() => setDeleteId(car.id)}
                                    style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,59,48,0.1)', color: '#ff3b30', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--hint)', background: 'var(--secondary-bg)', borderRadius: '20px' }}>
                        {t('noListings')}
                    </div>
                )}
            </div>

            {/* Simple Delete Confirm */}
            {deleteId && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ padding: '24px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(255,59,48,0.1)', width: '56px', height: '56px', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#ff3b30' }}>
                            <Trash2 size={24} />
                        </div>
                        <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '800' }}>{t('deleteConfirm')}</h3>
                        <p style={{ color: 'var(--hint)', fontSize: '14px', marginBottom: '24px' }}>Bu amal ortga qaytarilmaydi.</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn" onClick={() => setDeleteId(null)} style={{ flex: 1, background: 'var(--secondary-bg)', color: 'var(--text)' }}>{t('no')}</button>
                            <button className="btn" onClick={() => handleDelete(deleteId)} style={{ flex: 1, background: '#ff3b30', color: '#fff' }}>{t('yes')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
