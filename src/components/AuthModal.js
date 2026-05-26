import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [selectedRole, setSelectedRole] = useState('parent');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        address: '',
        passport: '',
        birthDate: '',
        positionId: '',
        branchId: ''
    });
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const result = await login(formData.email, formData.password, selectedRole);
            if (result.success) {
                onClose();
                window.location.reload();
            } else {
                setError(result.error);
            }
        } else {
            const registerData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                role: selectedRole,
            };
            if (selectedRole === 'parent') {
                registerData.address = formData.address;
                registerData.passport = formData.passport;
            } else if (selectedRole === 'employee') {
                registerData.address = formData.address;
                registerData.birthDate = formData.birthDate;
                registerData.positionId = parseInt(formData.positionId);
                registerData.branchId = parseInt(formData.branchId);
            }
            const result = await register(registerData, selectedRole);
            if (result.success) {
                onClose();
                window.location.reload();
            } else {
                setError(result.error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={onClose}>✕</button>

                <div className="auth-tabs">
                    <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Вход</button>
                    <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Регистрация</button>
                </div>

                <div className="auth-role-selector">
                    <button className={`auth-role-btn ${selectedRole === 'parent' ? 'active' : ''}`} onClick={() => setSelectedRole('parent')}>
                        👨‍👩‍👧 Родитель
                    </button>
                    <button className={`auth-role-btn ${selectedRole === 'employee' ? 'active' : ''}`} onClick={() => setSelectedRole('employee')}>
                        👩‍🏫 Сотрудник
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
                    <input type="text" name="name" placeholder="Фамилия Имя" value={formData.name} onChange={handleChange} required />
                    <input type="tel" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} required />

                    {!isLogin && (
                        <>
                            <input type="text" name="address" placeholder="Адрес" value={formData.address} onChange={handleChange} required />
                            {selectedRole === 'parent' && (
                                <input type="text" name="passport" placeholder="Паспортные данные (серия номер)" value={formData.passport} onChange={handleChange} required />
                            )}
                            {selectedRole === 'employee' && (
                                <>
                                    <input type="date" name="birthDate" placeholder="Дата рождения" value={formData.birthDate} onChange={handleChange} required />
                                    <input type="number" name="positionId" placeholder="ID должности (1-20)" value={formData.positionId} onChange={handleChange} required />
                                    <input type="number" name="branchId" placeholder="ID филиала (1-4)" value={formData.branchId} onChange={handleChange} required />
                                </>
                            )}
                        </>
                    )}

                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="auth-submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                </form>

                <p className="auth-note">
                    {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                    <button className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthModal;