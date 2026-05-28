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

// ========== ПРИВИВКИ ==========
router.get('/vaccinations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "Прививки" ORDER BY id`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/vaccinations', authMiddleware, isAdmin, async (req, res) => {
    const { ID_Ребенка, Название_прививки, Дата_проведения, Статус } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO "Прививки" ("ID_Ребенка", "Название_прививки", "Дата_проведения", "Статус") 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [ID_Ребенка, Название_прививки, Дата_проведения, Статус]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/vaccinations/:id', authMiddleware, isAdmin, async (req, res) => {
    const { ID_Ребенка, Название_прививки, Дата_проведения, Статус } = req.body;
    try {
        await pool.query(
            `UPDATE "Прививки" SET "ID_Ребенка"=$1, "Название_прививки"=$2, "Дата_проведения"=$3, "Статус"=$4 WHERE id=$5`,
            [ID_Ребенка, Название_прививки, Дата_проведения, Статус, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/vaccinations/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await pool.query(`DELETE FROM "Прививки" WHERE id=$1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ========== ЗАБОЛЕВАНИЯ ==========
router.get('/diseases', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM "Заболевания" ORDER BY id`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/diseases', authMiddleware, isAdmin, async (req, res) => {
    const { ID_Ребенка, Название_заболевания, Дата_начала, Дата_окончания } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO "Заболевания" ("ID_Ребенка", "Название_заболевания", "Дата_начала", "Дата_окончания") 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [ID_Ребенка, Название_заболевания, Дата_начала, Дата_окончания]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/diseases/:id', authMiddleware, isAdmin, async (req, res) => {
    const { ID_Ребенка, Название_заболевания, Дата_начала, Дата_окончания } = req.body;
    try {
        await pool.query(
            `UPDATE "Заболевания" SET "ID_Ребенка"=$1, "Название_заболевания"=$2, "Дата_начала"=$3, "Дата_окончания"=$4 WHERE id=$5`,
            [ID_Ребенка, Название_заболевания, Дата_начала, Дата_окончания, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/diseases/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await pool.query(`DELETE FROM "Заболевания" WHERE id=$1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;