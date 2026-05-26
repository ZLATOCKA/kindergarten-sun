import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
    {
        id: 1,
        name: 'Елена М.',
        role: 'Мама Софии, 4 года',
        text: 'Посещаем в данный момент как летний лагерь. Приобрели уже третью смену, дочка в восторге. Видно, что детьми занимаются и делают это от души. Прогулки, поездки, экскурсии, мастер-классы — каждый день как праздник!',
        rating: 5,
        avatar: '/images/avatars/avatar1.jpg'
    },
    {
        id: 2,
        name: 'Анна К.',
        role: 'Мама Артёма, 5 лет',
        text: 'Отличный сад! Воспитатели настоящие профессионалы. Ребёнок идёт с удовольствием, каждый день новые поделки и знания. Очень нравится питание и безопасная территория. Рекомендую всем!',
        rating: 5,
        avatar: '/images/avatars/avatar2.jpg'
    },
    {
        id: 3,
        name: 'Сергей В.',
        role: 'Папа Миланы, 3 года',
        text: 'Спасибо за индивидуальный подход к нашему сыну. Очень помогли адаптироваться. Ребёнок стал более уверенным и общительным. Отдельное спасибо за развитие речи!',
        rating: 5,
        avatar: '/images/avatars/avatar3.jpg'
    },
    {
        id: 4,
        name: 'Ольга Д.',
        role: 'Мама Егора, 6 лет',
        text: 'Замечательный детский сад! Ребёнок каждый день бежит туда с радостью. Отличная подготовка к школе, много дополнительных занятий. Воспитатели — золото!',
        rating: 5,
        avatar: '/images/avatars/avatar4.jpg'
    },
    {
        id: 5,
        name: 'Татьяна С.',
        role: 'Мама Алисы, 4 года',
        text: 'Очень довольны садиком! Чисто, уютно, кормят вкусно. Ребёнок научился читать и считать. Спасибо всему коллективу за заботу и любовь к детям!',
        rating: 5,
        avatar: '/images/avatars/avatar5.jpg'
    }
];

// Компонент звёзд рейтинга
const StarsRating = ({ rating }) => {
    return (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
            {[...Array(5)].map((_, i) => (
                <span key={i} style={{
                    fontSize: '18px',
                    color: i < rating ? '#fbc80b' : '#ddd',
                    textShadow: i < rating ? '0 0 2px rgba(0,0,0,0.1)' : 'none'
                }}>
                    ★
                </span>
            ))}
        </div>
    );
};

function TestimonialSlider() {
    return (
        <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={true}
            breakpoints={{
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            style={{ padding: '20px 0 50px' }}
        >
            {testimonials.map((t) => (
                <SwiperSlide key={t.id}>
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div
                                className="testimonial-avatar"
                                style={{ backgroundImage: `url(${t.avatar})` }}
                            >
                                {!t.avatar && <span>{t.name.charAt(0)}</span>}
                            </div>
                            <div className="testimonial-info">
                                <h4 className="testimonial-name">{t.name}</h4>
                                <p className="testimonial-role">{t.role}</p>
                            </div>
                        </div>
                        <StarsRating rating={t.rating} />
                        <p className="testimonial-text">“{t.text}”</p>
                        <div className="testimonial-quote-icon">“</div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default TestimonialSlider;