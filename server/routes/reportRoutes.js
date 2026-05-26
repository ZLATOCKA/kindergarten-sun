const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Посещаемость
router.get('/attendance', authMiddleware, async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const result = await pool.query(`
      SELECT d."Фамилия", d."Имя", COUNT(p."Дата") as посещений
      FROM "Дети" d
      LEFT JOIN "Посещаемость" p ON d."ID_Ребенка" = p."ID_Ребенка"
        AND p."Дата" BETWEEN $1 AND $2
      GROUP BY d."ID_Ребенка"
    `, [start_date, end_date]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Занятость сотрудников
router.get('/employee-workload', authMiddleware, async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const result = await pool.query(`
      SELECT s."Фамилия", s."Имя", COUNT(p."ID_Плана") as занятий
      FROM "Сотрудники" s
      LEFT JOIN "План занятий" p ON s."ID_Сотрудника" = p."ID_Сотрудника"
        AND p."Дата" BETWEEN $1 AND $2
      GROUP BY s."ID_Сотрудника"
    `, [start_date, end_date]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Поставки
router.get('/supplies', authMiddleware, async (req, res) => {
    const { start_date, end_date } = req.query;
    try {
        const result = await pool.query(`
      SELECT post."Название_компании", SUM(tp."Количество" * tp."Цена_за_единицу") as сумма
      FROM "Поставки" p
      JOIN "Поставщик" post ON p."ID_Поставщика" = post."ID_Поставщика"
      JOIN "Товары в поставке" tp ON p."ID_Поставки" = tp."ID_Поставки"
      WHERE p."Дата_поставки" BETWEEN $1 AND $2
      GROUP BY post."Название_компании"
    `, [start_date, end_date]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Прививки
router.get('/vaccinations', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT d."Фамилия", d."Имя", v."Название_прививки", pr."Дата_проведения"
      FROM "Прививки ребенка" pr
      JOIN "Дети" d ON pr."ID_Ребенка" = d."ID_Ребенка"
      JOIN "Прививки" v ON pr."ID_Прививки" = v."ID_Прививки"
    `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;