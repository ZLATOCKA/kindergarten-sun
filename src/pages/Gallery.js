import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import FadeInSection from '../components/FadeInSection';
import styles from './styles/Gallery.module.css'; // ← ПРАВИЛЬНЫЙ импорт CSS Module

// Категории и их фото
const galleryData = {
    play: {
        name: 'Игры и занятия',
        icon: '🎨',
        photos: [
            '/images/gallery/play/play1.jpg',
            '/images/gallery/play/play2.jpg',
            '/images/gallery/play/play3.jpg',
            '/images/gallery/play/play4.jpg'
        ]
    },
    playground: {
        name: 'Детская площадка',
        icon: '🌳',
        photos: [
            '/images/gallery/playground/playground1.jpg',
            '/images/gallery/playground/playground2.jpg',
            '/images/gallery/playground/playground3.jpg'
        ]
    },
    rooms: {
        name: 'Комнаты и интерьеры',
        icon: '🏠',
        photos: [
            '/images/gallery/rooms/room1.jpg',
            '/images/gallery/rooms/room2.jpg',
            '/images/gallery/rooms/room3.jpg',
            '/images/gallery/rooms/room4.jpg'
        ]
    },
    food: {
        name: 'Вкусное меню',
        icon: '🍲',
        photos: [
            '/images/gallery/food/food1.jpg',
            '/images/gallery/food/food2.jpg',
            '/images/gallery/food/food3.jpg'
        ]
    },
    eating: {
        name: 'Дети кушают',
        icon: '🍎',
        photos: [
            '/images/gallery/eating/eating1.jpg',
            '/images/gallery/eating/eating2.jpg',
            '/images/gallery/eating/eating3.jpg'
        ]
    },
    sleeping: {
        name: 'Тихий час',
        icon: '😴',
        photos: [
            '/images/gallery/sleeping/sleep1.jpg',
            '/images/gallery/sleeping/sleep2.jpg',
            '/images/gallery/sleeping/sleep3.jpg'
        ]
    }
};

// Получаем все фото для общей ленты
const allPhotos = Object.values(galleryData).flatMap(cat => cat.photos);

function Gallery() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [lightboxImage, setLightboxImage] = useState(null);

    const getDisplayedPhotos = () => {
        if (selectedCategory === 'all') {
            return allPhotos;
        }
        return galleryData[selectedCategory]?.photos || [];
    };

    const displayedPhotos = getDisplayedPhotos();

    const breakpointColumns = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="gallery-page">
            {/* Hero-блок */}
            <div style={{
                background: 'linear-gradient(135deg, #fbc80b 0%, #009665 100%)',
                padding: '60px 0 40px',
                textAlign: 'center',
                color: 'white',
                borderRadius: '0 0 40px 40px'
            }}>
                <div className="container">
                    <FadeInSection>
                        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Наша галерея</h1>
                        <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                            Яркие моменты из жизни детского сада «Солнышко» ☀️
                        </p>
                    </FadeInSection>
                </div>
            </div>

            {/* Фильтр категорий */}
            <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '15px'
                }}>
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={styles.filterBtn}
                        style={{
                            background: selectedCategory === 'all' ? '#009665' : 'white',
                            color: selectedCategory === 'all' ? 'white' : '#2B2B2B',
                            border: '2px solid #009665',
                            borderRadius: '40px',
                            padding: '10px 24px',
                            fontWeight: 600
                        }}
                    >
                        🖼️ Все фото
                    </button>
                    {Object.entries(galleryData).map(([key, cat]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={styles.filterBtn}
                            style={{
                                background: selectedCategory === key ? '#009665' : 'white',
                                color: selectedCategory === key ? 'white' : '#2B2B2B',
                                border: '2px solid #009665',
                                borderRadius: '40px',
                                padding: '10px 24px',
                                fontWeight: 600
                            }}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry сетка */}
            <div className="container" style={{ marginBottom: '60px' }}>
                <Masonry
                    breakpointCols={breakpointColumns}
                    className={styles.masonryGrid}
                    columnClassName={styles.masonryGridColumn}
                >
                    {displayedPhotos.map((photo, index) => (
                        <FadeInSection key={index} delay={index * 50}>
                            <div
                                className={styles.galleryItem}
                                onClick={() => setLightboxImage(photo)}
                            >
                                <img src={photo} alt={`Фото галереи ${index + 1}`} />
                            </div>
                        </FadeInSection>
                    ))}
                </Masonry>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div className={styles.lightbox} onClick={() => setLightboxImage(null)}>
                    <img src={lightboxImage} alt="Увеличенное фото" className={styles.lightboxImage} />
                    <button className={styles.closeBtn} onClick={() => setLightboxImage(null)}>✕</button>
                </div>
            )}
        </div>
    );
}

export default Gallery;