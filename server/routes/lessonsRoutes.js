const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const saltRounds = 10;

// РЕГИСТРАЦИЯ
router.post('/register', async (req, res) => {
    const { email, password, name, phone, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (role === 'parent') {
            const result = await pool.query(
                `INSERT INTO "Родители" ("Фамилия", "Имя", "Телефон", "Email", "PasswordHash", "ID_Степени")
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING "Id_Родителя"`,
                [name.split(' ')[0] || '', name.split(' ')[1] || '', phone, email, hashedPassword, 1]
            );

            const token = jwt.sign({ id: result.rows[0].Id_Родителя, role: 'parent' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, user: { id: result.rows[0].Id_Родителя, name, role: 'parent', email } });
        } else {
            const result = await pool.query(
                `INSERT INTO "Сотрудники" ("Фамилия", "Имя", "Телефон", "Email", "PasswordHash")
         VALUES ($1, $2, $3, $4, $5) RETURNING "ID_Сотрудника"`,
                [name.split(' ')[0] || '', name.split(' ')[1] || '', phone, email, hashedPassword]
            );

            const token = jwt.sign({ id: result.rows[0].ID_Сотрудника, role: 'employee' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, user: { id: result.rows[0].ID_Сотрудника, name, role: 'employee', email } });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ВХОД
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        if (role === 'employee') {
            const result = await pool.query(`SELECT * FROM "Сотрудники" WHERE "Email" = $1`, [email]);
            const user = result.rows[0];
            if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }
            const token = jwt.sign({ id: user.ID_Сотрудника, role: 'employee' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, user: { id: user.ID_Сотрудника, name: `${user.Фамилия} ${user.Имя}`, role: 'employee', email } });
        }
        else if (role === 'parent') {
            const result = await pool.query(`SELECT * FROM "Родители" WHERE "Email" = $1`, [email]);
            const user = result.rows[0];
            if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }
            const token = jwt.sign({ id: user.Id_Родителя, role: 'parent' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, user: { id: user.Id_Родителя, name: `${user.Фамилия} ${user.Имя}`, role: 'parent', email } });
        }
        res.status(400).json({ message: 'Неверная роль' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;