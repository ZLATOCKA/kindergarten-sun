const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const childrenRoutes = require('./routes/childrenRoutes');
const employeesRoutes = require('./routes/employeesRoutes');
const lessonsRoutes = require('./routes/lessonsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// ПОДКЛЮЧАЕМ ВСЕ РОУТЫ
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

// ❗ ДОБАВЬ ЭТУ СТРОЧКУ - ЭТО ГЛАВНОЕ ИСПРАВЛЕНИЕ
app.use('/api/admin/employees', employeesRoutes);   // ← новый путь для админки

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`✅ Доступные маршруты профиля:`);
    console.log(`   GET    http://localhost:${PORT}/api/admin/employees/my-profile`);
    console.log(`   PUT    http://localhost:${PORT}/api/admin/employees/my-profile`);
});