const mysql = require('mysql2');
const db = require('../config/db.config')

const pool = mysql.createPool({
    host: db.HOST,
    user: db.USER,
    database: db.DB,
    password: db.PASSWORD,
    timezone: 'Asia/Jakarta'
});
    
const promisePool = pool.promise();

module.exports = promisePool