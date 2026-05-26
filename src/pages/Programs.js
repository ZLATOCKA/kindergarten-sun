import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FadeInSection from '../components/FadeInSection';
import TestimonialSlider from '../components/TestimonialSlider';
import styles from './styles/Programs.module.css';

// Данные из вашего отчёта (таблица "Индивидуальные занятия")
const individualLessons = [
    { id: 1, name: 'Математика', duration: '45 мин', price: 800, age: '3-7 лет' },
    { id: 2, name: 'Музыка', duration: '45 мин', price: 800, age: '3-7 лет' },
    { id: 3, name: 'Английский язык', duration: '45 мин', price: 900, age: '4-7 лет' },
    { id: 4, name: 'Логопед', duration: '30 мин', price: 1000, age: '3-7 лет' },
    { id: 5, name: 'Рисование', duration: '45 мин', price: 700, age: '3-7 лет' },
    { id: 6, name: 'Хореография', duration: '45 мин', price: 800, age: '3-7 лет' },
    { id: 7, name: 'Подготовка к школе', duration: '60 мин', price: 900, age: '5-7 лет' },
];

// Данные для аккордеона FAQ
const faqData = [
    {
        question: 'Что такое семейное обучение?',
        answer: 'В нашей школе мы создаем идеальные условия для всестороннего развития детей, сочетая современные методики, лучшие программы и новейшие развивающие игрушки. Мы обеспечиваем безопасность, комфорт и здоровье каждого ребенка.'
    },
    {
        question: 'Какой будет режим дня?',
        answer: 'В школе полного дня мы работаем с 8:00 до 19:00.'
    },
    {
        question: 'Будут ли в школе прогулки?',
        answer: 'Да, у наших учеников предусмотрена часовая прогулка после обеда и вечерняя после ужина.'
    },
    {
        question: 'Будут ли у учеников форма и учебники?',
        answer: 'Да, у всех наших учеников будет единая форма. Учебники и форма будут доступны к заказу через наших администраторов.'
    },
    {
        question: 'Будет ли перерасчет по болезни?',
        answer: 'Перерасчеты не осуществляются.'
    },
    {
        question: 'У вас есть лицензия?',
        answer: 'Да, у нас есть лицензия на образовательную деятельность.'
    }
];

function Programs() {
    const [showModal, setShowModal] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

    const openModal = (lesson) => {
        setSelectedLesson(lesson);
        setShowModal(true);
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <>
            {/* Hero-блок с заголовком */}
            <section className={styles.programsHero}>
                <div className="container">
                    <FadeInSection>
                        <h1 className={styles.programsHeroTitle}>Наши программы</h1>
                        <p className={styles.programsHeroSubtitle}>Индивидуальный подход к каждому ребёнку</p>
                    </FadeInSection>
                </div>
            </section>

            {/* Блок "О школе" + карточки преимуществ в 2 колонки (как на arthello) */}
            <section className="container section">
                <div className={styles.aboutGrid}>
                    <FadeInSection>
                        <div className={styles.aboutText}>
                            <h2>О школе</h2>
                            <p>Добро пожаловать в детский сад «Солнышко». Здесь закладывается фундамент знаний и развиваются юные таланты.</p>
                            <p>Наша программа направлена на развитие творческих способностей и критического мышления у детей. Уделяя особое внимание индивидуальному обучению, мы обеспечиваем процветание каждого ребенка в благоприятной среде.</p>
                        </div>
                    </FadeInSection>

                    <div className={styles.aboutFeatures}>
                        <FadeInSection delay={100}>
                            <div className={styles.aboutFeature}>
                                <span className={styles.aboutFeatureIcon}>✅</span>
                                <div>
                                    <h3>Лицензированная школа</h3>
                                    <p>Наша школа лицензирована, родителям предоставляется возможность оплаты материнским капиталом</p>
                                </div>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={200}>
                            <div className={styles.aboutFeature}>
                                <span className={styles.aboutFeatureIcon}>🎯</span>
                                <div>
                                    <h3>Особый подход</h3>
                                    <p>По-настоящему гибкий подход к каждому ребенку</p>
                                </div>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={150}>
                            <div className={styles.aboutFeature}>
                                <span className={styles.aboutFeatureIcon}>🏠</span>
                                <div>
                                    <h3>Комфортная среда</h3>
                                    <p>Просторные классы и уютные зоны отдыха</p>
                                </div>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={250}>
                            <div className={styles.aboutFeature}>
                                <span className={styles.aboutFeatureIcon}>📅</span>
                                <div>
                                    <h3>Гибкий график занятий</h3>
                                    <p>Удобное расписание для детей и родителей</p>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Блок "Стоимость" как на arthello */}
            <section className={styles.priceSection}>
                <div className="container">
                    <div className={styles.priceGrid}>
                        <FadeInSection>
                            <div className={styles.priceCard}>
                                <div className={styles.priceDiscount}>10%</div>
                                <p className={styles.priceLabel}>Скидка при посещении сада 2 и более детей</p>
                                <h3 className={styles.priceFullDay}>Полный день</h3>
                                <p className={styles.priceAmount}>75 000 ₽ / месяц</p>
                                <p className={styles.priceNote}>Оплата мат. капиталом</p>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={200}>
                            <div className={styles.priceCard}>
                                <h3 className={styles.priceLessons}>Дополнительные занятия</h3>
                                <p className={styles.priceAmount}>от 900 ₽</p>
                                <p className={styles.priceNote}>Развивающие занятия</p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Блок "Наши будни" с расписанием */}
            <section className="container section">
                <FadeInSection>
                    <h2 className={styles.sectionTitle}>Наши будни</h2>
                    <p className={styles.sectionSubtitle}>Как проходит день в нашем саду?</p>
                    <p className={styles.sectionText}>
                        В нашем детском садике мы создаем идеальные условия для всестороннего развития детей, сочетая современные методики,<br />
                        лучшие программы и новейшие развивающие игрушки. Мы обеспечиваем безопасность, комфорт и здоровье каждого ребенка.
                    </p>
                </FadeInSection>

                <div className={styles.scheduleWrapper}>
                    <div className={styles.scheduleGrid}>
                        <div className={styles.scheduleColumn}>
                            <FadeInSection delay={50}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>8:45 – 9:00</span>
                                    <span className={styles.scheduleDesc}>Встреча детей, утренний круг</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={100}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>9:00 – 9:30</span>
                                    <span className={styles.scheduleDesc}>Завтрак</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={150}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>9:30 – 10:05</span>
                                    <span className={styles.scheduleDesc}>Первое занятие</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={200}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>10:05 – 10:10</span>
                                    <span className={styles.scheduleDesc}>Перемена</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={250}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>10:10 – 10:45</span>
                                    <span className={styles.scheduleDesc}>Второе занятие</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={300}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>10:45 – 11:00</span>
                                    <span className={styles.scheduleDesc}>Ланч, перемена</span>
                                </div>
                            </FadeInSection>
                        </div>

                        <div className={styles.scheduleColumn}>
                            <FadeInSection delay={350}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>11:00 – 11:35</span>
                                    <span className={styles.scheduleDesc}>Третье занятие</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={400}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>11:45 – 12:20</span>
                                    <span className={styles.scheduleDesc}>Четвёртое занятие</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={450}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>12:30 – 13:05</span>
                                    <span className={styles.scheduleDesc}>Пятое занятие</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={500}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>13:05 – 13:30</span>
                                    <span className={styles.scheduleDesc}>Обед</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={550}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>13:30 – 14:30</span>
                                    <span className={styles.scheduleDesc}>Прогулка</span>
                                </div>
                            </FadeInSection>
                            <FadeInSection delay={600}>
                                <div className={styles.scheduleItem}>
                                    <span className={styles.scheduleTime}>15:30 – 15:45</span>
                                    <span className={styles.scheduleDesc}>Полдник</span>
                                </div>
                            </FadeInSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* Блок "Дополнительные занятия" (ваши инди-занятия) */}
            <section className={styles.lessonsSection}>
                <div className="container">
                    <FadeInSection>
                        <h2 className={styles.sectionTitle}>Дополнительные занятия</h2>
                        <p className={styles.sectionSubtitle}>Развивающие кружки и студии</p>
                    </FadeInSection>
                    <div className={styles.lessonsGrid}>
                        {individualLessons.map((lesson, index) => (
                            <FadeInSection key={lesson.id} delay={index * 80}>
                                <div className={styles.lessonCard}>
                                    <div className={styles.lessonIcon}>
                                        {lesson.name === 'Математика' && '📐'}
                                        {lesson.name === 'Музыка' && '🎵'}
                                        {lesson.name === 'Английский язык' && '🇬🇧'}
                                        {lesson.name === 'Логопед' && '🗣️'}
                                        {lesson.name === 'Рисование' && '🎨'}
                                        {lesson.name === 'Хореография' && '💃'}
                                        {lesson.name === 'Подготовка к школе' && '📚'}
                                    </div>
                                    <h3>{lesson.name}</h3>
                                    <p>{lesson.age}</p>
                                    <p className={styles.lessonPrice}>{lesson.price} ₽ / занятие</p>
                                    <button className={styles.lessonBtn} onClick={() => openModal(lesson)}>
                                        Записаться →
                                    </button>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Блок "Безопасное питание" — 4 карточки */}
            <section className="container section">
                <FadeInSection>
                    <h2 className={styles.sectionTitle}>Безопасное и разнообразное питание для детей</h2>
                </FadeInSection>
                <div className={styles.nutritionGrid}>
                    {[
                        { icon: '🍳', title: 'Собственная кухня', desc: 'Свежие и полезные блюда готовятся ежедневно на своей кухне' },
                        { icon: '🥗', title: 'Аллерго-меню', desc: 'Мы предлагаем аллерго-меню для детей с пищевыми аллергиями' },
                        { icon: '🔧', title: 'Ресторанное оборудование', desc: 'Современное оборудование обеспечивает высокое качество' },
                        { icon: '👨‍🍳', title: 'Опытные повара', desc: 'Наши повара — профессионалы с большим опытом' }
                    ].map((item, idx) => (
                        <FadeInSection key={idx} delay={idx * 100}>
                            <div className={styles.nutritionCard}>
                                <div className={styles.nutritionIcon}>{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </section>

            {/* Блок "Преимущества" — сетка 2×4 */}
            <section className={styles.advantagesSectionPrograms}>
                <div className="container">
                    <FadeInSection>
                        <h2 className={styles.sectionTitleWhite}>Преимущества</h2>
                    </FadeInSection>
                    <div className={styles.advantagesGridPrograms}>
                        {[
                            { icon: '🏫', title: 'Помещения', desc: 'Обучение проходит в просторных светлых классах' },
                            { icon: '🎉', title: 'Мероприятия', desc: 'Фестивали, экскурсии, театры, конкурсы' },
                            { icon: '🏥', title: 'Медкабинет', desc: 'Осмотр детей и первая помощь' },
                            { icon: '👥', title: 'Малочисленные классы', desc: 'Всего 12 детей в классе' },
                            { icon: '📖', title: 'Школа полного дня', desc: 'Образовательная программа в течение дня' },
                            { icon: '🇬🇧', title: 'Углублённое изучение', desc: 'Английский язык и математика' },
                            { icon: '📜', title: 'Сертификаты', desc: 'Обязательная аттестация' },
                            { icon: '🧠', title: 'Сопровождение', desc: 'Психолог, логопед на постоянной основе' }
                        ].map((item, idx) => (
                            <FadeInSection key={idx} delay={idx * 50}>
                                <div className={styles.advantageCardPrograms}>
                                    <div className={styles.advantageIcon}>{item.icon}</div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Блок "Поступление" — 4 шага */}
            <section className="container section">
                <FadeInSection>
                    <h2 className={styles.sectionTitle}>Поступление в первый класс</h2>
                </FadeInSection>
                <div className={styles.stepsGrid}>
                    {[
                        { step: 1, title: 'Вы уже узнали о нас!', desc: 'Заполните форму или позвоните нам' },
                        { step: 2, title: 'Экскурсия', desc: 'Знакомство с пространством детского сада' },
                        { step: 3, title: 'Знакомство', desc: 'С первоклассником и его семьей' },
                        { step: 4, title: 'Документы', desc: 'Сбор и подача документов, заключение договора' }
                    ].map((item, idx) => (
                        <FadeInSection key={idx} delay={idx * 100}>
                            <div className={styles.stepCard}>
                                <div className={styles.stepNumber}>{item.step}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </section>

            {/* Блок FAQ — аккордеон */}
            <section className={styles.faqSection}>
                <div className="container">
                    <FadeInSection>
                        <h2 className={styles.sectionTitleWhite}>Часто задаваемые вопросы</h2>
                    </FadeInSection>
                    <div className={styles.faqGrid}>
                        {faqData.map((item, index) => (
                            <FadeInSection key={index} delay={index * 50}>
                                <div className={styles.faqItem}>
                                    <button className={styles.faqQuestion} onClick={() => toggleFaq(index)}>
                                        {item.question}
                                        <span className={`${styles.faqArrow} ${openFaq === index ? styles.open : ''}`}>▼</span>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                className={styles.faqAnswer}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <p>{item.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Блок отзывов */}
            <section className="container section">
                <FadeInSection>
                    <h2 className={styles.sectionTitle}>Что говорят родители</h2>
                </FadeInSection>
                <TestimonialSlider />
            </section>

            {/* Форма заявки */}
            <section className={styles.formSectionPrograms}>
                <div className="container">
                    <div className={styles.formWrapperPrograms}>
                        <FadeInSection>
                            <h3 className={styles.formTitle}>Оставьте заявку, с Вами свяжется наш специалист</h3>
                            <form className={styles.contactForm}>
                                <input type="text" placeholder="Имя" className={styles.formInput} />
                                <input type="tel" placeholder="Номер телефона" className={styles.formInput} />
                                <textarea placeholder="Сообщение" rows="3" className={styles.formTextarea}></textarea>
                                <button type="submit" className={styles.formSubmit}>Отправить →</button>
                                <p className={styles.formAgree}>
                                    Отправляя форму, вы принимаете условия Политики конфиденциальности и соглашаетесь на обработку персональных данных.
                                </p>
                            </form>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* Модальное окно при записи */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
                            <h3 className={styles.modalTitle}>Запись на занятие</h3>
                            <p><strong>{selectedLesson?.name}</strong> — {selectedLesson?.duration}, {selectedLesson?.age}</p>
                            <p className={styles.modalPrice}>Стоимость: {selectedLesson?.price} ₽</p>
                            <input type="text" placeholder="Имя ребёнка" className={styles.modalInput} />
                            <input type="text" placeholder="Ваше имя" className={styles.modalInput} />
                            <input type="tel" placeholder="Телефон" className={styles.modalInput} />
                            <Link to="/contacts">
                                <button className={styles.modalSubmit}>Подробнее →</button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Programs;