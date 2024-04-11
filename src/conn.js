const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'blog_user',
  password: 'blog_password',
  database: 'blog_db',
  port: 33068,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 10,
});

module.exports.pool = pool;
