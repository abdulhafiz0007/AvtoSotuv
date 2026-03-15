import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types';
import { resolveImageUrl } from '../utils/imageUrl';

interface Props {
    car: Car;
}

export const formatPrice = (price: number) => {
    return price.toLocaleString();
};

const CarCard: React.FC<Props> = ({ car }) => {
    const mainImage = resolveImageUrl(car.images?.[0]?.imageUrl || '');

    return (
        <Link to={`/cars/${car.id}`} className="card car-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="img-container">
                {mainImage ? (
                    <img src={mainImage} alt={car.title} />
                ) : (
                    <div style={{ width: '100%', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--secondary-bg)', fontSize: '3rem' }}>🚗</div>
                )}
            </div>
            <div className="info" style={{ padding: '4px 12px 16px 12px' }}>
                <span className="car-price" style={{ fontSize: '18px', fontWeight: 800 }}>{(car.price || 0).toLocaleString()} UZS</span>
                <h3 className="car-title" style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px', marginBottom: '6px' }}>{car.title}</h3>
                <div className="car-meta" style={{ display: 'flex', gap: '6px', color: 'var(--hint)', fontSize: '13px', fontWeight: 500 }}>
                    <span>{car.year} y.</span>
                    <span>•</span>
                    <span>{car.city}</span>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;
