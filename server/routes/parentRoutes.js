const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// ========== ПОЛУЧИТЬ ПРОФИЛЬ РОДИТЕЛЯ ==========
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p."Id_Родителя" as id,
                p."Фамилия",
                p."Имя",
                p."Отчество",
                p."Адрес",
                p."Телефон",
                p."Email",
                sr."Степени_родства" as "Степень_родства"
            FROM kindergarten_db."Родители" p
            LEFT JOIN kindergarten_db."Степень родства" sr ON p."ID_Степени" = sr."ID_Степени"
            WHERE p."Id_Родителя" = $1
        `, [req.user.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Родитель не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Get parent profile error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ОБНОВИТЬ ПРОФИЛЬ РОДИТЕЛЯ ==========
router.put('/profile', authMiddleware, async (req, res) => {
    const { Фамилия, Имя, Отчество, Адрес, Телефон, Email, password } = req.body;
    try {
        let query = `
            UPDATE kindergarten_db."Родители" SET 
                "Фамилия"=$1, "Имя"=$2, "Отчество"=$3, "Адрес"=$4, "Телефон"=$5, "Email"=$6
        `;
        const params = [Фамилия, Имя, Отчество, Адрес, Телефон, Email, req.user.id];
        
        if (password) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, "PasswordHash"=$${params.length + 1}`;
            params.push(hashedPassword);
        }
        
        query += ` WHERE "Id_Родителя"=$${params.length}`;
        await pool.query(query, params);
        res.json({ success: true });
    } catch (err) {
        console.error('Update parent profile error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ДЕТЕЙ РОДИТЕЛЯ ==========
router.get('/my-children', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                d."ID_Ребенка" as id,
                d."Фамилия",
                d."Имя",
                d."Отчество",
                d."Дата рождения",
                d."Пол",
                g."Название_Группы" as "Группа",
                f."Название_филиала" as "Филиал"
            FROM kindergarten_db."Родители-дети" rd
            JOIN kindergarten_db."Дети" d ON rd."ID_Ребенка" = d."ID_Ребенка"
            LEFT JOIN kindergarten_db."Дети в группе" dg ON d."ID_Ребенка" = dg."ID_Ребенка"
            LEFT JOIN kindergarten_db."Группы" g ON dg."ID_Группы" = g."ID_Группы"
            LEFT JOIN kindergarten_db."Филиалы" f ON g."ID_Филиала" = f."ID_Филиалы"
            WHERE rd."ID_Родителя" = $1
        `, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Get children error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ СЕМЕЙНОЕ ДРЕВО ==========
router.get('/family-tree', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                r."Фамилия",
                r."Имя",
                r."Отчество",
                sr."Степени_родства" as "Статус"
            FROM kindergarten_db."Родители-дети" rd
            JOIN kindergarten_db."Родители" r ON rd."ID_Родителя" = r."Id_Родителя"
            JOIN kindergarten_db."Степень родства" sr ON r."ID_Степени" = sr."ID_Степени"
            WHERE rd."ID_Ребенка" IN (
                SELECT "ID_Ребенка" FROM kindergarten_db."Родители-дети" WHERE "ID_Родителя" = $1
            )
            GROUP BY r."Id_Родителя", r."Фамилия", r."Имя", r."Отчество", sr."Степени_родства"
        `, [req.user.id]);
        res.json({ relatives: result.rows });
    } catch (err) {
        console.error('Get family tree error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ДОСТУПНЫЕ ПЛАТНЫЕ ЗАНЯТИЯ ==========
router.get('/available-lessons', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                l."ID_Занятия" as id,
                l."Название",
                l."День_недели",
                l."Время_начала",
                l."Время_окончания",
                l."Стоимость",
                s."Фамилия" || ' ' || s."Имя" as "Педагог"
            FROM kindergarten_db."Индивидуальные занятия" l
            LEFT JOIN kindergarten_db."Сотрудники" s ON l."ID_Сотрудника" = s."ID_Сотрудника"
            ORDER BY l."ID_Занятия"
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Get available lessons error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ЗАПИСАННЫЕ ЗАНЯТИЯ РЕБЁНКА ==========
router.get('/child-lessons/:childId', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                ppz."ID_Занятия" as lesson_id,
                ppz."Дата_проведения" as date,
                l."Название",
                l."Стоимость",
                s."Фамилия" || ' ' || s."Имя" as teacher,
                ppz."Дата_проведения" >= CURRENT_DATE as is_upcoming
            FROM kindergarten_db."Посещенные платные занятия" ppz
            JOIN kindergarten_db."Индивидуальные занятия" l ON ppz."ID_Занятия" = l."ID_Занятия"
            JOIN kindergarten_db."Сотрудники" s ON l."ID_Сотрудника" = s."ID_Сотрудника"
            WHERE ppz."ID_Ребенка" = $1
            ORDER BY ppz."Дата_проведения" ASC
        `, [req.params.childId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Get child lessons error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ЗАПИСАТЬ РЕБЁНКА НА ЗАНЯТИЕ ==========
router.post('/book-lesson', authMiddleware, async (req, res) => {
    const { child_id, lesson_id, date } = req.body;
    try {
        // Проверяем, не записан ли уже ребёнок на это занятие в эту дату
        const check = await pool.query(`
            SELECT * FROM kindergarten_db."Посещенные платные занятия"
            WHERE "ID_Ребенка" = $1 AND "ID_Занятия" = $2 AND "Дата_проведения" = $3
        `, [child_id, lesson_id, date]);
        
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Ребёнок уже записан на это занятие' });
        }
        
        const result = await pool.query(`
            INSERT INTO kindergarten_db."Посещенные платные занятия" ("ID_Ребенка", "ID_Занятия", "Дата_проведения")
            VALUES ($1, $2, $3)
            RETURNING *
        `, [child_id, lesson_id, date]);
        
        res.json({ success: true, booking: result.rows[0] });
    } catch (err) {
        console.error('Book lesson error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ОТМЕНИТЬ ЗАПИСЬ НА ЗАНЯТИЕ ==========
router.delete('/cancel-lesson/:childId/:lessonId/:date', authMiddleware, async (req, res) => {
    try {
        await pool.query(`
            DELETE FROM kindergarten_db."Посещенные платные занятия"
            WHERE "ID_Ребенка" = $1 AND "ID_Занятия" = $2 AND "Дата_проведения" = $3
        `, [req.params.childId, req.params.lessonId, req.params.date]);
        res.json({ success: true });
    } catch (err) {
        console.error('Cancel lesson error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ МЕДИЦИНСКИЕ ДАННЫЕ РЕБЁНКА ==========
router.get('/child-medical/:childId', authMiddleware, async (req, res) => {
    try {
        const [certificates, vaccinations, allergies] = await Promise.all([
            pool.query(`SELECT * FROM kindergarten_db."Справки" WHERE "ID_Ребенка" = $1`, [req.params.childId]),
            pool.query(`
                SELECT vr.*, v."Название_прививки" 
                FROM kindergarten_db."Прививки ребенка" vr
                JOIN kindergarten_db."Прививки" v ON vr."ID_Прививки" = v."ID_Прививки"
                WHERE vr."ID_Ребенка" = $1
            `, [req.params.childId]),
            pool.query(`
                SELECT fp."Название_продукта"
                FROM kindergarten_db."Список запрещенных продуктов ребенка" cfp
                JOIN kindergarten_db."Запрещенные продукты" fp ON cfp."ID_Продукта" = fp."ID_Продукта"
                WHERE cfp."ID_Ребенка" = $1
            `, [req.params.childId])
        ]);
        res.json({ certificates: certificates.rows, vaccinations: vaccinations.rows, allergies: allergies.rows });
    } catch (err) {
        console.error('Get medical data error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== ПОЛУЧИТЬ ПОСЕЩАЕМОСТЬ РЕБЁНКА ==========
router.get('/child-attendance/:childId', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                "Дата",
                "Время_прихода",
                "Время_ухода"
            FROM kindergarten_db."Посещаемость"
            WHERE "ID_Ребенка" = $1
            ORDER BY "Дата" DESC
            LIMIT 30
        `, [req.params.childId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Get attendance error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ========== РАССЧИТАТЬ СТОИМОСТЬ ЗАНЯТИЙ ==========
router.get('/total-cost/:childId', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT COALESCE(SUM(l."Стоимость"), 0) as total
            FROM kindergarten_db."Посещенные платные занятия" ppz
            JOIN kindergarten_db."Индивидуальные занятия" l ON ppz."ID_Занятия" = l."ID_Занятия"
            WHERE ppz."ID_Ребенка" = $1
        `, [req.params.childId]);
        res.json({ total: parseFloat(result.rows[0].total) });
    } catch (err) {
        console.error('Calculate total cost error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;