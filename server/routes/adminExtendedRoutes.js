const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

// ========== ПОЛУЧИТЬ ВСЕХ РОДИТЕЛЕЙ ==========
router.get('/parents', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p."Id_Родителя" as id,
                p."Фамилия",
                p."Имя",
                p."Отчество",
                p."Адрес",
                p."Телефон",
                p."Паспортные данные",
                p."Email",
                sr."Степени_родства" as "Степень_родства"
            FROM kindergarten_db."Родители" p
            LEFT JOIN kindergarten_db."Степень родства" sr ON p."ID_Степени" = sr."ID_Степени"
            ORDER BY p."Id_Родителя"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ДОБАВИТЬ РОДИТЕЛЯ ==========
router.post('/parents', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, Отчество, Адрес, Телефон, Паспортные_данные, Email, ID_Степени, password } = req.body;
    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const result = await pool.query(
            `INSERT INTO kindergarten_db."Родители" 
             ("Фамилия", "Имя", "Отчество", "Адрес", "Телефон", "Паспортные данные", "Email", "ID_Степени", "PasswordHash") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING "Id_Родителя" as id`,
            [Фамилия, Имя, Отчество, Адрес, Телефон, Паспортные_данные, Email, ID_Степени, hashedPassword]
        );
        res.json({ id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ОБНОВИТЬ РОДИТЕЛЯ ==========
router.put('/parents/:id', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, Отчество, Адрес, Телефон, Паспортные_данные, Email, ID_Степени, password } = req.body;
    try {
        let query = `
            UPDATE kindergarten_db."Родители" SET 
                "Фамилия"=$1, "Имя"=$2, "Отчество"=$3, "Адрес"=$4, 
                "Телефон"=$5, "Паспортные данные"=$6, "Email"=$7, "ID_Степени"=$8
        `;
        const params = [Фамилия, Имя, Отчество, Адрес, Телефон, Паспортные_данные, Email, ID_Степени, req.params.id];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, "PasswordHash"=$${params.length + 1}`;
            params.push(hashedPassword);
        }

        query += ` WHERE "Id_Родителя"=$${params.length}`;

        await pool.query(query, params);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== УДАЛИТЬ РОДИТЕЛЯ ==========
router.delete('/parents/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await pool.query(`DELETE FROM kindergarten_db."Родители" WHERE "Id_Родителя"=$1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ СТЕПЕНИ РОДСТВА ==========
router.get('/steps', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Степени" as id, "Степени_родства"
            FROM kindergarten_db."Степень родства"
            ORDER BY "ID_Степени"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ДОЛЖНОСТИ ==========
router.get('/positions', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Должности" as id, "Название_должности"
            FROM kindergarten_db."Должности"
            ORDER BY "ID_Должности"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ФИЛИАЛЫ ==========
router.get('/branches', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Филиалы" as id, "Название_филиала"
            FROM kindergarten_db."Филиалы"
            ORDER BY "ID_Филиалы"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ВОЗРАСТНЫЕ КАТЕГОРИИ ==========
router.get('/age-categories', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Категории" as id, "Возраст"
            FROM kindergarten_db."Возрастная категория"
            ORDER BY "ID_Категории"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ КАТЕГОРИИ ТОВАРОВ ==========
router.get('/product-categories', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Категории_товаров" as id, "Название_категории"
            FROM kindergarten_db."Категории товаров"
            ORDER BY "ID_Категории_товаров"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ТОВАРЫ С КАТЕГОРИЯМИ ==========
router.get('/products', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                t."ID_Товара" as id,
                t."Назввание_товара" as product_name,
                c."Название_категории" as category_name
            FROM kindergarten_db."Товары" t
            LEFT JOIN kindergarten_db."Категории товаров" c ON t."ID_Категории_товара" = c."ID_Категории_товаров"
            ORDER BY t."ID_Товара"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;