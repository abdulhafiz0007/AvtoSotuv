import { useStore } from '../store';

function Header() {
    const { locale, setLocale, t } = useStore();

    return (
        <header className="header">
            <div className="header__logo">🚗 AvtoSotuv</div>
            <div className="header__actions">
                <button
                    className="header__lang-btn"
                    onClick={() => setLocale(locale === 'uz' ? 'ru' : 'uz')}
                >
                    {locale === 'uz' ? 'RU' : 'UZ'}
                </button>
            </div>
        </header>
    );
}

export default Header;
