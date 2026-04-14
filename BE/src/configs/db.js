// src/config/db.js
const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER || 'sa', 
    password: process.env.DB_PASSWORD || '12345', 
    database: process.env.DB_NAME || 'QuanLyDoanVien',
    server: process.env.DB_SERVER || 'localhost', 
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log(' Kết nối Database thành công!');
        return pool;
    })
    .catch(err => {
        console.error(' Kết nối Database thất bại: ', err);
        process.exit(1);
    });

module.exports = { sql, poolPromise };