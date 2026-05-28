const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// ========== ПОЛУЧИТЬ ВСЕХ ДЕТЕЙ ==========
router.get('/my-children', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Доступ запрещён' });
    }

    try {
        const result = await pool.query(
            `SELECT 
                d."ID_Ребенка",
                d."Фамилия",
                d."Имя",
                d."Дата рождения",
                d."Пол",
                g."Название_Группы",
                v."Возраст" as "ВозрастнаяКатегория"
            FROM "Дети" d
            JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
            JOIN "Дети в группе" dg ON d."ID_Ребенка" = dg."ID_Ребенка"
            JOIN "Группы" g ON dg."ID_Группы" = g."ID_Группы"
            JOIN "Возрастная категория" v ON g."ID_Категории" = v."ID_Категории"
            WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// ========== АЛЛЕРГИИ (исправлено имя таблицы) ==========
router.get('/my-children/allergies', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const children = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
             JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
             WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (children.rows.length === 0) return res.json([]);

        const childIds = children.rows.map(c => c.ID_Ребенка);
        const result = await pool.query(
            `SELECT sz.*, zp."Название_продукта"
             FROM "Список запрещенных продуктов" sz
             JOIN "Запрещенные продукты" zp ON sz."ID_Продукта" = zp."ID_Продукта"
             WHERE sz."ID_Ребенка" = ANY($1::int[])`,
            [childIds]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Получить справки для ВСЕХ детей (или по конкретному)
router.get('/my-children/certificates', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const children = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (children.rows.length === 0) return res.json([]);

        const childIds = children.rows.map(c => c.ID_Ребенка);
        const result = await pool.query(
            `SELECT "ID_Справки", "ID_Ребенка", "Тип_справка", "Дата_начала", "Дата_окончания"
       FROM "Справки" WHERE "ID_Ребенка" = ANY($1::int[])`,
            [childIds]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить прививки для ВСЕХ детей
router.get('/my-children/vaccinations', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const children = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (children.rows.length === 0) return res.json([]);

        const childIds = children.rows.map(c => c.ID_Ребенка);
        const result = await pool.query(
            `SELECT pr.*, p."Название_прививки"
       FROM "Прививки ребенка" pr
       JOIN "Прививки" p ON pr."ID_Прививки" = p."ID_Прививки"
       WHERE pr."ID_Ребенка" = ANY($1::int[])`,
            [childIds]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить посещаемость для ВСЕХ детей
router.get('/my-children/attendance', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const children = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (children.rows.length === 0) return res.json([]);

        const childIds = children.rows.map(c => c.ID_Ребенка);
        const result = await pool.query(
            `SELECT "ID_Ребенка", "Дата", "Время_прихода", "Время_ухода"
       FROM "Посещаемость"
       WHERE "ID_Ребенка" = ANY($1::int[])
       ORDER BY "Дата" DESC
       LIMIT 50`,
            [childIds]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Родственное древо
router.get('/my-child/family-tree', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const relatives = await pool.query(
            `SELECT r."Фамилия", r."Имя", r."Отчество", sr."Степени_родства" as "Статус"
       FROM "Родители" r
       JOIN "Степень родства" sr ON r."ID_Степени" = sr."ID_Степени"
       JOIN "Родители-дети" rd ON r."Id_Родителя" = rd."ID_Родителя"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        res.json({ relatives: relatives.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Индивидуальные занятия, на которые записаны дети
router.get('/my-children/lessons', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const children = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (children.rows.length === 0) return res.json([]);

        const childIds = children.rows.map(c => c.ID_Ребенка);
        const lessons = await pool.query(
            `SELECT p."ID_Занятия", p."ID_Ребенка", iz."Название", iz."Стоимость", p."Дата_проведения"
       FROM "Посещенные платные занятия" p
       JOIN "Индивидуальные занятия" iz ON p."ID_Занятия" = iz."ID_Занятия"
       WHERE p."ID_Ребенка" = ANY($1::int[])`,
            [childIds]
        );
        res.json(lessons.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Платежи родителя
router.get('/my-payments', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const payments = await pool.query(
            `SELECT p.*, iz."Название" as lesson_name
       FROM "Платежи" p
       LEFT JOIN "Индивидуальные занятия" iz ON p."ID_Занятия" = iz."ID_Занятия"
       WHERE p."ID_Родителя" = $1
       ORDER BY p."Дата_платежа" DESC`,
            [req.user.id]
        );
        res.json(payments.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Список доступных платных занятий
router.get('/paid-lessons', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT "ID_Занятия", "Название", "Стоимость", "День_недели", "Время_начала"
       FROM "Индивидуальные занятия"
       ORDER BY "День_недели", "Время_начала"`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Запись ребёнка на платное занятие
router.post('/register-lesson', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    const { lessonId, date, childId } = req.body;

    if (!lessonId || !date || !childId) {
        return res.status(400).json({ message: 'Не хватает данных' });
    }

    try {
        await pool.query(
            `INSERT INTO "Посещенные платные занятия" ("ID_Ребенка", "ID_Занятия", "Дата_проведения")
       VALUES ($1, $2, $3)`,
            [childId, lessonId, date]
        );
        res.json({ success: true, message: 'Запись успешно оформлена' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;