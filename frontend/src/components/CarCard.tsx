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
            <div className="info">
                <span className="car-price">{(car.price || 0).toLocaleString()} UZS</span>
                <h3 className="car-title">{car.title}</h3>
                <div className="car-meta">
                    <span>{car.year} y.</span>
                    <span>•</span>
                    <span>{car.city}</span>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;
