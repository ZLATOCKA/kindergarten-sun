import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/EmployeeDashboard.css';

const API_URL = 'http://localhost:5000/api';

export default function EmployeeDashboard() {
    const [profile, setProfile] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [vacations, setVacations] = useState([]);
    const [lessonPlans, setLessonPlans] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [lessonTypes, setLessonTypes] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date()); // ✅ ДОБАВЛЕНО
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('profile');
    const [newLesson, setNewLesson] = useState({
        group_id: '',
        lesson_type_id: '',
        topic: '',
        date: '',
        time_start: '',
        duration_minutes: 30
    });
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const isTeacher = profile?.Должность === 'Воспитатель';

    useEffect(() => {
        if (!token) {
            setError('Нет авторизации');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                const profileRes = await axios.get(`${API_URL}/employees/my-profile`, { headers });
                setProfile(profileRes.data);
                setFormData(profileRes.data || {});

                const [scheduleRes, vacationsRes] = await Promise.all([
                    axios.get(`${API_URL}/employees/my-schedule`, { headers }),
                    axios.get(`${API_URL}/employees/my-vacations`, { headers }),
                ]);
                setSchedule(scheduleRes.data || []);
                setVacations(vacationsRes.data || []);

                if (profileRes.data?.Должность === 'Воспитатель') {
                    const [groupsRes, typesRes, plansRes] = await Promise.all([
                        axios.get(`${API_URL}/employees/my-groups`, { headers }),
                        axios.get(`${API_URL}/employees/lesson-types`, { headers }),
                        axios.get(`${API_URL}/employees/lesson-plans`, { headers }),
                    ]);
                    setMyGroups(groupsRes.data || []);
                    setLessonTypes(typesRes.data || []);
                    setLessonPlans(plansRes.data || []);
                }
            } catch (err) {
                console.error('Ошибка:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const handleProfileSave = async () => {
        try {
            await axios.put(`${API_URL}/employees/my-profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(formData);
            setEditing(false);
            alert('Профиль обновлён');
        } catch (err) {
            alert('Ошибка: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCreateLesson = async (e) => {
        e.preventDefault();

        if (!newLesson.group_id) {
            alert('Выберите группу');
            return;
        }
        if (!newLesson.lesson_type_id) {
            alert('Выберите тип занятия');
            return;
        }
        if (!newLesson.topic.trim()) {
            alert('Введите тему');
            return;
        }
        if (!newLesson.date) {
            alert('Выберите дату');
            return;
        }
        if (!newLesson.time_start) {
            alert('Выберите время');
            return;
        }

        try {
            await axios.post(`${API_URL}/employees/lesson-plans`, newLesson, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Обновляем список
            const plansRes = await axios.get(`${API_URL}/employees/lesson-plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLessonPlans(plansRes.data);

            // Очищаем форму
            setNewLesson({
                group_id: '',
                lesson_type_id: '',
                topic: '',
                date: '',
                time_start: '',
                duration_minutes: 30
            });

            alert('Занятие добавлено!');
        } catch (err) {
            alert('Ошибка: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteLesson = async (id) => {
        if (!window.confirm('Удалить занятие?')) return;
        try {
            await axios.delete(`${API_URL}/employees/lesson-plans/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const plansRes = await axios.get(`${API_URL}/employees/lesson-plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLessonPlans(plansRes.data);
            alert('Занятие удалено');
        } catch (err) {
            alert('Ошибка: ' + (err.response?.data?.message || err.message));
        }
    };

    // Компактный календарь
    const renderCompactCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysCount = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
        const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const days = [];

        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`blank-${i}`} className="compact-day blank"></div>);
        }

        for (let d = 1; d <= daysCount; d++) {
            const date = new Date(year, month, d);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isVacation = vacations.some(v => {
                if (!v.start) return false;
                const start = new Date(v.start);
                const end = new Date(v.end);
                return date >= start && date <= end;
            });
            const hasWork = schedule.some(s => {
                if (!s.Дата) return false;
                return new Date(s.Дата).toDateString() === date.toDateString();
            });

            let dayClass = '';
            if (isVacation) dayClass = 'vacation';
            else if (isWeekend) dayClass = 'weekend';
            else if (hasWork) dayClass = 'work';

            days.push(
                <div key={d} className={`compact-day ${dayClass}`}>
                    {d}
                </div>
            );
        }

        return (
            <div className="compact-calendar">
                <div className="compact-calendar-header">
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>◀</button>
                    <span>{currentMonth.toLocaleString('ru', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>▶</button>
                </div>
                <div className="compact-calendar-weekdays">
                    {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>
                <div className="compact-calendar-days">
                    {days}
                </div>
                <div className="compact-calendar-legend">
                    <span><span className="legend-work"></span>Рабочий</span>
                    <span><span className="legend-weekend"></span>Выходной</span>
                    <span><span className="legend-vacation"></span>Отпуск</span>
                </div>
            </div>
        );
    };

    if (loading) return <div className="dashboard-loading">Загрузка...</div>;
    if (error) return <div className="dashboard-error">Ошибка: {error}</div>;
    if (!profile) return <div className="dashboard-error">Нет данных</div>;

    return (
        <div className="employee-dashboard">
            {/* Левая боковая панель */}
            <div className="dashboard-sidebar">
                <div className="sidebar-menu">
                    <button
                        className={`sidebar-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 Мой профиль
                    </button>
                    <button
                        className={`sidebar-btn ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        📅 График работы
                    </button>
                    {isTeacher && (
                        <button
                            className={`sidebar-btn ${activeTab === 'lessons' ? 'active' : ''}`}
                            onClick={() => setActiveTab('lessons')}
                        >
                            📖 План занятий
                        </button>
                    )}
                </div>
            </div>

            {/* Правая основная область */}
            <div className="dashboard-main">
                {/* Профиль */}
                {activeTab === 'profile' && (
                    <div className="profile-content">
                        <div className="profile-avatar-large">
                            {profile.Имя?.[0]}{profile.Фамилия?.[0]}
                        </div>
                        <div className="profile-info">
                            {editing ? (
                                <div className="profile-edit-form">
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
                                        type="date"
                                        value={formData.Дата_рождения?.split('T')[0] || ''}
                                        onChange={e => setFormData({ ...formData, Дата_рождения: e.target.value })}
                                    />
                                    <input
                                        value={formData.Телефон || ''}
                                        onChange={e => setFormData({ ...formData, Телефон: e.target.value })}
                                        placeholder="Телефон"
                                    />
                                    <input
                                        value={formData.Email || ''}
                                        onChange={e => setFormData({ ...formData, Email: e.target.value })}
                                        placeholder="Email"
                                    />
                                    <input
                                        value={formData.Адрес || ''}
                                        onChange={e => setFormData({ ...formData, Адрес: e.target.value })}
                                        placeholder="Адрес"
                                    />
                                    <div className="edit-buttons">
                                        <button onClick={handleProfileSave} className="save-btn">Сохранить</button>
                                        <button onClick={() => setEditing(false)} className="cancel-btn">Отмена</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2>{profile.Фамилия} {profile.Имя} {profile.Отчество || ''}</h2>
                                    <p className="profile-role">{profile.Должность}</p>
                                    <div className="profile-details-grid">
                                        <div><span>📞 Телефон:</span> {profile.Телефон || '—'}</div>
                                        <div><span>📧 Email:</span> {profile.Email || '—'}</div>
                                        <div><span>🏠 Адрес:</span> {profile.Адрес || '—'}</div>
                                        <div><span>🎂 Дата рождения:</span> {profile.Дата_рождения ? new Date(profile.Дата_рождения).toLocaleDateString() : '—'}</div>
                                        <div><span>💰 Оклад:</span> {profile.Оклад ? `${profile.Оклад} ₽` : '—'}</div>
                                        <div><span>🏢 Филиал:</span> {profile.Филиал || '—'}</div>
                                    </div>
                                    <button className="edit-profile-btn" onClick={() => setEditing(true)}>✏️ Редактировать</button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* График работы */}
                {activeTab === 'schedule' && (
                    <div className="schedule-content">
                        {renderCompactCalendar()}
                    </div>
                )}

                {/* План занятий */}
                {activeTab === 'lessons' && isTeacher && (
                    <div className="lessons-content">
                        {/* Форма создания */}
                        <div className="create-lesson-card">
                            <h3>➕ Создать новое занятие</h3>
                            <form onSubmit={handleCreateLesson}>
                                <div className="form-row">
                                    <select
                                        required
                                        value={newLesson.group_id}
                                        onChange={e => setNewLesson({ ...newLesson, group_id: e.target.value })}
                                    >
                                        <option value="">📚 Выберите группу</option>
                                        {myGroups.map(g => (
                                            <option key={g.ID_Группы} value={g.ID_Группы}>
                                                {g.Название_Группы}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        required
                                        value={newLesson.lesson_type_id}
                                        onChange={e => setNewLesson({ ...newLesson, lesson_type_id: e.target.value })}
                                    >
                                        <option value="">🎯 Тип занятия</option>
                                        {lessonTypes.map(t => (
                                            <option key={t.ID_Типа_занятия} value={t.ID_Типа_занятия}>
                                                {t.Название_типа}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder="📖 Тема занятия"
                                    required
                                    value={newLesson.topic}
                                    onChange={e => setNewLesson({ ...newLesson, topic: e.target.value })}
                                />

                                <div className="form-row">
                                    <input
                                        type="date"
                                        required
                                        value={newLesson.date}
                                        onChange={e => setNewLesson({ ...newLesson, date: e.target.value })}
                                    />
                                    <div className="time-input-wrapper">
                                        <input
                                            type="time"
                                            required
                                            value={newLesson.time_start}
                                            onChange={e => setNewLesson({ ...newLesson, time_start: e.target.value })}
                                        />
                                        <span className="time-hint">⏰ время начала</span>
                                    </div>
                                    <div className="duration-input-wrapper">
                                        <input
                                            type="number"
                                            placeholder="30"
                                            value={newLesson.duration_minutes}
                                            onChange={e => setNewLesson({ ...newLesson, duration_minutes: parseInt(e.target.value) || 30 })}
                                        />
                                        <span className="duration-hint">⏱️ минут</span>
                                    </div>
                                </div>

                                <button type="submit" className="create-btn">➕ Добавить занятие</button>
                            </form>
                        </div>

                        {/* Список занятий */}
                        <div className="lessons-list">
                            <h3>📋 Мои планы занятий</h3>
                            {lessonPlans.length === 0 ? (
                                <div className="empty-state">
                                    <p>📭 Нет созданных занятий</p>
                                    <p className="hint">Используйте форму выше, чтобы добавить первое занятие</p>
                                </div>
                            ) : (
                                <div className="lessons-grid">
                                    {lessonPlans.map(plan => (
                                        <div key={plan.ID_Плана} className="lesson-card">
                                            <div className="lesson-header">
                                                <span className="lesson-type">{plan.Название_типа}</span>
                                                <button className="delete-lesson-btn" onClick={() => handleDeleteLesson(plan.ID_Плана)}>🗑️</button>
                                            </div>
                                            <div className="lesson-topic">{plan.Тема_занятия}</div>
                                            <div className="lesson-meta">
                                                <span>📅 {new Date(plan.Дата).toLocaleDateString()}</span>
                                                <span>⏰ {plan.Время_начала?.slice(0, 5)}</span>
                                                <span>⏱️ {plan.Длительность_минут} мин</span>
                                                <span>🧒 {plan.Название_Группы}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}