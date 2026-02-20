import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatPrice } from '../components/CarCard';
import api from '../api/client';

function CreatePage() {
    const navigate = useNavigate();
    const { constants, t, fetchCars } = useStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async () => {
        setLoading(true);
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

            showToast('success', t('successCreate'));
            fetchCars();
            setTimeout(() => navigate('/'), 1500);
        } catch (error: any) {
            const msg = error.response?.data?.error || t('error');
            showToast('error', msg);
        } finally {
            setLoading(false);
        }
    };

    const isStep1Valid = form.title && form.brand && form.year && form.price && form.mileage && form.city;
    const isStep2Valid = imageFiles.length > 0;

    return (
        <div className="create-form">
            <div className="create-form__header">
                <h1 className="create-form__title">{t('addListing')}</h1>
            </div>

            {/* Steps indicator */}
            <div className="create-form__steps">
                <div className={`create-form__step ${step >= 1 ? (step > 1 ? 'create-form__step--done' : 'create-form__step--active') : ''}`} />
                <div className={`create-form__step ${step >= 2 ? (step > 2 ? 'create-form__step--done' : 'create-form__step--active') : ''}`} />
                <div className={`create-form__step ${step >= 3 ? 'create-form__step--active' : ''}`} />
            </div>

            {/* Step 1: Car Info */}
            {step === 1 && (
                <div>
                    <div className="form-group">
                        <label className="form-group__label">{t('title')}</label>
                        <input
                            className="form-group__input"
                            type="text"
                            value={form.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            placeholder="Chevrolet Malibu 2"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-group__label">{t('brand')}</label>
                        <select
                            className="form-group__select"
                            value={form.brand}
                            onChange={(e) => updateField('brand', e.target.value)}
                        >
                            <option value="">{t('allBrands')}</option>
                            {constants?.brands.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-group__label">{t('year')}</label>
                            <select
                                className="form-group__select"
                                value={form.year}
                                onChange={(e) => updateField('year', e.target.value)}
                            >
                                <option value="">{t('year')}</option>
                                {constants?.years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-group__label">{t('price')} ({t('sum')})</label>
                            <input
                                className="form-group__input"
                                type="number"
                                value={form.price}
                                onChange={(e) => updateField('price', e.target.value)}
                                placeholder="280000000"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-group__label">{t('mileage')} ({t('km')})</label>
                            <input
                                className="form-group__input"
                                type="number"
                                value={form.mileage}
                                onChange={(e) => updateField('mileage', e.target.value)}
                                placeholder="35000"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-group__label">{t('city')}</label>
                            <select
                                className="form-group__select"
                                value={form.city}
                                onChange={(e) => updateField('city', e.target.value)}
                            >
                                <option value="">{t('allCities')}</option>
                                {constants?.cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-group__label">{t('description')}</label>
                        <textarea
                            className="form-group__textarea"
                            value={form.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder={t('description')}
                        />
                    </div>

                    <div className="btn-row">
                        <button className="btn btn--secondary" onClick={() => navigate(-1)}>{t('cancel')}</button>
                        <button
                            className="btn btn--primary"
                            disabled={!isStep1Valid}
                            onClick={() => setStep(2)}
                            style={{ opacity: isStep1Valid ? 1 : 0.5 }}
                        >
                            {t('next')} →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Images */}
            {step === 2 && (
                <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
                        {t('uploadPhotos')}
                    </p>

                    <div className="image-uploader">
                        {imagePreviews.map((preview, i) => (
                            <div key={i} className="image-uploader__item">
                                <img className="image-uploader__preview" src={preview} alt={`Preview ${i + 1}`} />
                                <button className="image-uploader__remove" onClick={() => removeImage(i)}>✕</button>
                            </div>
                        ))}
                        {imageFiles.length < 5 && (
                            <button className="image-uploader__add" onClick={() => fileInputRef.current?.click()}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <span>+{t('photos')}</span>
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />

                    <div className="btn-row">
                        <button className="btn btn--secondary" onClick={() => setStep(1)}>{t('back')}</button>
                        <button
                            className="btn btn--primary"
                            disabled={!isStep2Valid}
                            onClick={() => setStep(3)}
                            style={{ opacity: isStep2Valid ? 1 : 0.5 }}
                        >
                            {t('next')} →
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
                <div>
                    <div className="review__item">
                        <span className="review__label">{t('title')}</span>
                        <span className="review__value">{form.title}</span>
                    </div>
                    <div className="review__item">
                        <span className="review__label">{t('brand')}</span>
                        <span className="review__value">{form.brand}</span>
                    </div>
                    <div className="review__item">
                        <span className="review__label">{t('year')}</span>
                        <span className="review__value">{form.year}</span>
                    </div>
                    <div className="review__item">
                        <span className="review__label">{t('price')}</span>
                        <span className="review__value">{formatPrice(parseInt(form.price))} {t('sum')}</span>
                    </div>
                    <div className="review__item">
                        <span className="review__label">{t('mileage')}</span>
                        <span className="review__value">{parseInt(form.mileage).toLocaleString()} {t('km')}</span>
                    </div>
                    <div className="review__item">
                        <span className="review__label">{t('city')}</span>
                        <span className="review__value">{form.city}</span>
                    </div>
                    <div className="review__item">
                        <span className="review__label">{t('description')}</span>
                        <span className="review__value" style={{ maxWidth: '200px', textAlign: 'right' }}>{form.description.substring(0, 50)}...</span>
                    </div>

                    <div className="review__images">
                        {imagePreviews.map((preview, i) => (
                            <img key={i} className="review__image" src={preview} alt={`Preview ${i + 1}`} />
                        ))}
                    </div>

                    <div className="btn-row">
                        <button className="btn btn--secondary" onClick={() => setStep(2)}>{t('back')}</button>
                        <button
                            className="btn btn--primary"
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{ opacity: loading ? 0.5 : 1 }}
                        >
                            {loading ? t('loading') : `✓ ${t('create')}`}
                        </button>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast toast--${toast.type}`}>{toast.message}</div>
            )}
        </div>
    );
}

export default CreatePage;
