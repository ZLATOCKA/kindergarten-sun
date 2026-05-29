import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './styles/ParentDashboard.css';

const API_URL = 'http://localhost:5000/api';

function ParentDashboard() {
    const { logout, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [profileForm, setProfileForm] = useState({});
    const [editingProfile, setEditingProfile] = useState(false);
    const [children, setChildren] = useState([]);
    const [relatives, setRelatives] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [availableLessons, setAvailableLessons] = useState([]);
    const [childLessons, setChildLessons] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [medicalData, setMedicalData] = useState({ certificates: [], vaccinations: [], allergies: [] });
    const [attendance, setAttendance] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showCertificatesModal, setShowCertificatesModal] = useState(false);
    const [showVaccinationsModal, setShowVaccinationsModal] = useState(false);
    const [showAllergiesModal, setShowAllergiesModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [profileRes, childrenRes, familyRes, lessonsRes] = await Promise.all([
                    axios.get(`${API_URL}/parent/profile`, { headers }),
                    axios.get(`${API_URL}/parent/my-children`, { headers }),
                    axios.get(`${API_URL}/parent/family-tree`, { headers }),
                    axios.get(`${API_URL}/parent/available-lessons`, { headers })
                ]);

                setProfile(profileRes.data);
                setProfileForm(profileRes.data || {});
                setChildren(childrenRes.data || []);
                setRelatives(familyRes.data.relatives || []);
                setAvailableLessons(lessonsRes.data || []);

                if (childrenRes.data && childrenRes.data.length > 0) {
                    const firstChildId = childrenRes.data[0].id;
                    setSelectedChildId(firstChildId);
                    await loadChildData(firstChildId);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const loadChildData = async (childId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [lessonsRes, medicalRes, attendanceRes, costRes] = await Promise.all([
                axios.get(`${API_URL}/parent/child-lessons/${childId}`, { headers }),
                axios.get(`${API_URL}/parent/child-medical/${childId}`, { headers }),
                axios.get(`${API_URL}/parent/child-attendance/${childId}`, { headers }),
                axios.get(`${API_URL}/parent/total-cost/${childId}`, { headers })
            ]);

            setChildLessons(lessonsRes.data || []);
            setMedicalData(medicalRes.data || { certificates: [], vaccinations: [], allergies: [] });
            setAttendance(attendanceRes.data || []);
            setTotalCost(costRes.data.total || 0);
        } catch (err) {
            console.error('Load child data error:', err);
        }
    };

    const handleProfileSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/parent/profile`, profileForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(profileForm);
            setEditingProfile(false);
            alert('Профиль обновлён');
        } catch (err) {
            alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleBookLesson = async () => {
        if (!selectedLesson || !bookingDate || !selectedChildId) {
            alert('Выберите занятие и дату');
            return;
        }

        const lesson = availableLessons.find(l => l.id === parseInt(selectedLesson));
        if (!lesson) {
            alert('Занятие не найдено');
            return;
        }

        const dateObj = new Date(bookingDate);
        const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const selectedDayOfWeek = daysOfWeek[dateObj.getDay()];

        if (lesson.День_недели !== selectedDayOfWeek) {
            alert(`Это занятие проводится по ${lesson.День_недели}. Выбранный день - ${selectedDayOfWeek}. Пожалуйста, выберите правильную дату.`);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(`${API_URL}/parent/book-lesson`,
                { child_id: selectedChildId, lesson_id: selectedLesson, date: bookingDate },
                { headers }
            );
            alert('✅ Запись успешно оформлена!');
            setShowBooking(false);
            setSelectedLesson('');
            setBookingDate('');
            await loadChildData(selectedChildId);
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка записи');
        }
    };

    // Исправленная функция отмены записи
    const handleCancelLesson = async (lessonId, date) => {
        console.log('Cancel attempt:', { lessonId, date, selectedChildId });

        if (!window.confirm('Отменить запись на занятие?')) return;

        try {
            const token = localStorage.getItem('token');

            // Форматируем дату правильно
            const formattedDate = new Date(date).toISOString().split('T')[0];

            console.log('Sending DELETE request to:', `${API_URL}/parent/cancel-lesson/${selectedChildId}/${lessonId}/${formattedDate}`);

            const response = await axios.delete(
                `${API_URL}/parent/cancel-lesson/${selectedChildId}/${lessonId}/${formattedDate}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Cancel response:', response.data);

            if (response.data.success) {
                alert('❌ Запись отменена');
                // Перезагружаем данные ребёнка
                await loadChildData(selectedChildId);
            } else {
                alert('Ошибка при отмене');
            }
        } catch (err) {
            console.error('Cancel error FULL:', err);
            console.error('Cancel error response:', err.response?.data);
            alert('Ошибка отмены: ' + (err.response?.data?.error || err.message));
        }
    };

    const currentChild = children.find(c => c.id === selectedChildId) || children[0];
    const birthDate = currentChild ? new Date(currentChild["Дата рождения"]) : null;
    const age = birthDate ? Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365)) : 0;
    const upcomingLessons = childLessons.filter(l => l.is_upcoming === true || l.is_upcoming === 1);

    if (loading) return <div className="loading-screen">Загрузка...</div>;
    if (error) return <div className="error-screen">Ошибка: {error}</div>;

    return (
        <div className="parent-dashboard">
            <div className="bg-gradient"></div>

            <div className="main-card">
                <div className="header">
                    <div className="header-left">
                        <div className="avatar">👩</div>
                        <div className="info">
                            {editingProfile ? (
                                <div className="edit-form">
                                    <input value={profileForm.Фамилия || ''} onChange={e => setProfileForm({ ...profileForm, Фамилия: e.target.value })} placeholder="Фамилия" />
                                    <input value={profileForm.Имя || ''} onChange={e => setProfileForm({ ...profileForm, Имя: e.target.value })} placeholder="Имя" />
                                    <input value={profileForm.Отчество || ''} onChange={e => setProfileForm({ ...profileForm, Отчество: e.target.value })} placeholder="Отчество" />
                                    <input value={profileForm.Адрес || ''} onChange={e => setProfileForm({ ...profileForm, Адрес: e.target.value })} placeholder="Адрес" />
                                    <input value={profileForm.Телефон || ''} onChange={e => setProfileForm({ ...profileForm, Телефон: e.target.value })} placeholder="Телефон" />
                                    <input value={profileForm.Email || ''} onChange={e => setProfileForm({ ...profileForm, Email: e.target.value })} placeholder="Email" />
                                    <div className="edit-buttons">
                                        <button className="btn-save" onClick={handleProfileSave}>Сохранить</button>
                                        <button className="btn-cancel" onClick={() => setEditingProfile(false)}>Отмена</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2>{profile?.Фамилия} {profile?.Имя} {profile?.Отчество}</h2>
                                    <p className="role">👩‍👧 {profile?.Степень_родства || 'Родитель'}</p>
                                    <p className="contact">📞 {profile?.Телефон}</p>
                                    <p className="contact">✉️ {profile?.Email}</p>
                                    <p className="contact">📍 {profile?.Адрес}</p>
                                    <button className="btn-edit" onClick={() => setEditingProfile(true)}>✏️ Редактировать профиль</button>
                                </>
                            )}
                        </div>
                    </div>
                    <button className="btn-logout" onClick={logout}>🚪 Выйти</button>
                </div>

                {children.length > 0 && (
                    <div className="child-selector">
                        <span className="selector-label">👶 Выберите ребёнка:</span>
                        <select value={selectedChildId || ''} onChange={(e) => {
                            setSelectedChildId(parseInt(e.target.value));
                            loadChildData(parseInt(e.target.value));
                        }}>
                            {children.map(child => (
                                <option key={child.id} value={child.id}>{child.Фамилия} {child.Имя}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="content">
                    <div className="left-column">
                        <div className="card child-card">
                            <div className="card-icon">👧</div>
                            <div className="card-body">
                                <h3>{currentChild?.Фамилия} {currentChild?.Имя} {currentChild?.Отчество}</h3>
                                <p>🎂 {birthDate ? birthDate.toLocaleDateString() : '—'} ({age} лет)</p>
                                <p>👥 Группа: {currentChild?.Группа || '—'}</p>
                                <p>🏢 Филиал: {currentChild?.Филиал || '—'}</p>
                            </div>
                        </div>

                        <div className="card family-card">
                            <div className="card-icon">👨‍👩‍👧‍👦</div>
                            <div className="card-body">
                                <h3>Моя семья</h3>
                                <div className="family-list">
                                    {relatives.map((rel, idx) => (
                                        <div key={idx} className="family-item">
                                            <span className="family-avatar">👤</span>
                                            <div>
                                                <div className="family-name">{rel.Фамилия} {rel.Имя}</div>
                                                <div className="family-role">{rel.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card total-card">
                            <div className="card-icon">💰</div>
                            <div className="card-body">
                                <h3>Итого к оплате</h3>
                                <div className="total-amount">{totalCost.toLocaleString()} ₽</div>
                            </div>
                        </div>

                        <button className="btn-book" onClick={() => setShowBooking(true)}>➕ Записаться на занятие</button>
                    </div>

                    <div className="right-column">
                        <div className="card lessons-card">
                            <div className="card-icon">📅</div>
                            <div className="card-body">
                                <h3>Ближайшие занятия</h3>
                                {upcomingLessons.length === 0 ? (
                                    <p className="empty-text">Нет запланированных занятий</p>
                                ) : (
                                    upcomingLessons.map((lesson, idx) => (
                                        <div key={idx} className="lesson-item">
                                            <div className="lesson-info">
                                                <div className="lesson-name">{lesson.Название}</div>
                                                <div className="lesson-details">
                                                    <span>📅 {new Date(lesson.date).toLocaleDateString()}</span>
                                                    <span>👩‍🏫 {lesson.teacher}</span>
                                                    <span>💰 {lesson.Стоимость} ₽</span>
                                                </div>
                                            </div>
                                            <button className="btn-cancel-lesson" onClick={() => handleCancelLesson(lesson.lesson_id, lesson.date)}>✕ Отменить</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="card medical-card">
                            <div className="card-icon">🏥</div>
                            <div className="card-body">
                                <h3>Медицинская информация</h3>
                                <div className="medical-row" onClick={() => setShowCertificatesModal(true)} style={{ cursor: 'pointer' }}>
                                    <span>📄 Справки ({medicalData.certificates.length})</span>
                                    <span className="medical-count">Подробнее →</span>
                                </div>
                                <div className="medical-row" onClick={() => setShowVaccinationsModal(true)} style={{ cursor: 'pointer' }}>
                                    <span>💉 Прививки ({medicalData.vaccinations.length})</span>
                                    <span className="medical-count">Подробнее →</span>
                                </div>
                                <div className="medical-row" onClick={() => setShowAllergiesModal(true)} style={{ cursor: 'pointer' }}>
                                    <span>🌿 Аллергии ({medicalData.allergies.length})</span>
                                    <span className="medical-count">Подробнее →</span>
                                </div>
                            </div>
                        </div>

                        <div className="card attendance-card">
                            <div className="card-icon">📊</div>
                            <div className="card-body">
                                <h3>Посещаемость</h3>
                                {attendance.length === 0 ? (
                                    <p className="empty-text">Нет данных</p>
                                ) : (
                                    attendance.slice(0, 5).map((day, idx) => (
                                        <div key={idx} className="attendance-item">
                                            <span>{new Date(day.date).toLocaleDateString()}</span>
                                            <span>🕐 {day.arrival?.slice(0, 5) || '—'}</span>
                                            <span>🕖 {day.departure?.slice(0, 5) || '—'}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно для справок */}
            {showCertificatesModal && (
                <div className="modal-overlay" onClick={() => setShowCertificatesModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📄 Справки</h3>
                            <button className="modal-close" onClick={() => setShowCertificatesModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {medicalData.certificates.length === 0 ? (
                                <p>Нет данных о справках</p>
                            ) : (
                                medicalData.certificates.map((cert, idx) => (
                                    <div key={idx} className="medical-item">
                                        <strong>{cert.type}</strong>
                                        <p>📅 {new Date(cert.start_date).toLocaleDateString()} - {new Date(cert.end_date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для прививок */}
            {showVaccinationsModal && (
                <div className="modal-overlay" onClick={() => setShowVaccinationsModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>💉 Прививки</h3>
                            <button className="modal-close" onClick={() => setShowVaccinationsModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {medicalData.vaccinations.length === 0 ? (
                                <p>Нет данных о прививках</p>
                            ) : (
                                medicalData.vaccinations.map((vacc, idx) => (
                                    <div key={idx} className="medical-item">
                                        <strong>{vacc.name}</strong>
                                        <p>📅 {new Date(vacc.date).toLocaleDateString()}</p>
                                        <p>Статус: {vacc.status}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно для аллергий */}
            {showAllergiesModal && (
                <div className="modal-overlay" onClick={() => setShowAllergiesModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🌿 Аллергии</h3>
                            <button className="modal-close" onClick={() => setShowAllergiesModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {medicalData.allergies.length === 0 ? (
                                <p>Нет данных об аллергиях</p>
                            ) : (
                                medicalData.allergies.map((allergy, idx) => (
                                    <div key={idx} className="medical-item">
                                        <strong>🚫 {allergy.product}</strong>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно записи */}
            {showBooking && (
                <div className="modal-overlay" onClick={() => setShowBooking(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📝 Запись на занятие</h3>
                            <button className="modal-close" onClick={() => setShowBooking(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)}>
                                <option value="">Выберите занятие</option>
                                {availableLessons.map(l => (
                                    <option key={l.id} value={l.id}>
                                        {l.Название} – {l.Стоимость} ₽ ({l.День_недели}, {l.Время_начала?.slice(0, 5)})
                                    </option>
                                ))}
                            </select>
                            {selectedLesson && (
                                <div className="lesson-info-warning">
                                    ℹ️ Это занятие проводится по {availableLessons.find(l => l.id === parseInt(selectedLesson))?.День_недели}
                                </div>
                            )}
                            <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                            <button className="btn-confirm" onClick={handleBookLesson}>✅ Подтвердить запись</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParentDashboard;