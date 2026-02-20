import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import type { Car } from '../types';

function formatPrice(price: number): string {
    if (price >= 1000000000) {
        return (price / 1000000000).toFixed(1).replace('.0', '') + ' mlrd';
    }
    if (price >= 1000000) {
        return (price / 1000000).toFixed(0) + ' mln';
    }
    return price.toLocaleString('uz-UZ');
}

function CarCard({ car, index }: { car: Car; index: number }) {
    const navigate = useNavigate();
    const { t } = useStore();
    const imageUrl = car.images?.[0]?.imageUrl;

    return (
        <article
            className="car-card"
            onClick={() => navigate(`/car/${car.id}`)}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {imageUrl ? (
                <img
                    className="car-card__image"
                    src={imageUrl}
                    alt={car.title}
                    loading="lazy"
                />
            ) : (
                <div className="car-card__image-placeholder">🚗</div>
            )}
            <div className="car-card__body">
                <h3 className="car-card__title">{car.title}</h3>
                <div className="car-card__price">{formatPrice(car.price)} {t('sum')}</div>
                <div className="car-card__meta">
                    <span>{car.year}</span>
                    <span className="car-card__meta-dot" />
                    <span>{car.city}</span>
                    <span className="car-card__meta-dot" />
                    <span>{car.mileage.toLocaleString()} {t('km')}</span>
                </div>
            </div>
        </article>
    );
}

export default CarCard;
export { formatPrice };
