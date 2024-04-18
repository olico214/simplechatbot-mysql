const mysql = require('mysql2/promise');

let pool;

try {
  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'users',
    // port: 3306,
    // password: '',
  });
} catch (err) {
  console.error(err);
}

module.exports = pool;
