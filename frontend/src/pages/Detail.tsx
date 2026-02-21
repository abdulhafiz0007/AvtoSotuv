import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatPrice } from '../components/CarCard';
import api from '../api/client';
import type { Car } from '../types';

const Detail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useStore();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [showPhone, setShowPhone] = useState(false);

    useEffect(() => {
        async function fetchCar() {
            try {
                const res = await api.get(`/cars/${id}`);
                setCar(res.data.car);
            } catch {
                console.error('Failed to fetch car');
            } finally {
                setLoading(false);
            }
        }
        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className="loading" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="empty" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px' }}>😕</div>
                <div style={{ marginTop: '16px', color: 'var(--hint)' }}>{t('noListings')}</div>
                <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '24px' }}>
                    Ortga qaytish
                </button>
            </div>
        );
    }

    const images = car.images || [];

    return (
        <div className="detail" style={{ paddingBottom: '120px' }}>
            {/* Gallery Section */}
            <div className="detail__gallery" style={{ position: 'relative', background: '#000' }}>
                <button
                    className="detail__back-btn"
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {images.length > 0 ? (
                    <img
                        className="detail__gallery-image"
                        src={images[currentImage]?.imageUrl}
                        alt={car.title}
                        style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ width: '100%', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)', fontSize: '4rem' }}>🚗</div>
                )}

                {images.length > 1 && (
                    <div className="detail__gallery-nav" style={{ position: 'absolute', bottom: '16px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`detail__gallery-dot ${i === currentImage ? 'detail__gallery-dot--active' : ''}`}
                                style={{
                                    width: i === currentImage ? '24px' : '8px',
                                    height: '8px',
                                    borderRadius: '4px',
                                    background: i === currentImage ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <div className="detail__content" style={{ padding: '24px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="detail__title" style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2' }}>{car.title}</h1>
                        <div className="car-meta" style={{ marginTop: '4px' }}>
                            <span>{car.city}</span>
                            <span>•</span>
                            <span>{car.views} {t('views').toLowerCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="detail__price" style={{ marginTop: '16px', fontSize: '28px', fontWeight: '900', color: 'var(--primary)' }}>
                    {formatPrice(car.price)} {t('sum')}
                </div>

                {/* Specs Grid */}
                <div className="detail__specs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '24px' }}>
                    <div className="card" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--hint)' }}>{t('brand')}</div>
                        <div style={{ fontWeight: '700', marginTop: '2px' }}>{car.brand}</div>
                    </div>
                    <div className="card" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--hint)' }}>{t('year')}</div>
                        <div style={{ fontWeight: '700', marginTop: '2px' }}>{car.year}</div>
                    </div>
                    <div className="card" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--hint)' }}>{t('mileage')}</div>
                        <div style={{ fontWeight: '700', marginTop: '2px' }}>{car.mileage.toLocaleString()} {t('km')}</div>
                    </div>
                    <div className="card" style={{ padding: '16px' }}>
                        <div style={{ fontSize: '12px', color: 'var(--hint)' }}>{t('status')}</div>
                        <div style={{ fontWeight: '700', marginTop: '2px', color: car.status === 'active' ? 'var(--primary)' : 'var(--hint)' }}>
                            {car.status === 'active' ? 'Sotuvda' : 'Sotilgan'}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{t('description')}</h3>
                    <div className="card" style={{ marginTop: '12px', padding: '16px', background: 'var(--secondary-bg)', border: 'none' }}>
                        <p style={{ lineHeight: '1.6', fontSize: '15px' }}>{car.description}</p>
                    </div>
                </div>

                {/* Seller Info */}
                {car.user && (
                    <div className="card" style={{ marginTop: '24px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {car.user.firstName[0]}
                        </div>
                        <div>
                            <div style={{ fontWeight: '700' }}>{car.user.firstName}</div>
                            {car.user.username && <div style={{ fontSize: '12px', color: 'var(--hint)' }}>@{car.user.username}</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Action Button */}
            <div style={{ position: 'fixed', bottom: '80px', left: '16px', right: '16px', zIndex: 90 }}>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowPhone(!showPhone)}
                    style={{ height: '56px', borderRadius: '18px', fontSize: '17px', boxShadow: '0 8px 32px rgba(51, 144, 236, 0.3)' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {showPhone && car.user?.phone
                        ? car.user.phone
                        : t('showPhone')
                    }
                </button>
            </div>
        </div>
    );
};

export default Detail;
