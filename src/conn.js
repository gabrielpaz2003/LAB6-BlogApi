const mysql = require('mysql2/promise');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'blog_user',
  database: 'blog_db',
  password: 'blog_password',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
