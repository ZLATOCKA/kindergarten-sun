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

// ========== ПОСТАВЩИКИ ==========
router.get('/suppliers', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                "ID_Поставщика" as id,
                "Название_компании" as "Название",
                "Контактное_лицо" as "Контактное лицо",
                "Телефон",
                "Адрес"
            FROM kindergarten_db."Поставщик"
            ORDER BY "ID_Поставщика"
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('GET suppliers error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОСТАВКИ ==========
router.get('/supplies', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p."ID_Поставки" as id,
                p."Дата_поставки" as "Дата поставки",
                s."Название_компании" as "Поставщик",
                f."Название_филиала" as "Филиал"
            FROM kindergarten_db."Поставки" p
            LEFT JOIN kindergarten_db."Поставщик" s ON p."ID_Поставщика" = s."ID_Поставщика"
            LEFT JOIN kindergarten_db."Филиалы" f ON p."ID_Филиала" = f."ID_Филиалы"
            ORDER BY p."Дата_поставки" DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('GET supplies error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;