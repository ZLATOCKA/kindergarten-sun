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

// ========== ПРОФИЛЬ АДМИНИСТРАТОРА (полный) ==========
router.get('/employees/my-profile', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                s."ID_Сотрудника" as id,
                s."Фамилия",
                s."Имя",
                s."Отчество",
                s."Телефон",
                s."Email",
                s."Адрес",
                s."Дата_рождения",
                d."Название_должности" as "Должность",
                f."Название_филиала" as "Филиал"
            FROM kindergarten_db."Сотрудники" s
            LEFT JOIN kindergarten_db."Должности" d ON s."ID_Должности" = d."ID_Должности"
            LEFT JOIN kindergarten_db."Филиалы" f ON s."ID_Филиала" = f."ID_Филиалы"
            WHERE s."ID_Сотрудника" = $1`,
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ message: err.message });
    }
});

router.put('/employees/my-profile', authMiddleware, async (req, res) => {
    try {
        const { Фамилия, Имя, Отчество, Телефон, Email, Адрес, Дата_рождения, password } = req.body;
        
        let query = `
            UPDATE kindergarten_db."Сотрудники" 
            SET "Фамилия"=$1, "Имя"=$2, "Отчество"=$3, "Телефон"=$4, "Email"=$5, "Адрес"=$6, "Дата_рождения"=$7
        `;
        const params = [Фамилия, Имя, Отчество, Телефон, Email, Адрес, Дата_рождения, req.user.id];
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, "PasswordHash"=$${params.length + 1}`;
            params.push(hashedPassword);
        }
        
        query += ` WHERE "ID_Сотрудника"=$${params.length}`;
        await pool.query(query, params);
        res.json({ success: true });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ДЕТИ (полные данные) ==========
router.get('/children', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                "ID_Ребенка" as id,
                "Фамилия",
                "Имя",
                "Отчество",
                "Дата рождения" as "Дата рождения",
                "Пол"
            FROM kindergarten_db."Дети"
            ORDER BY "ID_Ребенка"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== РОДИТЕЛИ (полные данные) ==========
router.get('/parents', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p."Id_Родителя" as id,
                p."Фамилия",
                p."Имя",
                p."Отчество",
                sr."Степени_родства" as "Степень_родства",
                p."Адрес",
                p."Телефон",
                p."Паспортные данные" as "Паспортные данные",
                p."Email"
            FROM kindergarten_db."Родители" p
            LEFT JOIN kindergarten_db."Степень родства" sr ON p."ID_Степени" = sr."ID_Степени"
            ORDER BY p."Id_Родителя"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== СОТРУДНИКИ (полные данные) ==========
router.get('/employees', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s."ID_Сотрудника" as id,
                s."Фамилия",
                s."Имя",
                s."Отчество",
                s."Дата_рождения" as "Дата рождения",
                s."Адрес",
                s."Телефон",
                s."Email",
                d."Название_должности" as "Должность",
                f."Название_филиала" as "Филиал",
                s."Роль"
            FROM kindergarten_db."Сотрудники" s
            LEFT JOIN kindergarten_db."Должности" d ON s."ID_Должности" = d."ID_Должности"
            LEFT JOIN kindergarten_db."Филиалы" f ON s."ID_Филиала" = f."ID_Филиалы"
            ORDER BY s."ID_Сотрудника"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== ГРУППЫ (с возрастом вместо ID) ==========
router.get('/groups', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                g."ID_Группы" as id,
                g."Название_Группы" as "Название группы",
                v."Возраст" as "Возраст"
            FROM kindergarten_db."Группы" g
            LEFT JOIN kindergarten_db."Возрастная категория" v ON g."ID_Категории" = v."ID_Категории"
            ORDER BY g."ID_Группы"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== ЗАНЯТИЯ ==========
router.get('/lessons', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                "ID_Занятия" as id,
                "Название",
                "Стоимость"
            FROM kindergarten_db."Индивидуальные занятия"
            ORDER BY "ID_Занятия"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== ДОЛЖНОСТИ (для выпадающего списка) ==========
router.get('/positions', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Должности" as id, "Название_должности"
            FROM kindergarten_db."Должности"
            ORDER BY "ID_Должности"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== ФИЛИАЛЫ (для выпадающего списка) ==========
router.get('/branches', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Филиалы" as id, "Название_филиала"
            FROM kindergarten_db."Филиалы"
            ORDER BY "ID_Филиалы"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== СТЕПЕНИ РОДСТВА (для выпадающего списка) ==========
router.get('/steps', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Степени" as id, "Степени_родства"
            FROM kindergarten_db."Степень родства"
            ORDER BY "ID_Степени"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== ВОЗРАСТНЫЕ КАТЕГОРИИ ==========
router.get('/age-categories', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT "ID_Категории" as id, "Возраст"
            FROM kindergarten_db."Возрастная категория"
            ORDER BY "ID_Категории"
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;