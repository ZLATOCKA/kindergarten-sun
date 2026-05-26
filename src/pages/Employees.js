import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FadeInSection from '../components/FadeInSection';
import styles from './styles/Employees.module.css';

const API_URL = 'http://localhost:5000/api';

function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        axios.get(`${API_URL}/employees`)
            .then(res => {
                setEmployees(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className={styles.loading}>Загрузка...</div>;

    return (
        <>
            <section className={styles.hero}>
                <div className="container">
                    <FadeInSection>
                        <h1 className={styles.heroTitle}>Наши работники</h1>
                        <p className={styles.heroSubtitle}>Лучшие специалисты, которые заботятся о ваших детях</p>
                    </FadeInSection>
                </div>
            </section>

            <section className="container section">
                <div className={styles.grid}>
                    {employees.map((emp, index) => (
                        <FadeInSection key={emp.ID_Сотрудника} delay={index * 100}>
                            <div className={styles.card} onClick={() => setSelectedEmployee(emp)}>
                                <div className={styles.avatar}>
                                    {emp.Имя?.[0]}{emp.Фамилия?.[0]}
                                </div>
                                <h3>{emp.Фамилия} {emp.Имя}</h3>
                                <p className={styles.position}>{emp.Должность}</p>
                                <div className={styles.badge}>{emp.Филиал}</div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </section>

            {selectedEmployee && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEmployee(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setSelectedEmployee(null)}>✕</button>
                        <div className={styles.modalContent}>
                            <div className={styles.modalAvatar}>
                                {selectedEmployee.Имя?.[0]}{selectedEmployee.Фамилия?.[0]}
                            </div>
                            <h2>{selectedEmployee.Фамилия} {selectedEmployee.Имя}</h2>
                            <p><strong>Должность:</strong> {selectedEmployee.Должность}</p>
                            <p><strong>Филиал:</strong> {selectedEmployee.Филиал}</p>
                            <p><strong>Телефон:</strong> {selectedEmployee.Телефон}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Employees;