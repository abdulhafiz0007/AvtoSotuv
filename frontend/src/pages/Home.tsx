import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';
import CarCard from '../components/CarCard';

const Home: React.FC = () => {
    const { cars, setCars, setLoading, t, constants } = useStore();
    const [search, setSearch] = useState('');
    const [brand, setBrand] = useState('');

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (search) params.search = search;
                if (brand) params.brand = brand;

                const res = await axios.get('/api/cars', { params });
                setCars(res.data.cars);
            } catch (err) {
                console.error('Fetch cars error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [search, brand, setCars, setLoading]);

    const brands = constants?.brands || ['Chevrolet', 'BYD', 'Kia', 'Hyundai', 'Toyota'];

    return (
        <div className="home">
            <div style={{ padding: '16px 16px 0 16px' }}>
                <input
                    type="text"
                    placeholder={t('search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ background: 'var(--secondary-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}
                />
            </div>

            <div className="filters-scroll">
                <div
                    className={`filter-chip ${brand === '' ? 'active' : ''}`}
                    onClick={() => setBrand('')}
                >
                    {t('allBrands')}
                </div>
                {brands.slice(0, 6).map(b => (
                    <div
                        key={b}
                        className={`filter-chip ${brand === b ? 'active' : ''}`}
                        onClick={() => setBrand(b)}
                    >
                        {b}
                    </div>
                ))}
            </div>

            <h2 className="section-title">{t('newest')}</h2>

            <div className="content-grid">
                {cars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>

            {cars.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--hint)' }}>
                    {t('noListings')}
                </div>
            )}
        </div>
    );
};

export default Home;
