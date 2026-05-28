const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ запрещён' });
    }
    next();
};

// ========== ПОСТАВЩИКИ ==========
router.get('/suppliers', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "Поставщики" ORDER BY id`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/suppliers', authMiddleware, isAdmin, async (req, res) => {
    const { Название, Контактное_лицо, Телефон, Email, Адрес } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO "Поставщики" ("Название", "Контактное_лицо", "Телефон", "Email", "Адрес") 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [Название, Контактное_лицо, Телефон, Email, Адрес]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/suppliers/:id', authMiddleware, isAdmin, async (req, res) => {
    const { Название, Контактное_лицо, Телефон, Email, Адрес } = req.body;
    try {
        await pool.query(
            `UPDATE "Поставщики" SET "Название"=$1, "Контактное_лицо"=$2, "Телефон"=$3, "Email"=$4, "Адрес"=$5 WHERE id=$6`,
            [Название, Контактное_лицо, Телефон, Email, Адрес, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/suppliers/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await pool.query(`DELETE FROM "Поставщики" WHERE id=$1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== ПОСТАВКИ ==========
router.get('/supplies', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "Поставки" ORDER BY id`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/supplies', authMiddleware, isAdmin, async (req, res) => {
    const { ID_Поставщика, Товар, Количество, Дата_поставки, Стоимость } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO "Поставки" ("ID_Поставщика", "Товар", "Количество", "Дата_поставки", "Стоимость") 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [ID_Поставщика, Товар, Количество, Дата_поставки, Стоимость]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/supplies/:id', authMiddleware, isAdmin, async (req, res) => {
    const { ID_Поставщика, Товар, Количество, Дата_поставки, Стоимость } = req.body;
    try {
        await pool.query(
            `UPDATE "Поставки" SET "ID_Поставщика"=$1, "Товар"=$2, "Количество"=$3, "Дата_поставки"=$4, "Стоимость"=$5 WHERE id=$6`,
            [ID_Поставщика, Товар, Количество, Дата_поставки, Стоимость, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/supplies/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await pool.query(`DELETE FROM "Поставки" WHERE id=$1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;