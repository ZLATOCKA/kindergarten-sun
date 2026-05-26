import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import FadeInSection from '../components/FadeInSection';
import AnimatedCount from '../components/CountUp';
import TestimonialSlider from '../components/TestimonialSlider';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Данные для карусели галереи
const galleryCarouselImages = [
    { src: '/images/gallery/play/play1.jpg', title: 'Весёлые игры', category: 'Игры' },
    { src: '/images/gallery/play/play2.jpg', title: 'Творческие занятия', category: 'Занятия' },
    { src: '/images/gallery/playground/playground1.jpg', title: 'Прогулка на площадке', category: 'Улица' },
    { src: '/images/gallery/rooms/room1.jpg', title: 'Уютная группа', category: 'Интерьер' },
    { src: '/images/gallery/eating/eating1.jpg', title: 'Вкусный завтрак', category: 'Питание' },
    { src: '/images/gallery/sleeping/sleep1.jpg', title: 'Тихий час', category: 'Отдых' }
];


// Данные для слайдера "Почему мы?"
const whyUsSlides = [
    {
        title: 'Топ 10 преимуществ',
        items: [
            'Продуманная инфраструктура',
            'Своя команда охранников 24/7',
            '68 камер по всей территории и внутри здания',
            '3 взрослых на группу',
            'Еженедельное занятие в бассейне и обучение плаванию',
            'Собственная кухня с ресторанным оборудованием',
            'Собственная соляная комната (2 курса галотерапии в год)',
            'Чистый воздух. В каждом помещении здания предусмотрены рециркуляторы "Армед", кварцевые лампы и УФ-бактерицидные лампы для обеззараживания воздуха',
            'Стильные и продуманные авторские интерьеры',
            'Комплексная образовательная программа и годовой музейный маршрут'
        ],
        image: '/images/why-us/top10.jpg'
    },
    {
        title: 'А также',
        items: [
            'Специальная программа адаптации для малышей под руководством специалиста по раннему развитию',
            'Театральные и музыкальные представления каждый месяц',
            'Наличие в штате таких специалистов как психолог и логопед, их сопровождение на постоянной основе',
            'Большой выбор кружков',
            'При прохождении программы предшколы, дополнительная подготовка для поступления в первый класс не требуется'
        ],
        image: '/images/why-us/also.jpg'
    },
    {
        title: 'И еще',
        items: [
            '76% наших выпускников поступают в ТОП-10 школ Петербурга',
            'Принимаем материнский капитал',
            'Все группы оборудованы системой контроля и управления доступом. Посторонние не смогут войти в группу, а дети не смогут выйти из нее',
            'У нас всегда тепло и есть горячая вода 365 дней в году!',
            'Собственная парковка для родителей'
        ],
        image: '/images/why-us/more.jpg'
    }
];

function Home() {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <>
            {/* ГЛАВНЫЙ ЭКРАН — жёлтый фон */}
            <section style={{
                backgroundColor: '#fbc80b',
                padding: '60px 0 80px 0',
                borderRadius: '0 0 40px 40px'
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '40px'
                    }}>
                        <div style={{ flex: '1', minWidth: '280px' }}>
                            <h1 style={{
                                fontSize: '48px',
                                fontWeight: 700,
                                lineHeight: 1.2,
                                marginBottom: '20px',
                                color: '#2B2B2B'
                            }}>
                                Детский сад<br />
                                <span style={{ color: '#009665' }}>«СОЛНЫШКО»</span>
                            </h1>
                            <p style={{
                                fontSize: '20px',
                                marginBottom: '30px',
                                color: '#2B2B2B'
                            }}>
                                место, где ребёнок по-настоящему засияет через игру и заботу
                            </p>
                            <button className="button-primary" style={{
                                backgroundColor: '#009665',
                                color: 'white',
                                borderRadius: '40px',
                                padding: '14px 32px',
                                fontSize: '16px',
                                fontWeight: 600,
                                border: 'none'
                            }}>
                                Записаться на экскурсию
                            </button>
                        </div>
                        <div style={{ flex: '1', minWidth: '280px', textAlign: 'center' }}>
                            <img
                                src="/images/hero-kindergarten.jpg"
                                alt="Детский сад Солнышко"
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    borderRadius: '40px',
                                    boxShadow: '0 20px 35px rgba(0,0,0,0.1)',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== «СОЛНЫШКО» В ЦИФРАХ — с иконками и фоновой картинкой ========== */}
            <section style={{
                backgroundImage: 'url(/images/numbers-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '80px 0',
                margin: '40px 0'
            }}>
                <div className="container">
                    <FadeInSection>
                        <h2 style={{ textAlign: 'center', color: '#2B2B2B' }}>«Солнышко» в цифрах</h2>
                    </FadeInSection>
                    <div className="grid-3" style={{ marginTop: '40px', textAlign: 'center' }}>
                        <FadeInSection delay={100}>
                            <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)', borderRadius: '28px' }}>
                                <img src="/images/icons/children-icon.png" alt="Дети" style={{ width: '60px', height: '60px', margin: '0 auto 15px' }} />
                                <h3><AnimatedCount end={320} duration={2.5} />+</h3>
                                <p>Счастливых детей</p>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={200}>
                            <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)', borderRadius: '28px' }}>
                                <img src="/images/icons/teachers-icon.png" alt="Педагоги" style={{ width: '60px', height: '60px', margin: '0 auto 15px' }} />
                                <h3><AnimatedCount end={25} duration={2} />+</h3>
                                <p>Опытных педагогов</p>
                            </div>
                        </FadeInSection>
                        <FadeInSection delay={300}>
                            <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)', borderRadius: '28px' }}>
                                <img src="/images/icons/experience-icon.png" alt="Опыт" style={{ width: '60px', height: '60px', margin: '0 auto 15px' }} />
                                <h3><AnimatedCount end={8} duration={2} /> лет</h3>
                                <p>Работаем с любовью</p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* ПОЧЕМУ МЫ? — СЛАЙДЕР */}
            <section className="section-alt" style={{ padding: '80px 0', backgroundColor: '#f9f9f9' }}>
                <div className="container">
                    <FadeInSection>
                        <h2 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '36px' }}>Почему мы?</h2>
                    </FadeInSection>
                    <div style={{ position: 'relative', marginTop: '40px' }}>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 6000, disableOnInteraction: false }}
                            loop={true}
                            onBeforeInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                            style={{ padding: '20px 0 60px' }}
                        >
                            {whyUsSlides.map((slide, idx) => (
                                <SwiperSlide key={idx}>
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'stretch',
                                        gap: '0',
                                        background: 'white',
                                        borderRadius: '40px',
                                        overflow: 'hidden',
                                        boxShadow: '0 15px 40px rgba(0,0,0,0.08)'
                                    }}>
                                        <div style={{ flex: '1.2', padding: '40px 35px', minWidth: '280px', backgroundColor: '#fff' }}>
                                            <h3 style={{
                                                fontSize: '28px',
                                                marginBottom: '25px',
                                                color: '#009665',
                                                borderLeft: `4px solid #fbc80b`,
                                                paddingLeft: '15px'
                                            }}>
                                                {slide.title}
                                            </h3>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {slide.items.map((item, i) => (
                                                    <li key={i} style={{
                                                        marginBottom: '14px',
                                                        fontSize: '15px',
                                                        lineHeight: 1.45,
                                                        color: '#2B2B2B',
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '10px'
                                                    }}>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            width: '6px',
                                                            height: '6px',
                                                            backgroundColor: '#fbc80b',
                                                            borderRadius: '50%',
                                                            marginTop: '8px',
                                                            flexShrink: 0
                                                        }} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div style={{
                                            flex: '0.9',
                                            minWidth: '260px',
                                            backgroundColor: '#fbc80b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    minHeight: '380px',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/500x450?text=Детский+сад+Солнышко';
                                                }}
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <button
                            ref={prevRef}
                            style={{
                                position: 'absolute',
                                left: '-20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: '#009665',
                                border: 'none',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 6px 14px rgba(0,150,101,0.3)',
                                color: 'white',
                                fontSize: '24px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                        >
                            ◀
                        </button>
                        <button
                            ref={nextRef}
                            style={{
                                position: 'absolute',
                                right: '-20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: '#009665',
                                border: 'none',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 6px 14px rgba(0,150,101,0.3)',
                                color: 'white',
                                fontSize: '24px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                        >
                            ▶
                        </button>
                    </div>
                </div>
            </section>

            {/* КАРУСЕЛЬ ГАЛЕРЕИ */}
            <section className="container section" style={{ textAlign: 'center' }}>
                <FadeInSection>
                    <h2 style={{ textAlign: 'center' }}>Мгновения из жизни садика 📸</h2>
                    <p style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', color: '#666' }}>
                        Яркие моменты, которые мы дарим каждый день
                    </p>
                </FadeInSection>
                <div style={{ padding: '20px 0 40px' }}>
                    <Swiper
                        modules={[Autoplay, EffectCoverflow, Pagination]}
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView="auto"
                        coverflowEffect={{
                            rotate: 25,
                            stretch: 0,
                            depth: 60,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 1, spaceBetween: 15 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 25 },
                        }}
                        style={{ padding: '20px 0 50px' }}
                    >
                        {galleryCarouselImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div style={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}>
                                    <img
                                        src={image.src}
                                        alt={image.title}
                                        style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Фото'; }}
                                    />
                                    <div style={{ padding: '15px', textAlign: 'center' }}>
                                        <p style={{ fontWeight: 600, color: '#009665' }}>{image.category}</p>
                                        <h3 style={{ fontSize: '16px', marginTop: '5px' }}>{image.title}</h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <Link to="/gallery">
                    <button className="button-secondary" style={{ borderRadius: '40px', marginTop: '10px' }}>Смотреть всю галерею →</button>
                </Link>
            </section>

            {/* ========== БЕЗОПАСНОСТЬ ========== */}
            <section className="container section" style={{ padding: '40px 0 30px' }}>
                <FadeInSection>
                    <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>
                        Безопасность детей — <span style={{ color: '#009665' }}>под нашим контролем</span>
                    </h2>
                </FadeInSection>

                <div className="security-grid">
                    {/* 1. Видеонаблюдение */}
                    <FadeInSection delay={100}>
                        <div
                            className="security-card"
                            style={{ backgroundImage: 'url(/images/safety/video-bg.jpg)' }}
                        >
                            <h3>Видеонаблюдение</h3>
                            <p>48 камер, хранение записей 30 дней</p>
                        </div>
                    </FadeInSection>

                    {/* 2. Контроль доступа */}
                    <FadeInSection delay={200}>
                        <div
                            className="security-card"
                            style={{ backgroundImage: 'url(/images/safety/access-bg.jpg)' }}
                        >
                            <h3>Контроль доступа</h3>
                            <p>Посторонние не войдут, дети не выйдут</p>
                        </div>
                    </FadeInSection>

                    {/* 3. Круглосуточная охрана */}
                    <FadeInSection delay={300}>
                        <div
                            className="security-card"
                            style={{ backgroundImage: 'url(/images/safety/guard-bg.jpg)' }}
                        >
                            <h3>Круглосуточная охрана</h3>
                            <p>Охрана территории и здания 24/7</p>
                        </div>
                    </FadeInSection>

                    {/* 4. Пожарная безопасность */}
                    <FadeInSection delay={400}>
                        <div
                            className="security-card"
                            style={{ backgroundImage: 'url(/images/safety/fire-bg.jpg)' }}
                        >
                            <h3>Пожарная безопасность</h3>
                            <p>Датчики, система дымоудаления</p>
                        </div>
                    </FadeInSection>
                </div>
            </section>
            

            {/* ========== СОБСТВЕННАЯ КУХНЯ ========== */}
            <section className="container section" style={{ backgroundColor: '#fff' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '40px'
                    }}>
                        {/* Левая часть — текст с преимуществами */}
                        <div style={{ flex: '1', minWidth: '280px' }}>
                            <h2 style={{
                                fontSize: '42px',
                                fontWeight: 700,
                                marginBottom: '15px',
                                color: '#2B2B2B'
                            }}>
                                Собственная кухня
                            </h2>
                            <p style={{
                                fontSize: '20px',
                                marginBottom: '30px',
                                color: '#009665',
                                fontWeight: 600
                            }}>
                                Безопасное и разнообразное питание для детей
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '25px',
                                marginTop: '20px'
                            }}>
                                {[
                                    { title: 'Собственная кухня', desc: 'Свежие и полезные блюда готовятся ежедневно на своей кухне.' },
                                    { title: 'Ресторанное оборудование', desc: 'Современное ресторанное оборудование обеспечивает высокое качество и быстрое приготовление.' },
                                    { title: 'Аллерго-меню', desc: 'Мы предлагаем аллерго-меню для детей с пищевыми аллергиями.' },
                                    { title: 'Опытные повара', desc: 'Наши повара — профессионалы с большим опытом. Они готовят разнообразные и вкусные блюда.' }
                                ].map((item, idx) => (
                                    <FadeInSection key={idx} delay={idx * 100}>
                                        <div style={{
                                            backgroundColor: '#f9f9f9',
                                            padding: '20px',
                                            borderRadius: '24px',
                                            textAlign: 'center',
                                            transition: 'transform 0.3s ease',
                                            cursor: 'pointer',
                                            height: '100%'
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>{item.icon}</div>
                                            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#009665' }}>{item.title}</h3>
                                            <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.5 }}>{item.desc}</p>
                                        </div>
                                    </FadeInSection>
                                ))}
                            </div>
                        </div>

                        {/* Правая часть — картинка */}
                        <div style={{ flex: '0.9', minWidth: '280px' }}>
                            <FadeInSection>
                                <img
                                    src="/images/own-kitchen.jpg"
                                    alt="Собственная кухня в детском саду Солнышко"
                                    style={{
                                        width: '100%',
                                        borderRadius: '32px',
                                        boxShadow: '0 20px 35px rgba(0,0,0,0.1)',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/500x400?text=Наша+кухня';
                                    }}
                                />
                            </FadeInSection>
                        </div>
                    </div>

                </div>
            </section>

            {/* КОМФОРТ И УЮТ */}
            <section className="section-alt">
                <div className="container">
                    <FadeInSection>
                        <h2 style={{ textAlign: 'center' }}>Комфорт и уют для каждого ребёнка</h2>
                    </FadeInSection>
                    <div className="grid-3" style={{ marginTop: '40px' }}>
                        {[
                            { icon: '🔥', title: 'Тёплые полы', desc: 'Комфортная температура по СанПиН' },
                            { icon: '🌡️', title: 'Регулировка отопления', desc: 'Индивидуальный тепловой пункт' },
                            { icon: '💧', title: 'Безопасная вода', desc: 'Ограничители температуры на кранах' }
                        ].map((item, i) => (
                            <FadeInSection key={i} delay={i * 100}>
                                <div className="card" style={{ textAlign: 'center', borderRadius: '24px' }}>
                                    <div style={{ fontSize: '48px' }}>{item.icon}</div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ЗДОРОВЬЕ */}
            <section className="container section">
                <FadeInSection>
                    <h2 style={{ textAlign: 'center' }}>Постоянная забота о здоровье малышей</h2>
                </FadeInSection>
                <div className="grid-2" style={{ marginTop: '40px' }}>
                    <FadeInSection delay={100}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', borderRadius: '24px' }}>
                            <div style={{ fontSize: '64px' }}>🏥</div>
                            <div><h3>Медицинский кабинет</h3><p>Осмотр, первая помощь, всё необходимое оборудование</p></div>
                        </div>
                    </FadeInSection>
                    <FadeInSection delay={200}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', borderRadius: '24px' }}>
                            <div style={{ fontSize: '64px' }}>💨</div>
                            <div><h3>Чистый воздух</h3><p>Рециркуляторы, кварцевые лампы, УФ-обеззараживание</p></div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ОТЗЫВЫ */}
            <section className="section-alt">
                <div className="container">
                    <FadeInSection>
                        <h2 style={{ textAlign: 'center' }}>Что говорят родители</h2>
                    </FadeInSection>
                    <div style={{ marginTop: '40px' }}><TestimonialSlider /></div>
                </div>
            </section>

            {/* CTA */}
            <section className="container section" style={{ textAlign: 'center' }}>
                <FadeInSection>
                    <div className="card" style={{ backgroundColor: '#fbc80b', padding: '50px', borderRadius: '32px' }}>
                        <h2>Оставьте заявку</h2>
                        <p style={{ margin: '20px 0', fontSize: '18px' }}>С Вами свяжется наш специалист</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <input type="text" placeholder="Ваше имя" style={{ padding: '12px 20px', borderRadius: '40px', border: 'none', width: '250px' }} />
                            <input type="tel" placeholder="+7 (___) ___-__-__" style={{ padding: '12px 20px', borderRadius: '40px', border: 'none', width: '250px' }} />
                            <button className="button-primary" style={{ backgroundColor: '#009665', color: 'white', borderRadius: '40px' }}>Отправить</button>
                        </div>
                    </div>
                </FadeInSection>
            </section>
        </>
    );
}

export default Home;