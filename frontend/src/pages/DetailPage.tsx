import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatPrice } from '../components/CarCard';
import api from '../api/client';
import type { Car } from '../types';

function DetailPage() {
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
            <div className="loading" style={{ minHeight: '60vh' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="empty">
                <div className="empty__icon">😕</div>
                <div className="empty__text">{t('noListings')}</div>
            </div>
        );
    }

    const images = car.images || [];

    return (
        <div className="detail">
            {/* Gallery */}
            <div className="detail__gallery">
                <button className="detail__back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {images.length > 0 ? (
                    <img
                        className="detail__gallery-image"
                        src={images[currentImage]?.imageUrl}
                        alt={car.title}
                    />
                ) : (
                    <div className="car-card__image-placeholder" style={{ height: '100%', fontSize: '4rem' }}>🚗</div>
                )}

                {images.length > 1 && (
                    <>
                        <button
                            className="detail__gallery-btn detail__gallery-btn--prev"
                            onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                        <button
                            className="detail__gallery-btn detail__gallery-btn--next"
                            onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                        <div className="detail__gallery-nav">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    className={`detail__gallery-dot ${i === currentImage ? 'detail__gallery-dot--active' : ''}`}
                                    onClick={() => setCurrentImage(i)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="detail__content">
                <h1 className="detail__title">{car.title}</h1>
                <div className="detail__price">{formatPrice(car.price)} {t('sum')}</div>

                {/* Specs Grid */}
                <div className="detail__specs">
                    <div className="detail__spec">
                        <div className="detail__spec-label">{t('brand')}</div>
                        <div className="detail__spec-value">{car.brand}</div>
                    </div>
                    <div className="detail__spec">
                        <div className="detail__spec-label">{t('year')}</div>
                        <div className="detail__spec-value">{car.year}</div>
                    </div>
                    <div className="detail__spec">
                        <div className="detail__spec-label">{t('mileage')}</div>
                        <div className="detail__spec-value">{car.mileage.toLocaleString()} {t('km')}</div>
                    </div>
                    <div className="detail__spec">
                        <div className="detail__spec-label">{t('city')}</div>
                        <div className="detail__spec-value">{car.city}</div>
                    </div>
                </div>

                {/* Description */}
                <div className="detail__description">
                    <h3>{t('description')}</h3>
                    <p>{car.description}</p>
                </div>

                {/* Views */}
                <div className="detail__views">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    {car.views} {t('views').toLowerCase()}
                </div>

                {/* Contact Button */}
                <button
                    className="detail__contact-btn"
                    onClick={() => setShowPhone(!showPhone)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {showPhone && car.user?.phone
                        ? car.user.phone
                        : t('showPhone')
                    }
                </button>

                {/* Seller Info */}
                {car.user && (
                    <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {car.user.firstName}
                        {car.user.username && ` (@${car.user.username})`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailPage;
