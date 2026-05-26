const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const saltRounds = 10;

// Регистрация
router.post('/register', async (req, res) => {
    const { email, password, name, phone, role, address, passport, birthDate, positionId, branchId, hireDate } = req.body;

    if (!email || !password || !name || !phone) {
        return res.status(400).json({ message: 'Заполните все обязательные поля' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (role === 'parent') {
            if (!address || !passport) {
                return res.status(400).json({ message: 'Для родителя нужны адрес и паспортные данные' });
            }
            const result = await pool.query(
                `INSERT INTO "Родители" 
         ("Фамилия", "Имя", "Телефон", "Адрес", "Паспортные данные", "Email", "PasswordHash", "ID_Степени")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING "Id_Родителя"`,
                [name.split(' ')[0] || '', name.split(' ')[1] || '', phone, address, passport, email, hashedPassword, 1]
            );
            const token = jwt.sign({ id: result.rows[0].Id_Родителя, role: 'parent' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, user: { id: result.rows[0].Id_Родителя, name, role: 'parent', email, phone } });
        }
        else if (role === 'employee' || role === 'admin') {
            if (!address || !birthDate || !positionId || !branchId) {
                return res.status(400).json({ message: 'Для сотрудника нужны адрес, дата рождения, должность и филиал' });
            }
            const result = await pool.query(
                `INSERT INTO "Сотрудники" 
         ("Фамилия", "Имя", "Телефон", "Адрес", "Дата_рождения", "Email", "PasswordHash", "ID_Должности", "ID_Филиала", "Роль", "Дата_приема")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
         RETURNING "ID_Сотрудника"`,
                [name.split(' ')[0] || '', name.split(' ')[1] || '', phone, address, birthDate, email, hashedPassword, positionId, branchId, role, hireDate || new Date().toISOString().slice(0, 10)]
            );
            const token = jwt.sign({ id: result.rows[0].ID_Сотрудника, role: role }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, user: { id: result.rows[0].ID_Сотрудника, name, role, email, phone } });
        }
        else {
            return res.status(400).json({ message: 'Неверная роль' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Вход
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (role === 'employee' || role === 'admin') {
            const result = await pool.query(`SELECT *, "Роль" as user_role FROM "Сотрудники" WHERE "Email" = $1`, [email]);
            const user = result.rows[0];
            if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }
            const token = jwt.sign({ id: user.ID_Сотрудника, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, user: { id: user.ID_Сотрудника, name: `${user.Фамилия} ${user.Имя}`, role: user.user_role, email, phone: user.Телефон } });
        }
        else if (role === 'parent') {
            const result = await pool.query(`SELECT * FROM "Родители" WHERE "Email" = $1`, [email]);
            const user = result.rows[0];
            if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }
            const token = jwt.sign({ id: user.Id_Родителя, role: 'parent' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, user: { id: user.Id_Родителя, name: `${user.Фамилия} ${user.Имя}`, role: 'parent', email, phone: user.Телефон } });
        }
        res.status(400).json({ message: 'Неверная роль' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;