const bcrypt = require('bcrypt');
const pool = require('./db');

const saltRounds = 10;

async function seedUsers() {
    try {
        console.log('🔌 Подключение к БД...');

        await pool.query('SET search_path TO kindergarten_db, public');

        const test = await pool.query('SELECT NOW()');
        console.log('✅ Подключение успешно!', test.rows[0]);

        // Только существующие пользователи (ID из твоих таблиц)
        const usersToUpdate = [
            // Сотрудники
            { email: 'director@sun.ru', password: '123456', userId: 1, role: 'employee' },
            { email: 'nurse@sun.ru', password: '123456', userId: 5, role: 'employee' },
            { email: 'teacher1@sun.ru', password: '123456', userId: 2, role: 'employee' },
            { email: 'teacher2@sun.ru', password: '123456', userId: 3, role: 'employee' },

            // Родители (Id_Родителя из таблицы)
            { email: 'parent_ivanova@sun.ru', password: '123456', userId: 1, role: 'parent' },
            { email: 'parent_petrova@sun.ru', password: '123456', userId: 3, role: 'parent' },
        ];

        for (const user of usersToUpdate) {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);

            if (user.role === 'employee') {
                await pool.query(
                    `UPDATE "Сотрудники" 
           SET "PasswordHash" = $1, "Email" = $2
           WHERE "ID_Сотрудника" = $3`,
                    [hashedPassword, user.email, user.userId]
                );
                console.log(`✅ Обновлён сотрудник: ${user.email} (ID: ${user.userId})`);
            } else if (user.role === 'parent') {
                await pool.query(
                    `UPDATE "Родители" 
           SET "PasswordHash" = $1, "Email" = $2
           WHERE "Id_Родителя" = $3`,
                    [hashedPassword, user.email, user.userId]
                );
                console.log(`✅ Обновлён родитель: ${user.email} (ID: ${user.userId})`);
            }
        }

        console.log('🎉 Все пользователи обновлены!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Ошибка:', err);
        process.exit(1);
    }
}

seedUsers();