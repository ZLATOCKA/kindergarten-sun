const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// ========== ПРИВИВКИ (полные данные) ==========
router.get('/vaccinations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                vr."ID_Записи_прививки" as id,
                d."Фамилия" || ' ' || d."Имя" as "Ребёнок",
                v."Название_прививки" as "Прививка",
                vr."Дата_проведения" as "Дата проведения",
                vr."Статус" as "Статус",
                vr."Медицинское_учреждение" as "Учреждение"
            FROM kindergarten_db."Прививки ребенка" vr
            LEFT JOIN kindergarten_db."Дети" d ON vr."ID_Ребенка" = d."ID_Ребенка"
            LEFT JOIN kindergarten_db."Прививки" v ON vr."ID_Прививки" = v."ID_Прививки"
            ORDER BY vr."Дата_проведения" DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('GET vaccinations error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ЗАБОЛЕВАНИЯ (полные данные) ==========
router.get('/diseases', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                "ID_Заболевания" as id,
                "Название_заболевания" as "Название заболевания",
                "Код_МКБ" as "Код МКБ"
            FROM kindergarten_db."Заболевания"
            ORDER BY "Название_заболевания"
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('GET diseases error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== СПИСОК ПРИВИВОК (для выпадающего списка) ==========
router.get('/vaccines-list', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Прививки" as id, "Название_прививки"
            FROM kindergarten_db."Прививки"
            ORDER BY "Название_прививки"
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('GET vaccines list error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;