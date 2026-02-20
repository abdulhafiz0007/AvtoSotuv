import { useState, useCallback } from 'react';
import { useStore } from '../store';
import CarCard from '../components/CarCard';

function HomePage() {
    const { cars, isLoading, totalCars, filters, setFilters, resetFilters, constants, t } = useStore();
    const [showFilters, setShowFilters] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setFilters({ search: searchValue });
    }, [searchValue, setFilters]);

    const handleSearchClear = useCallback(() => {
        setSearchValue('');
        setFilters({ search: '' });
    }, [setFilters]);

    return (
        <div>
            {/* Search Bar */}
            <form className="search-bar" onSubmit={handleSearch}>
                <div className="search-bar__wrapper">
                    <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        className="search-bar__input"
                        type="text"
                        placeholder={t('search')}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className={`search-bar__filter-btn ${showFilters ? 'search-bar__filter-btn--active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14" />
                        <line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" />
                        <line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="1" y1="14" x2="7" y2="14" />
                        <line x1="9" y1="8" x2="15" y2="8" />
                        <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                </button>
            </form>

            {/* Filter Panel */}
            {showFilters && constants && (
                <div className="filter-panel">
                    <div className="filter-panel__row">
                        <select
                            className="filter-panel__select"
                            value={filters.brand || ''}
                            onChange={(e) => setFilters({ brand: e.target.value || undefined })}
                        >
                            <option value="">{t('allBrands')}</option>
                            {constants.brands.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                        <select
                            className="filter-panel__select"
                            value={filters.city || ''}
                            onChange={(e) => setFilters({ city: e.target.value || undefined })}
                        >
                            <option value="">{t('allCities')}</option>
                            {constants.cities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-panel__row">
                        <input
                            className="filter-panel__input"
                            type="number"
                            placeholder={`${t('price')} ${t('priceFrom')}`}
                            value={filters.priceFrom || ''}
                            onChange={(e) => setFilters({ priceFrom: e.target.value || undefined })}
                        />
                        <input
                            className="filter-panel__input"
                            type="number"
                            placeholder={`${t('price')} ${t('priceTo')}`}
                            value={filters.priceTo || ''}
                            onChange={(e) => setFilters({ priceTo: e.target.value || undefined })}
                        />
                    </div>

                    <div className="filter-panel__row">
                        <select
                            className="filter-panel__select"
                            value={filters.yearFrom || ''}
                            onChange={(e) => setFilters({ yearFrom: e.target.value || undefined })}
                        >
                            <option value="">{t('year')} {t('priceFrom')}</option>
                            {constants.years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <select
                            className="filter-panel__select"
                            value={filters.yearTo || ''}
                            onChange={(e) => setFilters({ yearTo: e.target.value || undefined })}
                        >
                            <option value="">{t('year')} {t('priceTo')}</option>
                            {constants.years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort & Reset */}
                    <div className="filter-panel__actions">
                        {(['newest', 'cheapest', 'expensive'] as const).map((s) => (
                            <button
                                key={s}
                                className={`filter-panel__sort-btn ${filters.sort === s ? 'filter-panel__sort-btn--active' : ''}`}
                                onClick={() => setFilters({ sort: s })}
                            >
                                {t(s)}
                            </button>
                        ))}
                        <button className="filter-panel__reset" onClick={resetFilters}>✕</button>
                    </div>
                </div>
            )}

            {/* Results count */}
            {!isLoading && (
                <div style={{ padding: '0 16px 8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {totalCars} {t('listings').toLowerCase()}
                </div>
            )}

            {/* Car Grid */}
            {isLoading ? (
                <div className="loading">
                    <div className="spinner" />
                    <span>{t('loading')}</span>
                </div>
            ) : cars.length === 0 ? (
                <div className="empty">
                    <div className="empty__icon">🔍</div>
                    <div className="empty__text">{t('noListings')}</div>
                </div>
            ) : (
                <div className="car-grid">
                    {cars.map((car, i) => (
                        <CarCard key={car.id} car={car} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
