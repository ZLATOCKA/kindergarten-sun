const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Получить информацию о ребёнке
router.get('/my-child', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });
    try {
        console.log(`🆔 [DEBUG] ID родителя из токена: ${req.user.id}`);
        const result = await pool.query(
            `SELECT d."ID_Ребенка", d."Фамилия", d."Имя", d."Дата рождения", d."Пол",
              g."Название_Группы", v."Возраст" as "ВозрастнаяКатегория"
       FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       JOIN "Дети в группе" dg ON d."ID_Ребенка" = dg."ID_Ребенка"
       JOIN "Группы" g ON dg."ID_Группы" = g."ID_Группы"
       JOIN "Возрастная категория" v ON g."ID_Категории" = v."ID_Категории"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        console.log(`👶 [DEBUG] Результат запроса: ${result.rows.length} запись(ей)`, result.rows);
        res.json(result.rows[0] || null);
    } catch (err) {
        console.error(`❌ [DEBUG] Ошибка SQL: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
});

// Получить справки ребёнка
router.get('/my-child/certificates', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });

    try {
        const child = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (child.rows.length === 0) return res.json([]);

        const result = await pool.query(
            `SELECT "ID_Справки", "Тип_справка", "Дата_начала", "Дата_окончания"
       FROM "Справки" WHERE "ID_Ребенка" = $1`,
            [child.rows[0].ID_Ребенка]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить прививки ребёнка
router.get('/my-child/vaccinations', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });

    try {
        const child = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (child.rows.length === 0) return res.json([]);

        const result = await pool.query(
            `SELECT p."Название_прививки", pr."Дата_проведения", pr."Статус"
       FROM "Прививки ребенка" pr
       JOIN "Прививки" p ON pr."ID_Прививки" = p."ID_Прививки"
       WHERE pr."ID_Ребенка" = $1`,
            [child.rows[0].ID_Ребенка]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить аллергии (запрещённые продукты) ребёнка
router.get('/my-child/allergies', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });

    try {
        const child = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (child.rows.length === 0) return res.json([]);

        const result = await pool.query(
            `SELECT zp."Название_продукта"
       FROM "Список запрещенных продуктов ребенка" sz
       JOIN "Запрещенные продукты" zp ON sz."ID_Продукта" = zp."ID_Продукта"
       WHERE sz."ID_Ребенка" = $1`,
            [child.rows[0].ID_Ребенка]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить посещаемость ребёнка
router.get('/my-child/attendance', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });

    try {
        const child = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (child.rows.length === 0) return res.json([]);

        const result = await pool.query(
            `SELECT "Дата", "Время_прихода", "Время_ухода"
       FROM "Посещаемость"
       WHERE "ID_Ребенка" = $1
       ORDER BY "Дата" DESC
       LIMIT 30`,
            [child.rows[0].ID_Ребенка]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить родственное древо
router.get('/my-child/family-tree', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });

    try {
        const child = await pool.query(
            `SELECT d."ID_Ребенка", d."Фамилия", d."Имя", d."Дата рождения"
       FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (child.rows.length === 0) return res.json({ child: null, relatives: [] });

        const relatives = await pool.query(
            `SELECT r."Фамилия", r."Имя", r."Отчество", sr."Степени_родства" as "Статус"
       FROM "Родители" r
       JOIN "Степень родства" sr ON r."ID_Степени" = sr."ID_Степени"
       JOIN "Родители-дети" rd ON r."Id_Родителя" = rd."ID_Родителя"
       WHERE rd."ID_Ребенка" = $1`,
            [child.rows[0].ID_Ребенка]
        );

        res.json({ child: child.rows[0], relatives: relatives.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Индивидуальные занятия, на которые записан ребёнок
router.get('/my-child/lessons', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });
    try {
        const child = await pool.query(
            `SELECT d."ID_Ребенка" FROM "Дети" d
       JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
       WHERE rd."ID_Родителя" = $1`,
            [req.user.id]
        );
        if (child.rows.length === 0) return res.json([]);
        const lessons = await pool.query(
            `SELECT p."ID_Занятия", iz."Название", iz."Стоимость", p."Дата_проведения"
       FROM "Посещенные платные занятия" p
       JOIN "Индивидуальные занятия" iz ON p."ID_Занятия" = iz."ID_Занятия"
       WHERE p."ID_Ребенка" = $1`,
            [child.rows[0].ID_Ребенка]
        );
        res.json(lessons.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/my-child/payments', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403);
    try {
        const payments = await pool.query(
            `SELECT p.*, iz."Название" FROM "Платежи" p
       LEFT JOIN "Индивидуальные занятия" iz ON p."ID_Занятия" = iz."ID_Занятия"
       WHERE p."ID_Родителя" = $1`,
            [req.user.id]
        );
        res.json(payments.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить список доступных платных занятий
router.get('/paid-lessons', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT "ID_Занятия", "Название", "Стоимость", "День_недели", "Время_начала"
      FROM "Индивидуальные занятия"
      ORDER BY "День_недели", "Время_начала"
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Запись ребёнка на платное занятие
router.post('/register-lesson', authMiddleware, async (req, res) => {
    if (req.user.role !== 'parent') return res.status(403).json({ message: 'Доступ запрещён' });
    const { lessonId, date } = req.body;
    if (!lessonId || !date) return res.status(400).json({ message: 'Не хватает данных' });
    try {
        const childRes = await pool.query(`
      SELECT d."ID_Ребенка" FROM "Дети" d
      JOIN "Родители-дети" rd ON d."ID_Ребенка" = rd."ID_Ребенка"
      WHERE rd."ID_Родителя" = $1
    `, [req.user.id]);
        if (childRes.rows.length === 0) return res.status(404).json({ message: 'Ребёнок не найден' });
        await pool.query(`
      INSERT INTO "Посещенные платные занятия" ("ID_Ребенка", "ID_Занятия", "Дата_проведения")
      VALUES ($1, $2, $3)
    `, [childRes.rows[0].ID_Ребенка, lessonId, date]);
        res.json({ success: true, message: 'Запись успешно оформлена' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;