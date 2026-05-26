import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './styles/ParentDashboard.module.css';

const API_URL = 'http://localhost:5000/api';

function ParentDashboard() {
    const { user } = useAuth();
    const [child, setChild] = useState(null);
    const [relatives, setRelatives] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [myLessons, setMyLessons] = useState([]); // занятия, на которые записан ребёнок
    const [payments, setPayments] = useState([]);
    const [paidLessons, setPaidLessons] = useState([]); // доступные для записи
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState('');
    const [bookingDate, setBookingDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const [childRes, familyRes, certsRes, vaccRes, allergRes, attendRes, myLessRes, paysRes, paidLessRes] = await Promise.all([
                    axios.get(`${API_URL}/children/my-child`, { headers }),
                    axios.get(`${API_URL}/children/my-child/family-tree`, { headers }),
                    axios.get(`${API_URL}/children/my-child/certificates`, { headers }),
                    axios.get(`${API_URL}/children/my-child/vaccinations`, { headers }),
                    axios.get(`${API_URL}/children/my-child/allergies`, { headers }),
                    axios.get(`${API_URL}/children/my-child/attendance`, { headers }),
                    axios.get(`${API_URL}/children/my-child/lessons`, { headers }),
                    axios.get(`${API_URL}/children/my-payments`, { headers }),
                    axios.get(`${API_URL}/children/paid-lessons`, { headers }),
                ]);
                setChild(childRes.data);
                setRelatives(familyRes.data.relatives || []);
                setCertificates(certsRes.data);
                setVaccinations(vaccRes.data);
                setAllergies(allergRes.data);
                setAttendance(attendRes.data);
                setMyLessons(myLessRes.data);
                setPayments(paysRes.data);
                setPaidLessons(paidLessRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBookLesson = async () => {
        if (!selectedLesson || !bookingDate) {
            alert('Выберите занятие и дату');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            await axios.post(`${API_URL}/children/register-lesson`, { lessonId: selectedLesson, date: bookingDate }, { headers });
            alert('Запись успешно оформлена!');
            setShowBooking(false);
            setSelectedLesson('');
            setBookingDate('');
            // Обновить список занятий ребёнка
            const updated = await axios.get(`${API_URL}/children/my-child/lessons`, { headers });
            setMyLessons(updated.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Ошибка записи');
        }
    };

    if (loading) return <div className={styles.parentContainer} style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
    if (!child) return <div className={styles.parentContainer} style={{ textAlign: 'center', padding: '50px' }}>Ребёнок не найден. Свяжитесь с администратором.</div>;

    const birthDate = new Date(child["Дата рождения"]);
    const age = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365));
    const totalToPay = myLessons.reduce((sum, l) => sum + (l.Стоимость || 0), 0);

    return (
        <div className={styles.parentContainer}>
            <div className={styles.parentCard}>
                <div className={styles.parentHeader}>
                    <div className={styles.parentHeaderContent}>
                        <div className={styles.parentAvatar}>👩</div>
                        <div className={styles.parentName}>
                            <h2>{user?.name}</h2>
                            <p>Мама</p>
                        </div>
                        <div className={styles.contactInfo}>
                            <div>📞 +7 (900) 123-45-67</div>
                            <div>✉️ {user?.email}</div>
                            <div>📍 г. Москва, ул. Солнечная, 12</div>
                        </div>
                    </div>
                </div>
                <div className={styles.parentBody}>
                    {/* Левая колонка */}
                    <div>
                        <div className={styles.childCard}>
                            <div className={styles.childPhoto}>👧</div>
                            <div className={styles.childName}>{child.Фамилия} {child.Имя}</div>
                            <div className={styles.childDetails}>{age} лет, группа «{child.Название_Группы}»</div>
                            <button className={styles.detailsBtn} onClick={() => alert('Детальная информация будет позже')}>Информация о ребёнке →</button>
                        </div>

                        <div className={styles.familyCard}>
                            <div className={styles.familyTitle}>Моя семья</div>
                            <div className={styles.familyGrid}>
                                {relatives.map((rel, idx) => (
                                    <div key={idx} className={styles.relativeCard}>
                                        <div className={styles.relativeAvatar}>{rel.Имя?.[0] || '?'}</div>
                                        <div className={styles.relativeInfo}>
                                            <strong>{rel.Фамилия} {rel.Имя}</strong>
                                            <span>{rel.Статус}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.lessonsCard}>
                            <div className={styles.sectionTitle}>💰 Индивидуальные занятия (ребёнка)</div>
                            <div className={styles.lessonsGrid}>
                                {myLessons.map(l => (
                                    <div key={l.ID_Занятия} className={styles.lessonCard}>
                                        <span className={styles.lessonName}>{l.Название}</span>
                                        <span className={styles.lessonPrice}>{l.Стоимость} ₽</span>
                                    </div>
                                ))}
                                {myLessons.length === 0 && <p>Нет записей</p>}
                            </div>
                            <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Итого к оплате: {totalToPay} ₽</div>
                            <button className={styles.detailsBtn} onClick={() => setShowBooking(true)}>+ Записаться на новое занятие</button>
                        </div>

                        <div className={styles.paymentsCard}>
                            <div className={styles.sectionTitle}>💳 Мои платежи</div>
                            <div className={styles.paymentsGrid}>
                                {payments.map(p => (
                                    <div key={p.ID_Платежа} className={styles.paymentCard}>
                                        <span className={styles.paymentName}>{p.lesson_name || 'Занятие'}</span>
                                        <span className={styles.paymentAmount}>{p.Сумма} ₽</span>
                                        <span style={{ fontSize: '0.8rem', color: p.Статус === 'Оплачен' ? 'green' : 'orange' }}>{p.Статус}</span>
                                    </div>
                                ))}
                                {payments.length === 0 && <p>Нет платежей</p>}
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка – краткая информация о справках, прививках, аллергиях, посещаемости */}
                    <div>
                        <div className={styles.childCard} style={{ marginBottom: '1rem' }}>
                            <div className={styles.sectionTitle}>📄 Справки</div>
                            {certificates.slice(0, 2).map(c => (
                                <div key={c.ID_Справки} className={styles.lessonCard}>{c.Тип_справка} ({new Date(c.Дата_начала).toLocaleDateString()})</div>
                            ))}
                            <button className={styles.detailsBtn} onClick={() => alert('Все справки')}>Подробнее →</button>
                        </div>
                        <div className={styles.childCard} style={{ marginBottom: '1rem' }}>
                            <div className={styles.sectionTitle}>💉 Прививки</div>
                            {vaccinations.slice(0, 2).map(v => (
                                <div key={v.ID_Записи_прививки} className={styles.lessonCard}>{v.Название_прививки} – {v.Статус}</div>
                            ))}
                            <button className={styles.detailsBtn} onClick={() => alert('Все прививки')}>Подробнее →</button>
                        </div>
                        <div className={styles.childCard} style={{ marginBottom: '1rem' }}>
                            <div className={styles.sectionTitle}>🌿 Аллергии</div>
                            {allergies.map(a => (
                                <div key={a.ID_Продукта} className={styles.lessonCard}>🚫 {a.Название_продукта}</div>
                            ))}
                            <button className={styles.detailsBtn} onClick={() => alert('Все аллергии')}>Подробнее →</button>
                        </div>
                        <div className={styles.childCard}>
                            <div className={styles.sectionTitle}>📅 Посещаемость</div>
                            {attendance.slice(0, 3).map(a => (
                                <div key={a.Дата} className={styles.lessonCard}>{new Date(a.Дата).toLocaleDateString()} – {a.Время_прихода?.slice(0, 5)}</div>
                            ))}
                            <button className={styles.detailsBtn} onClick={() => alert('Вся посещаемость')}>Подробнее →</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Модалка записи на платное занятие */}
            {showBooking && (
                <div className={styles.modalOverlay} onClick={() => setShowBooking(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setShowBooking(false)}>✕</button>
                        <h3>Запись на платное занятие</h3>
                        <select
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        >
                            <option value="">Выберите занятие</option>
                            {paidLessons.map(l => (
                                <option key={l.ID_Занятия} value={l.ID_Занятия}>
                                    {l.Название} – {l.Стоимость} ₽ ({l.День_недели}, {l.Время_начала?.slice(0, 5)})
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                        <button onClick={handleBookLesson} className={styles.detailsBtn}>Записать</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParentDashboard;