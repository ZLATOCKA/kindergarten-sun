import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

function Header() {
    const { user, role, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (role === 'parent') return '/parent-dashboard';
        if (role === 'employee') return '/employee-dashboard';
        return null;
    };

    return (
        <>
            <header style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 20px',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        {/* Логотип */}
                         <img src="/logo.png" alt="Логотип Солнышко" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                        <span style={{ fontWeight: 700, fontSize: '22px', color: '#2B2B2B' }}>Солнышко</span>
                    </Link>

                    <nav style={{ display: 'flex', gap: '25px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#2B2B2B', fontWeight: 500 }}>Главная</Link>
                        <Link to="/about" style={{ textDecoration: 'none', color: '#2B2B2B', fontWeight: 500 }}>О нас</Link>
                        <Link to="/programs" style={{ textDecoration: 'none', color: '#2B2B2B', fontWeight: 500 }}>Программы</Link>
                        <Link to="/gallery" style={{ textDecoration: 'none', color: '#2B2B2B', fontWeight: 500 }}>Галерея</Link>
                        <Link to="/contacts" style={{ textDecoration: 'none', color: '#2B2B2B', fontWeight: 500 }}>Контакты</Link>

                        {user ? (
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <Link to={getDashboardLink()} style={{ textDecoration: 'none' }}>
                                    <button style={{ background: '#fbc80b', border: 'none', borderRadius: '30px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>
                                        👤 {user.name}
                                    </button>
                                </Link>
                                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#009665', fontWeight: 600, cursor: 'pointer' }}>
                                    Выйти
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsAuthModalOpen(true)} className="button-primary" style={{ padding: '8px 24px' }}>
                                Войти
                            </button>
                        )}
                    </nav>
                </div>
            </header>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}

export default Header;