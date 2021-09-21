require('dotenv').config()

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    charset: process.env.DB_CHARSET,
    collate: process.env.DB_COLLATE,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    FTP_HOST: process.env.FTP_HOST,
    FTP_PORT: process.env.FTP_PORT,
    FTP_USERNAME: process.env.FTP_USER,
    FTP_PASSWORD: process.env.FTP_PASS
};