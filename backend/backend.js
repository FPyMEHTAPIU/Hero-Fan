const express = require('express')
require('dotenv').config()
const { Pool } = require('pg')
const {json} = require("express");
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

// Get all chars' info
app.get('/sp-chars', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM characters;`
        )
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error getting sp characters' })
    }
})

//Get character's comments
app.get('/sp-comments', async (req, res) => {
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
app.post('/sp-users', async (req, res) => {
    const { user } = req.body // fetch from the field

    if (length(user.password) < 8 || length(user.password) > 256) {
        console.error('Password must be at least 8 characters and less then 256')
    }
    else {
        const result = await pool.query(
            `INSERT INTO users (login) VALUES ($1) RETURNING *;` +
            `INSERT INTO passwords (password) VALUES ($2);`,
            [user.login, user.password]
        )
        res.json(result.rows)
    }
})

add.post('/sp-comments', async (req, res) => {
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
add.patch('/sp-users/login/:id', async (req, res) => {
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
add.patch('/sp-favlist/:id', async (req, res) => {
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