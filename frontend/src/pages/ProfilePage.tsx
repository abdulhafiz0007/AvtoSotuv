import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { formatPrice } from '../components/CarCard';
import api from '../api/client';
import type { Car } from '../types';

function ProfilePage() {
    const { user, t } = useStore();
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const fetchMyCars = async () => {
        try {
            const res = await api.get('/cars/my');
            setCars(res.data.cars);
        } catch {
            console.error('Failed to fetch my cars');
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
            setToast({ type: 'success', message: t('deleteListing') + ' ✓' });
            setTimeout(() => setToast(null), 2000);
        } catch {
            setToast({ type: 'error', message: t('error') });
            setTimeout(() => setToast(null), 2000);
        }
        setDeleteId(null);
    };

    return (
        <div className="profile">
            {/* User Info */}
            <div className="profile__header">
                <div className="profile__avatar">
                    {user?.firstName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="profile__name">{user?.firstName || 'User'}</div>
                {user?.username && (
                    <div className="profile__username">@{user.username}</div>
                )}
            </div>

            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                {t('myListings')} ({cars.length})
            </h2>

            {loading ? (
                <div className="loading">
                    <div className="spinner" />
                </div>
            ) : cars.length === 0 ? (
                <div className="empty">
                    <div className="empty__icon">📋</div>
                    <div className="empty__text">{t('noListings')}</div>
                </div>
            ) : (
                cars.map((car, i) => (
                    <div key={car.id} className="profile__listing" style={{ animationDelay: `${i * 0.05}s` }}>
                        {car.images?.[0] ? (
                            <img className="profile__listing-image" src={car.images[0].imageUrl} alt={car.title} />
                        ) : (
                            <div className="profile__listing-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🚗</div>
                        )}
                        <div className="profile__listing-info">
                            <div className="profile__listing-title">{car.title}</div>
                            <div className="profile__listing-price">{formatPrice(car.price)} {t('sum')}</div>
                            <span className={`profile__listing-status profile__listing-status--${car.status}`}>
                                {car.status === 'active' ? t('active') : t('sold')}
                            </span>
                        </div>
                        <div className="profile__listing-actions">
                            <button
                                className="btn btn--danger btn--sm"
                                onClick={() => setDeleteId(car.id)}
                            >
                                {t('delete')}
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Delete Confirmation Dialog */}
            {deleteId && (
                <div className="overlay" onClick={() => setDeleteId(null)}>
                    <div className="dialog" onClick={(e) => e.stopPropagation()}>
                        <p className="dialog__text">{t('deleteConfirm')}</p>
                        <div className="dialog__actions">
                            <button className="btn btn--secondary" onClick={() => setDeleteId(null)}>{t('no')}</button>
                            <button className="btn btn--danger" onClick={() => handleDelete(deleteId)}>{t('yes')}</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast toast--${toast.type}`}>{toast.message}</div>
            )}
        </div>
    );
}

export default ProfilePage;
