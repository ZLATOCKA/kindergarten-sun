import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './styles/ParentDashboard.module.css';

const API_URL = 'http://localhost:5000/api';

function ParentDashboard() {
    const { user } = useAuth();
    const [child, setChild] = useState(null);
    const [relatives, setRelatives] = useState([]);
    const [individualLessons, setIndividualLessons] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [vaccinations, setVaccinations] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [childRes, familyRes, lessonsRes, paymentsRes, attendanceRes] = await Promise.all([
                    axios.get(`${API_URL}/children/my-child`),
                    axios.get(`${API_URL}/children/my-child/family-tree`),
                    axios.get(`${API_URL}/children/my-child/lessons`),
                    axios.get(`${API_URL}/children/my-child/payments`),
                    axios.get(`${API_URL}/children/my-child/attendance`),
                ]);
                setChild(childRes.data);
                setRelatives(familyRes.data.relatives || []);
                setIndividualLessons(lessonsRes.data);
                setPayments(paymentsRes.data);
                setAttendance(attendanceRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const loadModalData = async (type) => {
        try {
            if (type === 'certificates') {
                const res = await axios.get(`${API_URL}/children/my-child/certificates`);
                setCertificates(res.data);
            } else if (type === 'vaccinations') {
                const res = await axios.get(`${API_URL}/children/my-child/vaccinations`);
                setVaccinations(res.data);
            } else if (type === 'allergies') {
                const res = await axios.get(`${API_URL}/children/my-child/allergies`);
                setAllergies(res.data);
            }
            setActiveModal(type);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className={styles.parentContainer} style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
    if (!child) return <div className={styles.parentContainer} style={{ textAlign: 'center', padding: '50px' }}>Ребёнок не найден. Свяжитесь с администратором.</div>;

    const birthDate = new Date(child["Дата рождения"]);
    const age = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365));
    const totalToPay = individualLessons.reduce((sum, l) => sum + (l.price || 0), 0);

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
                    <div className={styles.childCard} onClick={() => setActiveModal('child')}>
                        <div className={styles.childPhoto}>👧</div>
                        <div className={styles.childName}>{child.Фамилия} {child.Имя}</div>
                        <div className={styles.childDetails}>{age} лет, группа «{child.Название_Группы}»</div>
                    </div>

                    <div>
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

                    <div>
                        <div className={styles.sectionTitle}>💰 Индивидуальные занятия</div>
                        <div className={styles.lessonsGrid}>
                            {individualLessons.map(lesson => (
                                <div key={lesson.ID_Занятия} className={styles.lessonCard}>
                                    <div className={styles.lessonName}>{lesson.Название}</div>
                                    <div>📅 {lesson.Дата_проведения || 'дата не указана'}</div>
                                    <div className={styles.lessonPrice}>{lesson.Стоимость} ₽</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Итого к оплате: {totalToPay} ₽</div>
                    </div>

                    <div>
                        <div className={styles.sectionTitle}>💳 Мои платежи</div>
                        <div className={styles.paymentsGrid}>
                            {payments.map(p => (
                                <div key={p.ID_Платежа} className={styles.paymentCard}>
                                    <div>Занятие: {p.Название || '—'}</div>
                                    <div>Сумма: {p.Сумма} ₽</div>
                                    <div>Статус: {p.Статус}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Модальное окно с подробной информацией о ребёнке */}
            {activeModal === 'child' && (
                <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
                        <h2>{child.Фамилия} {child.Имя}</h2>
                        <p>Возраст: {age} лет</p>
                        <p>Группа: {child.Название_Группы}</p>

                        <div className={styles.sectionTitle}>📄 Справки</div>
                        <button className={styles.detailsBtn} onClick={() => loadModalData('certificates')}>Подробнее →</button>

                        <div className={styles.sectionTitle}>💉 Прививки</div>
                        <button className={styles.detailsBtn} onClick={() => loadModalData('vaccinations')}>Подробнее →</button>

                        <div className={styles.sectionTitle}>🌿 Аллергии</div>
                        <button className={styles.detailsBtn} onClick={() => loadModalData('allergies')}>Подробнее →</button>

                        <div className={styles.sectionTitle}>📅 Посещаемость</div>
                        <button className={styles.detailsBtn} onClick={() => setActiveModal('attendance')}>Подробнее →</button>
                    </div>
                </div>
            )}

            {activeModal === 'certificates' && (
                <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
                        <h3>Справки ребёнка</h3>
                        <table className={styles.dataTable}>
                            <thead><tr><th>Тип</th><th>Дата начала</th><th>Дата окончания</th></tr></thead>
                            <tbody>
                                {certificates.map(c => (
                                    <tr key={c.ID_Справки}>
                                        <td>{c.Тип_справка}</td>
                                        <td>{new Date(c.Дата_начала).toLocaleDateString('ru-RU')}</td>
                                        <td>{new Date(c.Дата_окончания).toLocaleDateString('ru-RU')}</td>
                                    </tr>
                                ))}
                                {certificates.length === 0 && <tr><td colSpan="3">Нет данных</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeModal === 'vaccinations' && (
                <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
                        <h3>Прививки ребёнка</h3>
                        <table className={styles.dataTable}>
                            <thead><tr><th>Название</th><th>Дата</th><th>Статус</th></tr></thead>
                            <tbody>
                                {vaccinations.map(v => (
                                    <tr key={v.ID_Записи_прививки}>
                                        <td>{v.Название_прививки}</td>
                                        <td>{new Date(v.Дата_проведения).toLocaleDateString('ru-RU')}</td>
                                        <td>{v.Статус}</td>
                                    </tr>
                                ))}
                                {vaccinations.length === 0 && <tr><td colSpan="3">Нет данных</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeModal === 'allergies' && (
                <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
                        <h3>Аллергии (запрещённые продукты)</h3>
                        <table className={styles.dataTable}>
                            <thead><tr><th>Продукт</th></tr></thead>
                            <tbody>
                                {allergies.map(a => (
                                    <tr key={a.ID_Продукта}>
                                        <td>{a.Название_продукта}</td>
                                    </tr>
                                ))}
                                {allergies.length === 0 && <tr><td>Нет данных</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeModal === 'attendance' && (
                <div className={styles.modalOverlay} onClick={() => setActiveModal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
                        <h3>Посещаемость</h3>
                        <table className={styles.dataTable}>
                            <thead><tr><th>Дата</th><th>Время прихода</th><th>Время ухода</th></tr></thead>
                            <tbody>
                                {attendance.map(a => (
                                    <tr key={a.Дата}>
                                        <td>{new Date(a.Дата).toLocaleDateString('ru-RU')}</td>
                                        <td>{a.Время_прихода?.slice(0, 5)}</td>
                                        <td>{a.Время_ухода?.slice(0, 5)}</td>
                                    </tr>
                                ))}
                                {attendance.length === 0 && <tr><td colSpan="3">Нет данных</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParentDashboard;