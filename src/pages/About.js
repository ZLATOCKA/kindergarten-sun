import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FadeInSection from '../components/FadeInSection';
import styles from './styles/About.module.css';

const API_URL = 'http://localhost:5000/api';

function About() {
    const [activeTab, setActiveTab] = useState('teachers');
    const [teachers, setTeachers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${API_URL}/employees`);
                const allEmployees = response.data;

                // Разделяем на педагогов и администрацию
                const teacherList = allEmployees.filter(emp =>
                    emp.Должность?.includes('Воспитатель') ||
                    emp.Должность?.includes('Педагог') ||
                    emp.Должность?.includes('Инструктор') ||
                    emp.Должность?.includes('Музыкальный') ||
                    emp.Должность?.includes('Логопед') ||
                    emp.Должность?.includes('Психолог')
                );

                const adminList = allEmployees.filter(emp =>
                    emp.Должность?.includes('Заведующий') ||
                    emp.Должность?.includes('Методист') ||
                    emp.Должность?.includes('Администратор') ||
                    emp.Должность?.includes('Медицинская')
                );

                setTeachers(teacherList.slice(0, 6));
                setAdmins(adminList.slice(0, 4));
            } catch (err) {
                console.error('Ошибка загрузки сотрудников:', err);
                // Данные по умолчанию, если сервер не работает
                setTeachers([
                    { Фамилия: 'Спиридонова', Имя: 'Татьяна', Отчество: 'Леонидовна', Должность: 'Воспитатель группы "Зайчата"', Филиал: 'Главный корпус' },
                    { Фамилия: 'Магнетина', Имя: 'Светлана', Отчество: 'Вениаминовна', Должность: 'Воспитатель группы "Пчёлки"', Филиал: 'Филиал на Лиственной' },
                    { Фамилия: 'Михалева', Имя: 'Мария', Отчество: 'Максимовна', Должность: 'Педагог по физической культуре', Филиал: 'Главный корпус' },
                    { Фамилия: 'Антонова', Имя: 'Елена', Отчество: 'Владимировна', Должность: 'Музыкальный руководитель', Филиал: 'Главный корпус' },
                    { Фамилия: 'Соколова', Имя: 'Наталья', Отчество: 'Петровна', Должность: 'Логопед', Филиал: 'Филиал на Лиственной' },
                    { Фамилия: 'Морозова', Имя: 'Ольга', Отчество: 'Александровна', Должность: 'Педагог-психолог', Филиал: 'Главный корпус' }
                ]);
                setAdmins([
                    { Фамилия: 'Смирнова', Имя: 'Анна', Отчество: 'Ивановна', Должность: 'Заведующий детским садом', Филиал: 'Главный корпус' },
                    { Фамилия: 'Кузнецова', Имя: 'Марина', Отчество: 'Сергеевна', Должность: 'Методист', Филиал: 'Главный корпус' },
                    { Фамилия: 'Волкова', Имя: 'Екатерина', Отчество: 'Андреевна', Должность: 'Администратор', Филиал: 'Филиал на Лиственной' },
                    { Фамилия: 'Петрова', Имя: 'Ольга', Отчество: 'Дмитриевна', Должность: 'Медицинская сестра', Филиал: 'Главный корпус' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const currentTeam = activeTab === 'teachers' ? teachers : admins;

    return (
        <div className={styles.aboutPage}>
            {/* Блок 1: Наша миссия и философия */}
            <section className={styles.missionSection}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <FadeInSection>
                            <div className={styles.missionCard}>
                                <div className={styles.missionYears}>20+ лет</div>
                                <div className={styles.missionText}>Профессиональных педагогов и опыта работы</div>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={150}>
                            <div className={styles.aboutRight}>
                                <div className={styles.aboutTitle}>О саде</div>
                                <h2 className={styles.aboutHeading}>Добро пожаловать в «Солнышко»</h2>
                                <p className={styles.aboutDescription}>
                                    Здесь закладывается фундамент знаний и развиваются юные таланты.
                                    Мы создаём пространство, где каждый ребёнок чувствует себя любимым
                                    и защищённым, а каждый день приносит новые открытия.
                                </p>
                                <p className={styles.aboutDescription}>
                                    Наш подход основан на любви, уважении и индивидуальном внимании
                                    к каждому маленькому человеку.
                                </p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Блок 2: О нас подробное описание */}
            <section className={styles.descriptionSection}>
                <div className="container">
                    <FadeInSection>
                        <h1 className={styles.descriptionTitle}>О нас</h1>
                        <p className={styles.descriptionText}>
                            «Солнышко» — мы создаём будущее! Наш детский сад принимает детей
                            от 1,5 до 7 лет. Мы предлагаем непрерывную образовательную программу,
                            которая охватывает все этапы развития ребёнка: от первых шагов
                            до подготовки к школе.
                        </p>
                        <h3 style={{ fontSize: '24px', marginTop: '30px', marginBottom: '20px' }}>
                            Нам есть, что вам предложить:
                        </h3>
                        <ul className={styles.featuresList}>
                            <li>Группа полного пребывания (7:30 – 19:30)</li>
                            <li>Гибкие абонементы</li>
                            <li>Занятия «Мама и малыш»</li>
                            <li>Театральная студия</li>
                            <li>Рисование и ИЗО</li>
                            <li>Футбол и физкультура</li>
                            <li>Английский язык в игровой форме</li>
                            <li>Логопед и психолог</li>
                        </ul>
                    </FadeInSection>
                </div>
            </section>

            {/* Блок 3: Преимущества и лицензия */}
            <section className={styles.advantagesSection}>
                <div className="container">
                    <div className={styles.advantagesGrid}>
                        <FadeInSection delay={100}>
                            <div className={`${styles.advantageCard} ${styles.advantageCardPurple}`}>
                                <span className={styles.advantageTag}>Лицензированная школа</span>
                                <div>
                                    <img
                                        src="/images/about/license-bg.jpg"
                                        alt="Педагог с ребенком"
                                        className={styles.advantageImage}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                    <div className={styles.advantageTitle}>Государственная лицензия</div>
                                    <p className={styles.advantageText}>
                                        Наш детский сад лицензирован, а родителям предоставляется возможность
                                        оплаты занятий материнским капиталом.
                                    </p>
                                    <ul className={styles.advantageList}>
                                        <li>Ежемесячные сезонные мероприятия</li>
                                        <li>Формат «Школы полного дня»</li>
                                        <li>Расширяемая база знаний для ребенка</li>
                                    </ul>
                                </div>
                            </div>
                        </FadeInSection>

                        <FadeInSection delay={200}>
                            <div className={`${styles.advantageCard} ${styles.advantageCardCoral}`}>
                                <span className={styles.advantageTag}>Особый подход</span>
                                <div>
                                    <div className={styles.advantageTitle}>По-настоящему гибкий подход к каждому ребенку</div>
                                    <ul className={styles.advantageList}>
                                        <li>Комфортная среда</li>
                                        <li>Гибкий график занятий</li>
                                        <li>Индивидуальные программы</li>
                                        <li>Забота и поддержка для каждого ребенка</li>
                                    </ul>
                                    <img
                                        src="/images/about/approach-bg.jpg"
                                        alt="Педагог с ребенком"
                                        className={styles.advantageImage}
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Блок 4: Наша команда */}
            <section className={styles.teamSection}>
                <div className="container">
                    <FadeInSection>
                        <h2 className={styles.teamTitle}>Наша команда</h2>
                    </FadeInSection>

                    <div className={styles.teamTabs}>
                        <button
                            className={`${styles.teamTab} ${activeTab === 'teachers' ? styles.active : ''}`}
                            onClick={() => setActiveTab('teachers')}
                        >
                            Педагоги
                        </button>
                        <button
                            className={`${styles.teamTab} ${activeTab === 'admins' ? styles.active : ''}`}
                            onClick={() => setActiveTab('admins')}
                        >
                            Администрация
                        </button>
                    </div>

                    <div className={styles.teamGrid}>
                        {!loading && currentTeam.map((member, index) => (
                            <FadeInSection key={index} delay={index * 100}>
                                <div className={styles.teamCard}>
                                    <img
                                        src={`/images/about/${activeTab === 'teachers' ? 'teacher' : 'admin'}${index + 1}.jpg`}
                                        alt={`${member.Фамилия} ${member.Имя}`}
                                        className={styles.teamPhoto}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/280x280?text=Фото';
                                        }}
                                    />
                                    <div className={styles.teamInfo}>
                                        <h3 className={styles.teamName}>
                                            {member.Фамилия} {member.Имя} {member.Отчество || ''}
                                        </h3>
                                        <p className={styles.teamPosition}>{member.Должность}</p>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;