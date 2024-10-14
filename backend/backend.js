const express = require('express')
require('dotenv').config()
const { Pool } = require('pg')
const { json } = require("express");
const result = require("pg/lib/query");

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

// Get all users' info
app.get('/marv-users', async (req, res) => {
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

// Get all chars' info
app.get('/marv-chars/', async (req, res) => {
    const apiData = {
        api: process.env.API_KEY,
        ts: process.env.TIME_STAMP,
        hash: process.env.MD5_KEY
    }

    const result = await fetch('http://gateway.marvel.com/v1/public/characters?' +
        new URLSearchParams({
            ts: apiData.ts,
            apikey: apiData.api,
            hash: apiData.hash
        }).toString())
    const response = await result.json()

    const filteredData = response.data.results.map(character => ({
        id: character.id,
        name: character.name
    }))

    res.json(filteredData)
})

//Get character's comments
app.get('/marv-comments', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT comments.* FROM comments JOIN characters WHERE characters.id = comments.char_id;`
        )
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error getting character\'s comments' })
    }
})

// Create a new user
app.post('/marv-users/', async (req, res) => {
    try {
        const userData = {
            login: req.body.login,
            password: req.body.password
        }

        if (userData.password.length < 8 || userData.password.length > 256) {
            console.error('Password must be at least 8 characters and less than 256')
        }
        else {
            const result = await pool.query(
                `INSERT INTO users (login) VALUES ($1) RETURNING *;`,
                [userData.login]
            )
            res.json(result.rows)
        }
    } catch (error) {
        if (error.code == '23505') // used username
            res.json( {error: 'The username already exists!'} )
        else
            res.json({ error: 'Error adding user' })
    }
})

app.post('/marv-comments', async (req, res) => {
    const { comment } = req.body // fetch from the field

    if (length(comment.content) < 1) {
        console.error('Fill the comment\'s field!')
    }
    else {
        const result = await pool.query(
            `INSERT INTO comments (user_id, char_id, content) VALUES ($1, $2, $3) RETURNING *;` +
            [comment.user_id, comment.char_id, comment.content]
        )
        res.json(result.rows)
    }
})

// Change login
app.patch('/marv-users/login/:id', async (req, res) => {
    try {
        const user_id = parseInt(req.params.id)
        const { login } = req.body

        const result = await pool.query(
            `UPDATE users SET login = $1 WHERE id = $2 RETURNING *;`,
            [login.login, user_id]
        )
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error updating user\'s login' })
    }
})

// Add or delete a character to/from the favorite list
app.patch('/marv-favlist/:id', async (req, res) => {
    try {
        const char_id = parseInt(req.params.id)
        const user_id = parseInt(req.body.text)

        const { char_in_list } = await pool.query(
            `SELECT * FROM favorite_list WHERE $1 = char_id;`,
            [char_id]
        )
        if (!char_in_list) {
            // add try/catch
            const result = await pool.query(
                `INSERT INTO favorite_list (user_id, char_id) VALUES ($1, $2);`,
                [user_id, char_id]
            )
            res.json(result.rows)
        }
        else {
            const result = await pool.query(
                `DELETE FROM favorite_list WHERE $1 = char_id;`,
                [char_id]
            )
            res.json(result.rows)
        }
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error adding/deleting the character to/from favorite list' })
    }
})

app.listen(port, () => {
    console.log(`A big hello from port ${port}`)
})

module.exports = pool;