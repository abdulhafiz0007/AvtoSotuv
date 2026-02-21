import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatPrice } from '../components/CarCard';
import api from '../api/client';

const Create: React.FC = () => {
    const navigate = useNavigate();
    const { constants, t, fetchCars } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form data
    const [form, setForm] = useState({
        title: '',
        brand: '',
        year: '',
        price: '',
        mileage: '',
        city: '',
        description: '',
    });

    // Images
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const updateField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remaining = 5 - imageFiles.length;
        const newFiles = files.slice(0, remaining);

        setImageFiles((prev) => [...prev, ...newFiles]);

        newFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreviews((prev) => [...prev, ev.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Upload images
            const formData = new FormData();
            imageFiles.forEach((file) => formData.append('images', file));
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // 2. Create listing
            await api.post('/cars', {
                ...form,
                imageUrls: uploadRes.data.urls,
            });

            fetchCars();
            navigate('/');
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.response?.data?.error || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const isStep1Valid = form.title && form.brand && form.year && form.price && form.mileage && form.city;
    const isStep2Valid = imageFiles.length > 0;

    return (
        <div className="create-page" style={{ padding: '24px 16px 120px 16px' }}>
            <h1 className="section-title" style={{ padding: '0 0 16px 0' }}>E'lon berish</h1>

            {/* Progress Bars */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: step >= i ? 'var(--primary)' : 'var(--secondary-bg)',
                            transition: 'all 0.3s'
                        }}
                    />
                ))}
            </div>

            <div className="card" style={{ padding: '20px' }}>
                {step === 1 && (
                    <div className="form-step">
                        <div className="form-group">
                            <label>Mashina nomi</label>
                            <input
                                type="text"
                                placeholder="Masalan: Chevrolet Malibu 2"
                                value={form.title}
                                onChange={(e) => updateField('title', e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form-group">
                                <label>Marka</label>
                                <select value={form.brand} onChange={(e) => updateField('brand', e.target.value)}>
                                    <option value="">Tanlang</option>
                                    {['Chevrolet', 'BYD', 'Kia', 'Hyundai', 'Toyota', 'Daewoo'].map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Yili</label>
                                <select value={form.year} onChange={(e) => updateField('year', e.target.value)}>
                                    <option value="">Tanlang</option>
                                    {Array.from({ length: 26 }, (_, i) => 2026 - i).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form-group">
                                <label>Narxi (UZS)</label>
                                <input
                                    type="number"
                                    placeholder="280000000"
                                    value={form.price}
                                    onChange={(e) => updateField('price', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Yurgani (km)</label>
                                <input
                                    type="number"
                                    placeholder="35000"
                                    value={form.mileage}
                                    onChange={(e) => updateField('mileage', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Shahar</label>
                            <select value={form.city} onChange={(e) => updateField('city', e.target.value)}>
                                <option value="">Tanlang</option>
                                {['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', "Farg'ona", 'Andijon'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Tavsif</label>
                            <textarea
                                rows={3}
                                placeholder="Mashina holati haqida qisqacha..."
                                value={form.description}
                                onChange={(e) => updateField('description', e.target.value)}
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            disabled={!isStep1Valid}
                            onClick={() => setStep(2)}
                            style={{ opacity: isStep1Valid ? 1 : 0.5, marginTop: '12px' }}
                        >
                            Keyingisi →
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step">
                        <h3 style={{ marginBottom: '16px' }}>Rasmlar yuklang (kamida 1 ta)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {imagePreviews.map((p, i) => (
                                <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
                                    <img src={p} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                    <button
                                        onClick={() => removeImage(i)}
                                        style={{ position: 'absolute', top: '4px', right: '4px', width: '24px', height: '24px', borderRadius: '12px', background: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none' }}
                                    >✕</button>
                                </div>
                            ))}
                            {imageFiles.length < 5 && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ aspectRatio: '1', border: '2px dashed var(--glass-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--hint)' }}
                                >
                                    + Rasm
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button className="btn" onClick={() => setStep(1)} style={{ flex: 1, background: 'var(--secondary-bg)' }}>Ortga</button>
                            <button
                                className="btn btn-primary"
                                disabled={!isStep2Valid}
                                onClick={() => setStep(3)}
                                style={{ flex: 2, opacity: isStep2Valid ? 1 : 0.5 }}
                            >Keyingisi →</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step">
                        <h3 style={{ marginBottom: '16px' }}>Tekshirish</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--hint)' }}>Nomi:</span> <span>{form.title}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--hint)' }}>Marka:</span> <span>{form.brand}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--hint)' }}>Narxi:</span> <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{formatPrice(Number(form.price))} so'm</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--hint)' }}>Shahar:</span> <span>{form.city}</span></div>
                        </div>

                        {error && <div style={{ marginTop: '16px', color: '#ff3b30', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                            <button className="btn" onClick={() => setStep(2)} style={{ flex: 1, background: 'var(--secondary-bg)' }}>Ortga</button>
                            <button
                                className="btn btn-primary"
                                disabled={loading}
                                onClick={handleSubmit}
                                style={{ flex: 2, opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? 'Yuborilmoqda...' : '✓ Tasdiqlash'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Create;
