const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Доступ запрещён' });
    next();
};

// ========== СОТРУДНИКИ ==========
router.get('/employees', authMiddleware, isAdmin, async (req, res) => {
    const result = await pool.query(`SELECT "ID_Сотрудника" as id, "Фамилия", "Имя", "Телефон" FROM "Сотрудники"`);
    res.json(result.rows);
});
router.post('/employees', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, Телефон } = req.body;
    const result = await pool.query(
        `INSERT INTO "Сотрудники" ("Фамилия", "Имя", "Телефон") VALUES ($1, $2, $3) RETURNING "ID_Сотрудника"`,
        [Фамилия, Имя, Телефон]
    );
    res.json({ id: result.rows[0].ID_Сотрудника });
});
router.put('/employees/:id', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, Телефон } = req.body;
    await pool.query(`UPDATE "Сотрудники" SET "Фамилия"=$1, "Имя"=$2, "Телефон"=$3 WHERE "ID_Сотрудника"=$4`,
        [Фамилия, Имя, Телефон, req.params.id]);
    res.json({ success: true });
});
router.delete('/employees/:id', authMiddleware, isAdmin, async (req, res) => {
    await pool.query(`DELETE FROM "Сотрудники" WHERE "ID_Сотрудника"=$1`, [req.params.id]);
    res.json({ success: true });
});

// ========== ДЕТИ ==========
router.get('/children', authMiddleware, isAdmin, async (req, res) => {
    const result = await pool.query(`SELECT "ID_Ребенка" as id, "Фамилия", "Имя", "Дата рождения" FROM "Дети"`);
    res.json(result.rows);
});
router.post('/children', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, "Дата рождения": Дата_рождения, Пол } = req.body;
    const result = await pool.query(
        `INSERT INTO "Дети" ("Фамилия", "Имя", "Дата рождения", "Пол") VALUES ($1,$2,$3,$4) RETURNING "ID_Ребенка"`,
        [Фамилия, Имя, Дата_рождения, Пол]
    );
    res.json({ id: result.rows[0].ID_Ребенка });
});
router.put('/children/:id', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, "Дата рождения": Дата_рождения, Пол } = req.body;
    await pool.query(`UPDATE "Дети" SET "Фамилия"=$1, "Имя"=$2, "Дата рождения"=$3, "Пол"=$4 WHERE "ID_Ребенка"=$5`,
        [Фамилия, Имя, Дата_рождения, Пол, req.params.id]);
    res.json({ success: true });
});
router.delete('/children/:id', authMiddleware, isAdmin, async (req, res) => {
    await pool.query(`DELETE FROM "Дети" WHERE "ID_Ребенка"=$1`, [req.params.id]);
    res.json({ success: true });
});

// ========== РОДИТЕЛИ ==========
router.get('/parents', authMiddleware, isAdmin, async (req, res) => {
    const result = await pool.query(`SELECT "Id_Родителя" as id, "Фамилия", "Имя", "Телефон" FROM "Родители"`);
    res.json(result.rows);
});
router.post('/parents', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, Телефон } = req.body;
    const result = await pool.query(
        `INSERT INTO "Родители" ("Фамилия", "Имя", "Телефон") VALUES ($1,$2,$3) RETURNING "Id_Родителя"`,
        [Фамилия, Имя, Телефон]
    );
    res.json({ id: result.rows[0].Id_Родителя });
});
router.put('/parents/:id', authMiddleware, isAdmin, async (req, res) => {
    const { Фамилия, Имя, Телефон } = req.body;
    await pool.query(`UPDATE "Родители" SET "Фамилия"=$1, "Имя"=$2, "Телефон"=$3 WHERE "Id_Родителя"=$4`,
        [Фамилия, Имя, Телефон, req.params.id]);
    res.json({ success: true });
});
router.delete('/parents/:id', authMiddleware, isAdmin, async (req, res) => {
    await pool.query(`DELETE FROM "Родители" WHERE "Id_Родителя"=$1`, [req.params.id]);
    res.json({ success: true });
});

// ========== ГРУППЫ ==========
router.get('/groups', authMiddleware, isAdmin, async (req, res) => {
    const result = await pool.query(`SELECT "ID_Группы" as id, "Название_Группы", "ID_Категории" FROM "Группы"`);
    res.json(result.rows);
});
router.post('/groups', authMiddleware, isAdmin, async (req, res) => {
    const { Название_Группы, ID_Категории } = req.body;
    const result = await pool.query(
        `INSERT INTO "Группы" ("Название_Группы", "ID_Категории") VALUES ($1,$2) RETURNING "ID_Группы"`,
        [Название_Группы, ID_Категории]
    );
    res.json({ id: result.rows[0].ID_Группы });
});
router.put('/groups/:id', authMiddleware, isAdmin, async (req, res) => {
    const { Название_Группы, ID_Категории } = req.body;
    await pool.query(`UPDATE "Группы" SET "Название_Группы"=$1, "ID_Категории"=$2 WHERE "ID_Группы"=$3`,
        [Название_Группы, ID_Категории, req.params.id]);
    res.json({ success: true });
});
router.delete('/groups/:id', authMiddleware, isAdmin, async (req, res) => {
    await pool.query(`DELETE FROM "Группы" WHERE "ID_Группы"=$1`, [req.params.id]);
    res.json({ success: true });
});

// ========== ЗАНЯТИЯ (индивидуальные) ==========
router.get('/lessons', authMiddleware, isAdmin, async (req, res) => {
    const result = await pool.query(`SELECT "ID_Занятия" as id, "Название", "Стоимость" FROM "Индивидуальные занятия"`);
    res.json(result.rows);
});
router.post('/lessons', authMiddleware, isAdmin, async (req, res) => {
    const { Название, Стоимость } = req.body;
    const result = await pool.query(
        `INSERT INTO "Индивидуальные занятия" ("Название", "Стоимость") VALUES ($1,$2) RETURNING "ID_Занятия"`,
        [Название, Стоимость]
    );
    res.json({ id: result.rows[0].ID_Занятия });
});
router.put('/lessons/:id', authMiddleware, isAdmin, async (req, res) => {
    const { Название, Стоимость } = req.body;
    await pool.query(`UPDATE "Индивидуальные занятия" SET "Название"=$1, "Стоимость"=$2 WHERE "ID_Занятия"=$3`,
        [Название, Стоимость, req.params.id]);
    res.json({ success: true });
});
router.delete('/lessons/:id', authMiddleware, isAdmin, async (req, res) => {
    await pool.query(`DELETE FROM "Индивидуальные занятия" WHERE "ID_Занятия"=$1`, [req.params.id]);
    res.json({ success: true });
});

module.exports = router;