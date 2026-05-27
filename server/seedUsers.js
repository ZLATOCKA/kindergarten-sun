const bcrypt = require('bcrypt');
const pool = require('./db');

const saltRounds = 10;

async function seedUsers() {
    try {
        console.log('🔌 Подключение к БД...');
        await pool.query('SET search_path TO kindergarten_db, public');
        const test = await pool.query('SELECT NOW()');
        console.log('✅ Подключение успешно!', test.rows[0]);

        // Сотрудники — пароль 123456
        const employees = [
            { email: 'director.kindergarten@gmail.com', password: '123456', userId: 1, role: 'employee' },
            { email: 'nurse.kindergarten@gmail.com', password: '123456', userId: 5, role: 'employee' },
            { email: 'teacher.kozlov@gmail.com', password: '123456', userId: 2, role: 'employee' },
            { email: 'teacher.volkova@gmail.com', password: '123456', userId: 3, role: 'employee' },
        ];

        for (const emp of employees) {
            const hashedPassword = await bcrypt.hash(emp.password, saltRounds);
            await pool.query(
                `UPDATE "Сотрудники" SET "PasswordHash" = $1, "Email" = $2 WHERE "ID_Сотрудника" = $3`,
                [hashedPassword, emp.email, emp.userId]
            );
            console.log(`✅ Обновлён сотрудник: ${emp.email}`);
        }

        // Родители — пароль parent123
        const parents = [
            { email: 'ivanova.anna@gmail.com', password: 'parent123', userId: 1 },
            { email: 'petrova.olga@gmail.com', password: 'parent123', userId: 3 },
            { email: 'pavlov.stanislav@yandex.ru', password: 'parent123', userId: 149 },
        ];

        for (const parent of parents) {
            const hashedPassword = await bcrypt.hash(parent.password, saltRounds);
            await pool.query(
                `UPDATE "Родители" SET "PasswordHash" = $1, "Email" = $2 WHERE "Id_Родителя" = $3`,
                [hashedPassword, parent.email, parent.userId]
            );
            console.log(`✅ Обновлён родитель: ${parent.email}`);
        }

        console.log('🎉 Все пользователи обновлены!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Ошибка:', err);
        process.exit(1);
    }
}

seedUsers();