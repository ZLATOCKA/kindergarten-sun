import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './styles/LoginPage.css';

export default function LoginPage() {
    const { login } = useAuth();
    const [role, setRole] = useState('parent');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Введите корректный email');
            return;
        }

        const res = await login(email, password, role);
        if (!res.success) setError(res.error);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img src="/logo.png" alt="Логотип Солнышко" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                    <h1>Детский сад «Солнышко»</h1>
                    <p>Войдите в свой аккаунт</p>
                </div>

                <div className="role-tabs">
                    <button
                        onClick={() => setRole('parent')}
                        className={`role-btn ${role === 'parent' ? 'active parent' : ''}`}
                    >
                        <img src="/images/login/parent-icon.png" alt="Родитель" onError={(e) => e.target.style.display = 'none'} />
                        Родитель
                    </button>
                    <button
                        onClick={() => setRole('employee')}
                        className={`role-btn ${role === 'employee' ? 'active employee' : ''}`}
                    >
                        <img src="/images/login/employee-icon.png" alt="Сотрудник" onError={(e) => e.target.style.display = 'none'} />
                        Сотрудник
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-wrapper">
                        <img src="/images/login/email-icon.png" alt="" className="input-icon" onError={(e) => e.target.style.display = 'none'} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <img src="/images/login/lock-icon.png" alt="" className="input-icon" onError={(e) => e.target.style.display = 'none'} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            className="form-input"
                            required
                        />
                        <img
                            src="/images/login/eye-icon.png"
                            alt="Показать пароль"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    </div>

                    <div className="form-options">
                        <label className="checkbox">
                            <input type="checkbox" />
                            <span>Запомнить меня</span>
                        </label>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="submit-btn">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}