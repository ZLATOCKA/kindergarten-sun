import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/EmployeeDashboard.css';

const API_URL = 'http://localhost:5000/api';

export default function EmployeeDashboard() {
    const [profile, setProfile] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [vacations, setVacations] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Нет токена авторизации');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [profileRes, scheduleRes, vacationsRes] = await Promise.all([
                    axios.get(`${API_URL}/employees/my-profile`, { headers }),
                    axios.get(`${API_URL}/employees/my-schedule`, { headers }),
                    axios.get(`${API_URL}/employees/my-vacations`, { headers }),
                ]);
                setProfile(profileRes.data);
                setFormData(profileRes.data || {});
                setSchedule(scheduleRes.data || []);
                setVacations(vacationsRes.data || []);
            } catch (err) {
                console.error('Ошибка загрузки данных сотрудника:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/employees/my-profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(formData);
            setEditing(false);
            alert('Профиль обновлён');
        } catch (err) {
            alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message));
        }
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayIndex = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const firstDay = getFirstDayIndex(year, month);
    const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay });
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    const isWeekend = (day) => {
        const date = new Date(year, month, day);
        return date.getDay() === 0 || date.getDay() === 6;
    };

    const isVacation = (day) => {
        const date = new Date(year, month, day);
        return vacations.some(v => {
            const start = new Date(v.start);
            const end = new Date(v.end);
            return date >= start && date <= end;
        });
    };

    const isWorkDay = (day) => {
        const date = new Date(year, month, day);
        return schedule.some(s => new Date(s.Дата).toDateString() === date.toDateString());
    };

    const getDayClass = (day) => {
        if (isVacation(day)) return 'vacation';
        if (isWeekend(day)) return 'weekend';
        if (isWorkDay(day)) return 'work';
        return '';
    };

    if (loading) return <div className="employee-container"><div className="employee-card" style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div></div>;
    if (error) return <div className="employee-container"><div className="employee-card" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Ошибка: {error}</div></div>;
    if (!profile) return <div className="employee-container"><div className="employee-card" style={{ textAlign: 'center', padding: '50px' }}>Нет данных профиля</div></div>;

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
                                <input
                                    value={formData.Фамилия || ''}
                                    onChange={e => setFormData({ ...formData, Фамилия: e.target.value })}
                                    placeholder="Фамилия"
                                />
                                <input
                                    value={formData.Имя || ''}
                                    onChange={e => setFormData({ ...formData, Имя: e.target.value })}
                                    placeholder="Имя"
                                />
                                <input
                                    value={formData.Отчество || ''}
                                    onChange={e => setFormData({ ...formData, Отчество: e.target.value })}
                                    placeholder="Отчество"
                                />
                                <input
                                    value={formData.Телефон || ''}
                                    onChange={e => setFormData({ ...formData, Телефон: e.target.value })}
                                    placeholder="Телефон"
                                />
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
                            const isWeekendDay = date.getDay() === 0 || date.getDay() === 6;
                            const hasWork = schedule.some(s => new Date(s.Дата).toDateString() === date.toDateString());
                            const isVacationDay = vacations.some(v => {
                                const start = new Date(v.start);
                                const end = new Date(v.end);
                                return date >= start && date <= end;
                            });
                            let dayClass = '';
                            if (isVacationDay) dayClass = 'vacation';
                            else if (isWeekendDay) dayClass = 'weekend';
                            else if (hasWork) dayClass = 'work';

                            return (
                                <div key={day} className={`calendar-day ${dayClass}`}>
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                    <div className="calendar-legend">
                        <span><span className="legend-work"></span> Рабочий день</span>
                        <span><span className="legend-weekend"></span> Выходной</span>
                        <span><span className="legend-vacation"></span> Отпуск</span>
                    </div>
                </div>
            </div>
        </div>
    );
}