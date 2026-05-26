import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('parent');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        address: '',
        passport: '',
    });
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
    const validatePassword = (password) => {
        if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
        if (!/[A-Z]/.test(password)) return 'Пароль должен содержать хотя бы одну заглавную букву';
        if (!/[0-9]/.test(password)) return 'Пароль должен содержать хотя бы одну цифру';
        return null;
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordError('');

        if (!validateEmail(formData.email)) {
            setError('Введите корректный email');
            return;
        }

        if (isLogin) {
            const res = await login(formData.email, formData.password, role);
            if (!res.success) setError(res.error);
        } else {
            if (role === 'employee') {
                setError('Регистрация сотрудников доступна только через администратора');
                return;
            }
            const passErr = validatePassword(formData.password);
            if (passErr) { setPasswordError(passErr); return; }
            if (formData.password !== formData.confirmPassword) {
                setPasswordError('Пароли не совпадают');
                return;
            }
            const registerData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                role: 'parent',
                address: formData.address,
                passport: formData.passport,
            };
            const res = await register(registerData, 'parent');
            if (!res.success) setError(res.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/login-bg.jpg')" }}>
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-white text-3xl">☀️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Детский сад «Солнышко»</h1>
                    <p className="text-gray-500 mt-1">{isLogin ? 'Вход в систему' : 'Регистрация родителя'}</p>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setRole('parent')}
                        className={`flex-1 py-2 rounded-full text-center transition ${role === 'parent' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}
                    >
                        👨‍👩‍👧 Родитель
                    </button>
                    <button
                        onClick={() => setRole('employee')}
                        className={`flex-1 py-2 rounded-full text-center transition ${role === 'employee' ? 'bg-yellow-400 text-black shadow-md' : 'bg-gray-100 text-gray-600'}`}
                    >
                        👩‍🏫 Сотрудник
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400"
                            placeholder="example@mail.ru" required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password" name="password" value={formData.password} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400"
                            placeholder="••••••••" required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Подтверждение пароля</label>
                                <input
                                    type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="Иванова Анна Сергеевна" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="+7 (900) 123-45-67" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="г. Москва, ул. Солнечная, д.1" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Паспортные данные</label>
                                <input type="text" name="passport" value={formData.passport} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl" placeholder="4510 123456" required />
                            </div>
                        </>
                    )}

                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition"
                    >
                        {isLogin ? `Войти как ${role === 'parent' ? 'родитель' : 'сотрудник'}` : 'Зарегистрироваться'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-purple-500 text-sm hover:underline">
                        {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                    </button>
                </div>
            </div>
        </div>
    );
}