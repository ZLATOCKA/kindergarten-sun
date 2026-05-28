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

// ========== ОТЧЁТ 1: ПОСЕЩАЕМОСТЬ ДЕТЕЙ (с фильтром по дате) ==========
router.get('/attendance', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let query = `
            SELECT 
                d."Фамилия" || ' ' || d."Имя" as child_name,
                COUNT(p."Дата") as days_count
            FROM kindergarten_db."Дети" d
            LEFT JOIN kindergarten_db."Посещаемость" p ON d."ID_Ребенка" = p."ID_Ребенка"
        `;

        const params = [];
        if (start_date && end_date) {
            query += ` WHERE p."Дата" BETWEEN $1 AND $2`;
            params.push(start_date, end_date);
        }

        query += `
            GROUP BY d."ID_Ребенка", d."Фамилия", d."Имя"
            ORDER BY days_count DESC
        `;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Attendance error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ОТЧЁТ 2: ЗАНЯТОСТЬ СОТРУДНИКОВ (с фильтром по дате) ==========
router.get('/employee-workload', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let query = `
            SELECT 
                s."Фамилия" || ' ' || s."Имя" as employee_name,
                COUNT(gr."Дата") as work_days
            FROM kindergarten_db."Сотрудники" s
            LEFT JOIN kindergarten_db."График Работы" gr ON s."ID_Сотрудника" = gr."ID_Сотрудника"
        `;

        const params = [];
        if (start_date && end_date) {
            query += ` WHERE gr."Дата" BETWEEN $1 AND $2`;
            params.push(start_date, end_date);
        }

        query += `
            GROUP BY s."ID_Сотрудника", s."Фамилия", s."Имя"
            ORDER BY work_days DESC
        `;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Employee workload error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ОТЧЁТ 3: ПОСТАВКИ (с фильтром по дате) ==========
router.get('/supplies', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let query = `
            SELECT 
                p."Дата_поставки" as supply_date,
                s."Название_компании" as supplier_name,
                f."Название_филиала" as branch_name
            FROM kindergarten_db."Поставки" p
            LEFT JOIN kindergarten_db."Поставщик" s ON p."ID_Поставщика" = s."ID_Поставщика"
            LEFT JOIN kindergarten_db."Филиалы" f ON p."ID_Филиала" = f."ID_Филиалы"
        `;

        const params = [];
        if (start_date && end_date) {
            query += ` WHERE p."Дата_поставки" BETWEEN $1 AND $2`;
            params.push(start_date, end_date);
        }

        query += ` ORDER BY p."Дата_поставки" DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Supplies error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ОТЧЁТ 4: ПРИВИВКИ ДЕТЕЙ (с фильтром по дате) ==========
router.get('/vaccinations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let query = `
            SELECT 
                d."Фамилия" || ' ' || d."Имя" as child_name,
                v."Название_прививки" as vaccine_name,
                TO_CHAR(vr."Дата_проведения", 'DD.MM.YYYY') as vaccine_date,
                vr."Статус" as status
            FROM kindergarten_db."Прививки ребенка" vr
            LEFT JOIN kindergarten_db."Дети" d ON vr."ID_Ребенка" = d."ID_Ребенка"
            LEFT JOIN kindergarten_db."Прививки" v ON vr."ID_Прививки" = v."ID_Прививки"
        `;

        const params = [];
        if (start_date && end_date) {
            query += ` WHERE vr."Дата_проведения" BETWEEN $1 AND $2`;
            params.push(start_date, end_date);
        }

        query += ` ORDER BY vr."Дата_проведения" DESC`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Vaccinations error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;