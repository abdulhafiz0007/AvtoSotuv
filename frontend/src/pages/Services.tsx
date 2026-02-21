import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from '../store';
import { Service } from '../types';

const Services: React.FC = () => {
    const { services, setServices } = useStore();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const url = filter === 'all'
                    ? '/api/services'
                    : `/api/services?type=${filter}`;
                const res = await axios.get(url);
                setServices(res.data.services);
            } catch (err) {
                console.error('Fetch services error:', err);
            }
        };
        fetchServices();
    }, [filter, setServices]);

    const serviceTypes = [
        { id: 'all', label: 'Hammasi' },
        { id: 'petrol', label: 'Yoqilg\'i' },
        { id: 'repair', label: 'Usta' },
        { id: 'wash', label: 'Yuvish' },
        { id: 'tire', label: 'Shinaxana' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'petrol': return '⛽';
            case 'repair': return '🛠️';
            case 'wash': return '🚿';
            case 'tire': return '🛞';
            default: return '📍';
        }
    };

    return (
        <div className="services-page">
            <h2 className="section-title">Avtoservislar</h2>

            <div className="filters-scroll">
                {serviceTypes.map(type => (
                    <div
                        key={type.id}
                        className={`filter-chip ${filter === type.id ? 'active' : ''}`}
                        onClick={() => setFilter(type.id)}
                    >
                        {type.label}
                    </div>
                ))}
            </div>

            <div className="content-grid" style={{ display: 'block' }}>
                {services.length > 0 ? (
                    services.map((service: Service) => (
                        <div key={service.id} className="card service-card">
                            <div className="service-icon">
                                <span style={{ fontSize: '24px' }}>{getIcon(service.type)}</span>
                            </div>
                            <div className="service-info">
                                <div className="service-title">{service.title}</div>
                                <div className="service-meta">{service.address}, {service.city}</div>
                                <div className="rating">⭐ {service.rating}</div>
                            </div>
                            <div className="service-actions">
                                <a
                                    href={`tel:${service.phone}`}
                                    className="btn-primary"
                                    style={{ padding: '8px 12px', borderRadius: '10px', textDecoration: 'none', fontSize: '13px' }}
                                >
                                    Bog'lanish
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--hint)' }}>
                        Xizmatlar topilmadi
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
