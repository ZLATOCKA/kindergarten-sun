const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Получить данные сотрудника для его личного кабинета
router.get('/my-profile', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Доступ запрещён' });
    }
    try {
        const result = await pool.query(
            `SELECT s."Фамилия", s."Имя", s."Отчество", s."Дата_рождения",
              d."Название_должности" as "Должность", d."Оклад",
              f."Название_филиала" as "Филиал",
              s."Телефон"
       FROM "Сотрудники" s
       LEFT JOIN "Должности" d ON s."ID_Должности" = d."ID_Должности"
       LEFT JOIN "Филиалы" f ON s."ID_Филиала" = f."ID_Филиалы"
       WHERE s."ID_Сотрудника" = $1`,
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Обновление профиля сотрудника
router.put('/my-profile', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employee') return res.status(403);
    const { Фамилия, Имя, Отчество, Телефон } = req.body;
    try {
        await pool.query(
            `UPDATE "Сотрудники" SET "Фамилия"=$1, "Имя"=$2, "Отчество"=$3, "Телефон"=$4 WHERE "ID_Сотрудника"=$5`,
            [Фамилия, Имя, Отчество, Телефон, req.user.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Получить график работы сотрудника
router.get('/my-schedule', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employee') return res.status(403).json({ message: 'Доступ запрещён' });
    try {
        const result = await pool.query(
            `SELECT gr."День_недели", s."Название_смены", s."Время_начала", s."Время_окончания", gr."Дата"
       FROM "График Работы" gr
       JOIN "Смены" s ON gr."ID_Смены" = s."ID_Смены"
       WHERE gr."ID_Сотрудника" = $1
       ORDER BY gr."Дата" DESC
       LIMIT 30`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Отпуска сотрудника
router.get('/my-vacations', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employee') return res.status(403);
    try {
        const vacations = await pool.query(
            `SELECT "Дата_начала" as start, "Дата_окончания" as end FROM "График Отпусков" WHERE "ID_Сотрудника" = $1`,
            [req.user.id]
        );
        res.json(vacations.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Индивидуальные занятия сотрудника
router.get('/my-individual-lessons', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employee') return res.status(403);
    try {
        const lessons = await pool.query(
            `SELECT * FROM "Индивидуальные занятия" WHERE "ID_Сотрудника" = $1`,
            [req.user.id]
        );
        res.json(lessons.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// (Опционально) получить всех сотрудников – для страницы "Наши работники"
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s."ID_Сотрудника", s."Фамилия", s."Имя", s."Отчество",
              d."Название_должности" as "Должность",
              f."Название_филиала" as "Филиал",
              s."Телефон"
       FROM "Сотрудники" s
       JOIN "Должности" d ON s."ID_Должности" = d."ID_Должности"
       JOIN "Филиалы" f ON s."ID_Филиала" = f."ID_Филиалы"
       ORDER BY s."ID_Сотрудника"`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;