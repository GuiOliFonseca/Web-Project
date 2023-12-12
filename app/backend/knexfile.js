require('dotenv').config();

const { DB_TYPE, DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

module.exports = {
    development: {
        client: DB_TYPE,
        connection: {
            database: DB_NAME,
            user: DB_USER,
            password: DB_PASS,
            host: DB_HOST,
            port: DB_PORT,
        },
        migrations: {
            directory: __dirname + '/database/migrations',
        },
        seeds: {
            directory: __dirname + '/database/seeds',
        },
    },
};