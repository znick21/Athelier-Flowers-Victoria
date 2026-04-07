const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:              process.env.DB_HOST || '127.0.0.1',
  user:              process.env.DB_USER || 'root',
  password:          process.env.DB_PASS || '',
  database:          process.env.DB_NAME || 'floreriabd',
  port:              Number(process.env.DB_PORT) || 3306,
  charset:           'utf8mb4',
  decimalNumbers:    true
});

// Forzar UTF-8 en cada conexión nueva del pool
pool.pool.on('connection', connection => {
  connection.query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
});

module.exports = pool;
