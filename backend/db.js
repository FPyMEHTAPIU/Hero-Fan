const {Pool} = require("pg");
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'localhost',
    database: 'marv-db',
    port: 5432
})

module.exports = pool;