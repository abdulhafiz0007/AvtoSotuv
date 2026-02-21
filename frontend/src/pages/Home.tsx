import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import CarCard from '../components/CarCard';
import { Search } from 'lucide-react';

const Home: React.FC = () => {
    const { cars, fetchCars, setLoading, t, constants } = useStore(); // Use fetchCars from store
    const [search, setSearch] = useState('');
    const [brand, setBrand] = useState('');

    useEffect(() => {
        // Use the store action to fetch cars with filters
        fetchCars({
            search: search || undefined,
            brand: brand || undefined,
            page: 1,
            sort: 'newest'
        });
    }, [search, brand, fetchCars]);

    const brands = constants?.brands || ['Chevrolet', 'BYD', 'Kia', 'Hyundai', 'Toyota'];

    return (
        <div className="home">
            <div style={{ padding: '16px 16px 0 16px', position: 'relative' }}>
                <Search size={18} color="var(--hint)" style={{ position: 'absolute', left: '28px', top: '30px' }} />
                <input
                    type="text"
                    placeholder={t('search')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        background: 'var(--secondary-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        paddingLeft: '44px'
                    }}
                />
            </div>

            <div className="filters-scroll">
                <div
                    className={`filter-chip ${brand === '' ? 'active' : ''}`}
                    onClick={() => setBrand('')}
                >
                    {t('allBrands')}
                </div>
                {brands.slice(0, 10).map(b => (
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
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--hint)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
                    <div style={{ fontWeight: '600' }}>{t('noListings')}</div>
                </div>
            )}
        </div>
    );
};

export default Home;
