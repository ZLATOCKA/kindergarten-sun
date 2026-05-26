import React from 'react';
import FadeInSection from '../components/FadeInSection';

function Contacts() {
    return (
        <>
            {/* Hero-блок с большой картинкой */}
            <div style={{
                backgroundImage: 'url(/images/contacts-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '350px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '60px',
                borderRadius: '0 0 50px 50px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '0 0 50px 50px'
                }} />
                <h1 style={{
                    position: 'relative',
                    zIndex: 2,
                    color: 'white',
                    fontSize: '56px',
                    fontWeight: 700,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                    fontFamily: "'Poppins', 'Baloo 2', sans-serif"
                }}>
                    Контакты
                </h1>
            </div>

            <div className="container" style={{ paddingBottom: '80px' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '50px',
                    justifyContent: 'space-between'
                }}>
                    {/* Левая колонка — форма */}
                    <div style={{ flex: '1.2', minWidth: '280px' }}>
                        <FadeInSection>
                            <h2 style={{
                                fontSize: '32px',
                                marginBottom: '25px',
                                color: '#2B2B2B',
                                fontFamily: "'Poppins', sans-serif"
                            }}>
                                Напишите нам
                            </h2>
                            <form>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#2B2B2B' }}>Имя</label>
                                    <input
                                        type="text"
                                        placeholder="Ваше имя"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            borderRadius: '30px',
                                            border: '2px solid #e0e0e0',
                                            fontSize: '16px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={e => e.currentTarget.style.borderColor = '#009665'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#2B2B2B' }}>Номер телефона</label>
                                    <input
                                        type="tel"
                                        placeholder="+7 (___) ___-__-__"
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            borderRadius: '30px',
                                            border: '2px solid #e0e0e0',
                                            fontSize: '16px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={e => e.currentTarget.style.borderColor = '#009665'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    />
                                </div>
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#2B2B2B' }}>Сообщение</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Ваше сообщение..."
                                        style={{
                                            width: '100%',
                                            padding: '14px 18px',
                                            borderRadius: '24px',
                                            border: '2px solid #e0e0e0',
                                            fontSize: '16px',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onFocus={e => e.currentTarget.style.borderColor = '#009665'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: '#fbc80b',
                                        color: '#2B2B2B',
                                        border: 'none',
                                        borderRadius: '40px',
                                        padding: '14px 32px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        width: '100%',
                                        maxWidth: '200px'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.backgroundColor = '#009665';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.backgroundColor = '#fbc80b';
                                        e.currentTarget.style.color = '#2B2B2B';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    Отправить
                                </button>
                                <p style={{
                                    fontSize: '12px',
                                    color: '#888',
                                    marginTop: '20px'
                                }}>
                                    Отправляя форму, вы принимаете условия Политики конфиденциальности и соглашаетесь на обработку персональных данных.
                                </p>
                            </form>
                        </FadeInSection>
                    </div>

                    {/* Правая колонка — адреса и телефоны */}
                    <div style={{ flex: '0.9', minWidth: '280px' }}>
                        <FadeInSection delay={150}>
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '30px',
                                borderRadius: '32px',
                                marginBottom: '30px',
                                border: '2px solid #009665',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <h3 style={{
                                    fontSize: '24px',
                                    marginBottom: '20px',
                                    color: '#009665',
                                    fontFamily: "'Poppins', sans-serif"
                                }}>
                                    📞 Свяжитесь с нами
                                </h3>
                                <p style={{ fontSize: '20px', fontWeight: 600, marginBottom: '10px' }}>+7 (924) 676-76-67</p>
                                <p style={{ fontSize: '16px', color: '#555' }}>Ежедневно с 9:00 до 19:00</p>
                            </div>
                        </FadeInSection>

                        <FadeInSection delay={300}>
                            <div style={{
                                backgroundColor: '#f9f9f9',
                                padding: '30px',
                                borderRadius: '32px',
                                border: '2px solid #009665',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <h3 style={{
                                    fontSize: '24px',
                                    marginBottom: '20px',
                                    color: '#009665',
                                    fontFamily: "'Poppins', sans-serif"
                                }}>
                                    📍 Наши адреса
                                </h3>
                                <p style={{ marginBottom: '15px', fontSize: '16px' }}>
                                    <strong>Основной филиал:</strong><br />
                                    г. Санкт-Петербург, Московский пр., д.149
                                </p>
                                <p style={{ marginBottom: '15px', fontSize: '16px' }}>
                                    <strong>Филиал «Зайчата»:</strong><br />
                                    г. Санкт-Петербург, ул. Лиственная, д. 16
                                </p>
                                <p style={{ fontSize: '16px' }}>
                                    <strong>Центр «Пчёлки»:</strong><br />
                                    г. Санкт-Петербург, Сантьяго-де-Куба, д. 6, к. 4
                                </p>
                            </div>
                        </FadeInSection>

                        <FadeInSection delay={450}>
                            <div style={{
                                backgroundColor: '#fbc80b',
                                padding: '25px',
                                borderRadius: '32px',
                                marginTop: '20px',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <p style={{ fontSize: '18px', fontWeight: 600, color: '#2B2B2B' }}>
                                    ✉️ sun@kindergarten.ru
                                </p>
                                <p style={{ fontSize: '14px', marginTop: '8px', color: '#2B2B2B' }}>
                                    Ответим в течение 24 часов
                                </p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contacts;