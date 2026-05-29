const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const childrenRoutes = require('./routes/childrenRoutes');
const employeesRoutes = require('./routes/employeesRoutes');
const lessonsRoutes = require('./routes/lessonsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const medicalRoutes = require('./routes/medicalRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const parentRoutes = require('./routes/parentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', medicalRoutes);
app.use('/api/admin', supplyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/parent', parentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});