const express = require('express')
require('dotenv').config()
const { Pool } = require('pg')

const app = express()
const port = 3000

app.use(express.json())

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'localhost',
    database: 'sp-db',
    port: 5432
})

app.listen(port, () => {
    console.log(`A big hello from port ${port}`)
})

module.exports = pool;