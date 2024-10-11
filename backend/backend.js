const express = require('express')
require('dotenv').config()
const { Pool } = require('pg')
const {json} = require("express");

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

app.get('/sp-users', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM users;`
        )
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error getting sp users' })
    }
})

app.listen(port, () => {
    console.log(`A big hello from port ${port}`)
})

module.exports = pool;