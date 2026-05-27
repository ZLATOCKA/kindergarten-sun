import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const handleMouseEnter = (e, originalText) => {
        const letters = originalText.split('');
        e.currentTarget.innerHTML = letters.map((letter, index) =>
            `<span style="display:inline-block; transition:transform 0.15s ease ${index * 0.04}s; transform:translateY(-10px);">${letter}</span>`
        ).join('');
    };

    const handleMouseLeave = (e, originalText) => {
        e.currentTarget.innerHTML = originalText;
    };

    return (
        <footer style={{
            backgroundImage: 'url(/images/footer-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            padding: '70px 0 40px',
            marginTop: '0',
            color: '#2B2B2B'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '35px',
                    marginBottom: '45px'
                }}>
                    {/* Блок 1: Детский сад — слева */}
                    <div style={{
                        flex: '1',
                        minWidth: '220px',
                        backgroundColor: '#fbc80b',
                        borderRadius: '28px',
                        padding: '30px 25px',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
                        }}
                    >
                        <h3 style={{
                            fontSize: '26px',
                            marginBottom: '18px',
                            color: '#009665',
                            fontWeight: 700,
                            fontFamily: "'Poppins', 'Baloo 2', sans-serif",
                            cursor: 'default'
                        }}
                            onMouseEnter={(e) => handleMouseEnter(e, 'Детский сад «Солнышко»')}
                            onMouseLeave={(e) => handleMouseLeave(e, 'Детский сад «Солнышко»')}
                        >
                            Детский сад «Солнышко»
                        </h3>
                        <p style={{ fontSize: '16px', fontWeight: 600, color: '#2B2B2B', lineHeight: 1.5 }}>
                            Место, где каждый ребёнок сияет
                        </p>
                    </div>

                    {/* Блок 2: Контакты — по центру, крупнее */}
                    <div style={{
                        flex: '1.8',
                        minWidth: '300px',
                        backgroundColor: '#fbc80b',
                        borderRadius: '28px',
                        padding: '30px 25px',
                        textAlign: 'center',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
                        }}
                    >
                        <Link to="/contacts" style={{ textDecoration: 'none' }}>
                            <h3 style={{
                                fontSize: '36px',
                                marginBottom: '22px',
                                color: '#009665',
                                fontWeight: 700,
                                fontFamily: "'Poppins', 'Baloo 2', sans-serif",
                                cursor: 'pointer',
                                display: 'inline-block'
                            }}
                                onMouseEnter={(e) => handleMouseEnter(e, 'Контакты')}
                                onMouseLeave={(e) => handleMouseLeave(e, 'Контакты')}
                            >
                                Контакты
                            </h3>
                        </Link>
                        <p style={{ margin: '12px 0', fontSize: '16px', fontWeight: 600, color: '#2B2B2B' }}>
                            г. Санкт-Петербург, Московский пр., д.149
                        </p>
                        <p style={{ margin: '12px 0', fontSize: '22px', fontWeight: 700, color: '#009665' }}>
                            +7 (924) 676-76-67
                        </p>
                        <p style={{ margin: '12px 0', fontSize: '16px', fontWeight: 600, color: '#2B2B2B' }}>
                            sun@kindergarten.ru
                        </p>
                    </div>

                    {/* Блок 3: Режим работы — справа */}
                    <div style={{
                        flex: '1',
                        minWidth: '220px',
                        backgroundColor: '#fbc80b',
                        borderRadius: '28px',
                        padding: '30px 25px',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-6px)';
                            e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
                        }}
                    >
                        <h3 style={{
                            fontSize: '26px',
                            marginBottom: '18px',
                            color: '#009665',
                            fontWeight: 700,
                            fontFamily: "'Poppins', 'Baloo 2', sans-serif",
                            cursor: 'default'
                        }}
                            onMouseEnter={(e) => handleMouseEnter(e, 'Режим работы')}
                            onMouseLeave={(e) => handleMouseLeave(e, 'Режим работы')}
                        >
                            Режим работы
                        </h3>
                        <p style={{ margin: '10px 0', fontSize: '16px', fontWeight: 600, color: '#2B2B2B' }}>
                            Пн–Пт: 7:30 – 19:30
                        </p>
                        <p style={{ margin: '10px 0', fontSize: '16px', fontWeight: 600, color: '#2B2B2B' }}>
                            Сб–Вс: выходной
                        </p>
                    </div>
                </div>

                {/* Нижняя строка */}
                <div style={{
                    textAlign: 'center',
                    paddingTop: '30px',
                    borderTop: '1px solid rgba(0,150,101,0.4)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1a1a1a'
                }}>
                    <p>© 2026 Детский сад «Солнышко». Все права защищены.</p>
                    <p style={{ fontSize: '14px', marginTop: '12px', color: '#333', fontWeight: 500 }}>
                        Поставщики: ООО «Детский мир», ИП «Игрушки+», Компания «Здоровое питание»
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;