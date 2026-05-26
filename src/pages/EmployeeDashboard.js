import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/EmployeeDashboard.module.css';

const API_URL = 'http://localhost:5000/api';

function EmployeeDashboard() {
    const [profile, setProfile] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [vacations, setVacations] = useState([]);
    const [individualLessons, setIndividualLessons] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [loading, setLoading] = useState(true);
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
                const [profileRes, scheduleRes, vacationsRes, lessonsRes] = await Promise.all([
                    axios.get(`${API_URL}/employees/my-profile`, { headers }),
                    axios.get(`${API_URL}/employees/my-schedule`, { headers }),
                    axios.get(`${API_URL}/employees/my-vacations`, { headers }),
                    axios.get(`${API_URL}/employees/my-individual-lessons`, { headers }),
                ]);
                setProfile(profileRes.data);
                setSchedule(scheduleRes.data);
                setVacations(vacationsRes.data);
                setIndividualLessons(lessonsRes.data);
            } catch (err) {
                console.error('Ошибка загрузки данных сотрудника:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const isWeekend = (day) => {
        const date = new Date(year, month, day);
        return date.getDay() === 0 || date.getDay() === 6;
    };
    const isVacation = (day) => {
        const date = new Date(year, month, day);
        return vacations.some(v => new Date(v.start) <= date && new Date(v.end) >= date);
    };
    const isWorkDay = (day) => {
        const date = new Date(year, month, day);
        return schedule.some(s => new Date(s.Дата).toDateString() === date.toDateString());
    };
    const getDayClass = (day) => {
        if (isVacation(day)) return styles.vacation;
        if (isWeekend(day)) return styles.weekend;
        if (isWorkDay(day)) return styles.work;
        return '';
    };

    if (loading) return <div className={styles.employeeContainer} style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
    if (error) return <div className={styles.employeeContainer} style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Ошибка: {error}</div>;
    if (!profile) return <div className={styles.employeeContainer} style={{ textAlign: 'center', padding: '50px' }}>Данные не найдены. Проверьте, что у сотрудника заполнены должность и филиал.</div>;

    return (
        <div className={styles.employeeContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.profileHeaderContent}>
                        <div className={styles.employeeAvatar}>{profile.Имя?.[0]}{profile.Фамилия?.[0]}</div>
                        <div className={styles.profileName}>
                            <h2>{profile.Фамилия} {profile.Имя} {profile.Отчество || ''}</h2>
                            <p>{profile.Должность}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.profileInfo}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>Филиал</div>
                        <div className={styles.infoValue}>{profile.Филиал}</div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>Оклад</div>
                        <div className={styles.infoValue}>{profile.Оклад} ₽</div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>Телефон</div>
                        <div className={styles.infoValue}>{profile.Телефон}</div>
                    </div>
                </div>

                <div className={styles.calendar}>
                    <div className={styles.calendarHeader}>
                        <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>◀</button>
                        <h3>{currentMonth.toLocaleString('ru', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>▶</button>
                    </div>
                    <div className={styles.calendarWeekdays}>
                        <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
                    </div>
                    <div className={styles.calendarDays}>
                        {blanks.map((_, i) => <div key={i} className={styles.calendarDay}></div>)}
                        {daysArray.map(day => (
                            <div key={day} className={`${styles.calendarDay} ${getDayClass(day)}`}>
                                {day}
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                        <span className={styles.work}>■</span> Рабочий день &nbsp;
                        <span className={styles.vacation}>■</span> Отпуск &nbsp;
                        <span className={styles.weekend}>■</span> Выходной
                    </div>
                </div>

                <div style={{ padding: '1rem' }}>
                    <h3>Мои индивидуальные занятия</h3>
                    <ul className={styles.individualLessonsList}>
                        {individualLessons.map(lesson => (
                            <li key={lesson.ID_Занятия}>
                                <span>{lesson.Название} — {lesson.День_недели}</span>
                                <span>{lesson.Стоимость} ₽</span>
                            </li>
                        ))}
                        {individualLessons.length === 0 && <li>Нет назначенных занятий</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;