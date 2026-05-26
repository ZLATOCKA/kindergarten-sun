const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres', // база данных postgres
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Устанавливаем схему kindergarten_db для всех запросов
pool.on('connect', (client) => {
    client.query('SET search_path TO kindergarten_db, public');
});

module.exports = pool;