const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware для проверки, что сотрудник - воспитатель
const requireTeacher = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT d."Название_должности" 
             FROM "Сотрудники" s 
             LEFT JOIN "Должности" d ON s."ID_Должности" = d."ID_Должности" 
             WHERE s."ID_Сотрудника" = $1`,
            [req.user.id]
        );
        
        const должность = result.rows[0]?.Название_должности;
        
        if (должность !== 'Воспитатель') {
            return res.status(403).json({ 
                message: 'Доступ только для воспитателей',
                yourRole: должность || 'не определена'
            });
        }
        next();
    } catch (err) {
        console.error('❌ Error in requireTeacher:', err);
        res.status(500).json({ message: err.message });
    }
};

// ========== ПОЛУЧЕНИЕ ПРОФИЛЯ ==========
router.get('/my-profile', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                s."ID_Сотрудника" as id,
                s."Фамилия", 
                s."Имя", 
                s."Отчество", 
                s."Дата_рождения",
                s."Адрес",
                s."Email",
                s."Телефон",
                d."Название_должности" as "Должность", 
                d."Оклад",
                f."Название_филиала" as "Филиал"
            FROM "Сотрудники" s
            LEFT JOIN "Должности" d ON s."ID_Должности" = d."ID_Должности"
            LEFT JOIN "Филиалы" f ON s."ID_Филиала" = f."ID_Филиалы"
            WHERE s."ID_Сотрудника" = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Сотрудник не найден' });
        }
        
        console.log('📋 Profile loaded for user:', req.user.id);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ SQL Error in my-profile:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ОБНОВЛЕНИЕ ПРОФИЛЯ ==========
router.put('/my-profile', authMiddleware, async (req, res) => {
    const { Фамилия, Имя, Отчество, Телефон, Email, Адрес, Дата_рождения } = req.body;
    
    try {
        await pool.query(
            `UPDATE "Сотрудники" 
             SET 
                "Фамилия" = COALESCE($1, "Фамилия"),
                "Имя" = COALESCE($2, "Имя"),
                "Отчество" = $3,
                "Телефон" = COALESCE($4, "Телефон"),
                "Email" = COALESCE($5, "Email"),
                "Адрес" = COALESCE($6, "Адрес"),
                "Дата_рождения" = $7
             WHERE "ID_Сотрудника" = $8`,
            [Фамилия, Имя, Отчество, Телефон, Email, Адрес, Дата_рождения, req.user.id]
        );
        
        res.json({ success: true, message: 'Профиль обновлён' });
    } catch (err) {
        console.error('❌ Error updating profile:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ГРУППЫ СОТРУДНИКА ==========
router.get('/my-groups', authMiddleware, requireTeacher, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                g."ID_Группы", 
                g."Название_Группы"
            FROM "Группа-Сотрудник" gs
            JOIN "Группы" g ON gs."ID_Группы" = g."ID_Группы"
            WHERE gs."ID_Сотрудника" = $1`,
            [req.user.id]
        );
        
        console.log('📚 Groups found:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error in my-groups:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ТИПЫ ЗАНЯТИЙ ==========
router.get('/lesson-types', authMiddleware, requireTeacher, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM "Тип занятия" ORDER BY "ID_Типа_занятия"'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error in lesson-types:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ПЛАНЫ ЗАНЯТИЙ ==========
router.get('/lesson-plans', authMiddleware, requireTeacher, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                p."ID_Плана",
                p."ID_Группы",
                p."Тема_занятия",
                p."Дата",
                p."Время_начала",
                p."Длительность_минут",
                g."Название_Группы",
                t."Название_типа"
            FROM "План занятий" p
            JOIN "Группы" g ON p."ID_Группы" = g."ID_Группы"
            JOIN "Тип занятия" t ON p."ID_Типа_Занятия" = t."ID_Типа_занятия"
            WHERE p."ID_Сотрудника" = $1
            ORDER BY p."Дата" DESC, p."Время_начала"`,
            [req.user.id]
        );
        
        console.log('📋 Lesson plans found:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error in lesson-plans:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== СОЗДАНИЕ ЗАНЯТИЯ ==========
router.post('/lesson-plans', authMiddleware, requireTeacher, async (req, res) => {
    const { group_id, lesson_type_id, topic, date, time_start, duration_minutes } = req.body;
    
    if (!group_id || !lesson_type_id || !topic || !date || !time_start) {
        return res.status(400).json({ message: 'Заполните все поля' });
    }
    
    try {
        // Проверка, что группа принадлежит воспитателю
        const checkGroup = await pool.query(
            `SELECT 1 FROM "Группа-Сотрудник" 
             WHERE "ID_Группы" = $1 AND "ID_Сотрудника" = $2`,
            [group_id, req.user.id]
        );
        
        if (checkGroup.rows.length === 0) {
            return res.status(403).json({ 
                message: 'Вы не закреплены за этой группой' 
            });
        }
        
        const result = await pool.query(
            `INSERT INTO "План занятий" 
             ("ID_Группы", "ID_Сотрудника", "ID_Типа_Занятия", 
              "Тема_занятия", "Дата", "Время_начала", "Длительность_минут")
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [group_id, req.user.id, lesson_type_id, topic, date, time_start, duration_minutes || 30]
        );
        
        console.log('✅ Lesson plan created');
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error creating lesson:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ОБНОВЛЕНИЕ ЗАНЯТИЯ ==========
router.put('/lesson-plans/:id', authMiddleware, requireTeacher, async (req, res) => {
    const { id } = req.params;
    const { topic, date, time_start, duration_minutes, lesson_type_id } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE "План занятий" 
             SET 
                "Тема_занятия" = COALESCE($1, "Тема_занятия"),
                "Дата" = COALESCE($2, "Дата"),
                "Время_начала" = COALESCE($3, "Время_начала"),
                "Длительность_минут" = COALESCE($4, "Длительность_минут"),
                "ID_Типа_Занятия" = COALESCE($5, "ID_Типа_Занятия")
             WHERE "ID_Плана" = $6 AND "ID_Сотрудника" = $7
             RETURNING *`,
            [topic, date, time_start, duration_minutes, lesson_type_id, id, req.user.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Занятие не найдено' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Error updating lesson:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== УДАЛЕНИЕ ЗАНЯТИЯ ==========
router.delete('/lesson-plans/:id', authMiddleware, requireTeacher, async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            `DELETE FROM "План занятий" 
             WHERE "ID_Плана" = $1 AND "ID_Сотрудника" = $2`,
            [id, req.user.id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Занятие не найдено' });
        }
        
        res.json({ success: true, message: 'Занятие удалено' });
    } catch (err) {
        console.error('❌ Error deleting lesson:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ГРАФИК РАБОТЫ ==========
router.get('/my-schedule', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                gr."Дата",
                s."Название_смены",
                s."Время_начала",
                s."Время_окончания"
             FROM "График Работы" gr
             JOIN "Смены" s ON gr."ID_Смены" = s."ID_Смены"
             WHERE gr."ID_Сотрудника" = $1
             ORDER BY gr."Дата" DESC
             LIMIT 30`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error in my-schedule:', err);
        res.status(500).json({ message: err.message });
    }
});

// ========== ОТПУСКА ==========
router.get('/my-vacations', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                "Дата_начала" as start, 
                "Дата_окончания" as end
             FROM "График Отпусков" 
             WHERE "ID_Сотрудника" = $1`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error in my-vacations:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;