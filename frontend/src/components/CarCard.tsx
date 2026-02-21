import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types';

interface Props {
    car: Car;
}

const CarCard: React.FC<Props> = ({ car }) => {
    const mainImage = car.images?.[0]?.imageUrl || '/uploads/placeholder.jpg';

    return (
        <Link to={`/cars/${car.id}`} className="card car-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="img-container">
                <img src={mainImage} alt={car.title} />
            </div>
            <div className="info">
                <span className="car-price">{car.price.toLocaleString()} UZS</span>
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
