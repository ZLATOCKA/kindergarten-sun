const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
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
                COALESCE(sr."Степени_родства", 'Родитель') as "Степень_родства"
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

        if (password && password.trim() !== '') {
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
                COALESCE(g."Название_Группы", 'Не назначена') as "Группа",
                COALESCE(f."Название_филиала", 'Не указан') as "Филиал"
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
        const childrenResult = await pool.query(`
            SELECT "ID_Ребенка" FROM kindergarten_db."Родители-дети" WHERE "ID_Родителя" = $1
        `, [req.user.id]);

        if (childrenResult.rows.length === 0) {
            return res.json({ relatives: [] });
        }

        const childIds = childrenResult.rows.map(r => r.ID_Ребенка);

        const result = await pool.query(`
            SELECT DISTINCT
                r."Фамилия",
                r."Имя",
                r."Отчество",
                COALESCE(sr."Степени_родства", 'Родственник') as status
            FROM kindergarten_db."Родители-дети" rd
            JOIN kindergarten_db."Родители" r ON rd."ID_Родителя" = r."Id_Родителя"
            LEFT JOIN kindergarten_db."Степень родства" sr ON r."ID_Степени" = sr."ID_Степени"
            WHERE rd."ID_Ребенка" = ANY($1::int[])
            ORDER BY r."Фамилия", r."Имя"
        `, [childIds]);

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
                s."Фамилия" || ' ' || s."Имя" as teacher
            FROM kindergarten_db."Индивидуальные занятия" l
            LEFT JOIN kindergarten_db."Сотрудники" s ON l."ID_Сотрудника" = s."ID_Сотрудника"
            ORDER BY 
                CASE l."День_недели"
                    WHEN 'Понедельник' THEN 1
                    WHEN 'Вторник' THEN 2
                    WHEN 'Среда' THEN 3
                    WHEN 'Четверг' THEN 4
                    WHEN 'Пятница' THEN 5
                    WHEN 'Суббота' THEN 6
                    WHEN 'Воскресенье' THEN 7
                    ELSE 8
                END, l."Время_начала"
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
                CASE WHEN ppz."Дата_проведения" >= CURRENT_DATE THEN true ELSE false END as is_upcoming
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
        const check = await pool.query(`
            SELECT * FROM kindergarten_db."Посещенные платные занятия"
            WHERE "ID_Ребенка" = $1 AND "ID_Занятия" = $2 AND "Дата_проведения" = $3
        `, [child_id, lesson_id, date]);

        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'Ребёнок уже записан на это занятие' });
        }

        await pool.query(`
            INSERT INTO kindergarten_db."Посещенные платные занятия" ("ID_Ребенка", "ID_Занятия", "Дата_проведения")
            VALUES ($1, $2, $3)
        `, [child_id, lesson_id, date]);

        res.json({ success: true });
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
        const certificates = await pool.query(`
            SELECT "ID_Справки" as id, "Тип_справка" as type, "Дата_начала" as start_date, "Дата_окончания" as end_date
            FROM kindergarten_db."Справки" WHERE "ID_Ребенка" = $1
        `, [req.params.childId]);

        const vaccinations = await pool.query(`
            SELECT vr."ID_Записи_прививки" as id, v."Название_прививки" as name, vr."Дата_проведения" as date, vr."Статус" as status
            FROM kindergarten_db."Прививки ребенка" vr
            JOIN kindergarten_db."Прививки" v ON vr."ID_Прививки" = v."ID_Прививки"
            WHERE vr."ID_Ребенка" = $1
        `, [req.params.childId]);

        // ИСПРАВЛЕНО: правильное название таблицы "Список запрещенных продуктов"
        const allergies = await pool.query(`
            SELECT fp."Название_продукта" as product
            FROM kindergarten_db."Список запрещенных продуктов" cfp
            JOIN kindergarten_db."Запрещенные продукты" fp ON cfp."ID_Продукта" = fp."ID_Продукта"
            WHERE cfp."ID_Ребенка" = $1
        `, [req.params.childId]);

        res.json({
            certificates: certificates.rows,
            vaccinations: vaccinations.rows,
            allergies: allergies.rows
        });
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
                "Дата" as date,
                "Время_прихода" as arrival,
                "Время_ухода" as departure
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

// ========== ОТМЕНИТЬ ЗАПИСЬ НА ЗАНЯТИЕ ==========
router.delete('/cancel-lesson/:childId/:lessonId/:date', authMiddleware, async (req, res) => {
    try {
        const { childId, lessonId, date } = req.params;

        console.log('Cancel lesson request:', { childId, lessonId, date });

        // Проверяем, существует ли запись
        const checkResult = await pool.query(`
            SELECT * FROM kindergarten_db."Посещенные платные занятия"
            WHERE "ID_Ребенка" = $1 AND "ID_Занятия" = $2 AND "Дата_проведения" = $3
        `, [parseInt(childId), parseInt(lessonId), date]);

        console.log('Found records:', checkResult.rows);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Запись не найдена' });
        }

        // Удаляем запись
        const deleteResult = await pool.query(`
            DELETE FROM kindergarten_db."Посещенные платные занятия"
            WHERE "ID_Ребенка" = $1 AND "ID_Занятия" = $2 AND "Дата_проведения" = $3
            RETURNING *
        `, [parseInt(childId), parseInt(lessonId), date]);

        console.log('Deleted record:', deleteResult.rows);

        res.json({
            success: true,
            deleted: deleteResult.rows[0],
            message: 'Запись успешно отменена'
        });
    } catch (err) {
        console.error('Cancel lesson error:', err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;