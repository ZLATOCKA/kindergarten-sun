import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/EmployeeDashboard.css';

export default function EmployeeDashboard() {
    const [profile, setProfile] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) { setError('Нет токена авторизации'); setLoading(false); return; }
                const headers = { Authorization: `Bearer ${token}` };
                const profileRes = await axios.get('/api/employees/my-profile', { headers });
                const scheduleRes = await axios.get('/api/employees/my-schedule', { headers });
                setProfile(profileRes.data);
                setFormData(profileRes.data || {});
                setSchedule(scheduleRes.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/employees/my-profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(formData);
            setEditing(false);
            alert('Профиль обновлён');
        } catch (err) {
            alert('Ошибка сохранения');
        }
    };

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayIndex = (y, m) => {
        let day = new Date(y, m, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const firstDay = getFirstDayIndex(year, month);
    const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay });
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    if (loading) return <div className="employee-loading">Загрузка...</div>;
    if (error) return <div className="employee-loading error">{error}</div>;
    if (!profile) return <div className="employee-loading">Данные не найдены. Обратитесь к администратору.</div>;

    return (
        <div className="employee-container">
            <div className="employee-card">
                <div className="employee-header">
                    <div className="employee-avatar">
                        <span>{profile.Имя?.[0]}{profile.Фамилия?.[0]}</span>
                    </div>
                    <div className="employee-title">
                        {editing ? (
                            <div className="edit-form">
                                <input value={formData.Фамилия || ''} onChange={e => setFormData({ ...formData, Фамилия: e.target.value })} placeholder="Фамилия" />
                                <input value={formData.Имя || ''} onChange={e => setFormData({ ...formData, Имя: e.target.value })} placeholder="Имя" />
                                <input value={formData.Отчество || ''} onChange={e => setFormData({ ...formData, Отчество: e.target.value })} placeholder="Отчество" />
                                <input value={formData.Телефон || ''} onChange={e => setFormData({ ...formData, Телефон: e.target.value })} placeholder="Телефон" />
                                <button onClick={handleSave}>Сохранить</button>
                                <button onClick={() => setEditing(false)}>Отмена</button>
                            </div>
                        ) : (
                            <>
                                <h2>{profile.Фамилия} {profile.Имя} {profile.Отчество || ''}</h2>
                                <p className="position">👩‍🏫 {profile.Должность || 'Не указана'}</p>
                                <p className="phone">📞 {profile.Телефон || 'Не указан'}</p>
                                <button className="edit-btn" onClick={() => setEditing(true)}>✏️ Редактировать профиль</button>
                            </>
                        )}
                    </div>
                </div>

                <div className="employee-info">
                    <div className="info-card">
                        <h3>Филиал</h3>
                        <p>{profile.Филиал || 'Не указан'}</p>
                    </div>
                    <div className="info-card">
                        <h3>Оклад</h3>
                        <p>{profile.Оклад ? `${profile.Оклад} ₽` : 'Не указан'}</p>
                    </div>
                </div>

                <div className="schedule-calendar">
                    <h3>График работы</h3>
                    <div className="calendar-header">
                        <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>◀</button>
                        <span>{currentMonth.toLocaleString('ru', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>▶</button>
                    </div>
                    <div className="calendar-weekdays">
                        {weekDays.map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="calendar-days">
                        {blanks.map((_, i) => <div key={`blank-${i}`} className="calendar-day blank"></div>)}
                        {daysArray.map(day => {
                            const date = new Date(year, month, day);
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            const hasWork = schedule.some(s => new Date(s.Дата).toDateString() === date.toDateString());
                            return <div key={day} className={`calendar-day ${hasWork ? 'work' : ''} ${isWeekend ? 'weekend' : ''}`}>{day}</div>;
                        })}
                    </div>
                    <div className="calendar-legend">
                        <span><span className="legend-work"></span> Рабочий день</span>
                        <span><span className="legend-weekend"></span> Выходной</span>
                    </div>
                </div>
            </div>
        </div>
    );
}