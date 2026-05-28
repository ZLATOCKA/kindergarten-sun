const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// ТОЛЬКО ВХОД (регистрации нет)
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    console.log('🔐 LOGIN attempt:', { email, role });

    try {
        // ================= СОТРУДНИК / АДМИН =================
        if (role === 'employee' || role === 'admin') {
            const result = await pool.query(
                `SELECT 
                    "ID_Сотрудника" as employee_id,
                    "Фамилия",
                    "Имя",
                    "Телефон",
                    "Email",
                    "PasswordHash" as passwordhash,
                    "Роль" as role
                FROM "Сотрудники"
                WHERE "Email" = $1`,
                [email]
            );

            const user = result.rows[0];
            console.log('👤 USER FROM DB:', user);

            if (!user) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordhash);
            if (!isMatch) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            // ПРАВИЛЬНЫЙ JWT — используем employee_id
            const token = jwt.sign(
                { id: user.employee_id, role: user.role || 'employee' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                token,
                user: {
                    id: user.employee_id,
                    name: `${user.Фамилия} ${user.Имя}`,
                    role: user.role || 'employee',
                    email: user.Email,
                    phone: user.Телефон
                }
            });
        }

        // ================= РОДИТЕЛЬ =================
        if (role === 'parent') {
            const result = await pool.query(
                `SELECT 
                    "Id_Родителя" as parent_id,
                    "Фамилия",
                    "Имя",
                    "Телефон",
                    "Email",
                    "PasswordHash" as passwordhash
                FROM "Родители"
                WHERE "Email" = $1`,
                [email]
            );

            const user = result.rows[0];
            console.log('👨‍👩‍👧 PARENT FROM DB:', user);

            if (!user) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordhash);
            if (!isMatch) {
                return res.status(401).json({ message: 'Неверный email или пароль' });
            }

            const token = jwt.sign(
                { id: user.parent_id, role: 'parent' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                token,
                user: {
                    id: user.parent_id,
                    name: `${user.Фамилия} ${user.Имя}`,
                    role: 'parent',
                    email: user.Email,
                    phone: user.Телефон
                }
            });
        }

        return res.status(400).json({ message: 'Неверная роль' });
    } catch (err) {
        console.error('❌ LOGIN ERROR:', err);
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;