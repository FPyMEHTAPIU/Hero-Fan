const express = require('express')
require('dotenv').config()
const { Pool } = require('pg')
const { json } = require("express");
const result = require("pg/lib/query");
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    'marv-db',
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: 'localhost',
        dialect: 'postgres',
    }
);

const app = express()
const port = 3000
const numOfCharacters = 1600

app.use(express.json())

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'localhost',
    database: 'marv-db',
    port: 5432
})

const filterData = (response) => {
    const result = response.data.results
        .filter(character =>
            !character.thumbnail.path.includes('image_not_available'))
        .map(character => ({
            id: character.id,
            name: character.name,
            description: character.description,
            image: character.thumbnail.path + '.' + character.thumbnail.extension
        }));

    return result;
}

// Get all users' info
app.get('/api/marv-users', async (req, res) => {
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

// check username while trying log in
app.get('/api/login/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const result = await pool.query(
            `SELECT login FROM users
            WHERE login = $1;`,
            [username]
        )
        if (result.rows == '')
            throw new Error('User doesn\'t exist!');
        res.json(result.rows)
    } catch (error) {
        res.json({ error: 'User doesn\'t exist!' })
    }
})

// password comparison
app.get('/api/password/', async (req, res) => {
    const userData = {
        username: req.body.username,
        password: req.body.password
    }

    try {
        const result = await pool.query(
            `SELECT * FROM users
            WHERE login = $1;`,
            [userData.username]
        )

        if (result.rows.password !== userData.password) {
            throw new Error('Incorrect password!');
        }
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        if (error !== 'Incorrect password!') {
            res.json({ error: 'User doesn\'t exist!' })
        }
    }
})

// Get all chars' info
app.get('/api/marv-chars-api/', async (req, res) => {
    const apiData = {
        api: process.env.API_KEY,
        ts: process.env.TIME_STAMP,
        hash: process.env.MD5_KEY
    }

    try {
        const fetchPromises = [];

        for (let i = 0; i < numOfCharacters; i += 100) {
            fetchPromises.push(
                fetch(
                    'http://gateway.marvel.com/v1/public/characters?limit=100&offset=' +
                    i.toString() + '&' +
                    new URLSearchParams({
                        ts: apiData.ts,
                        apikey: apiData.api,
                        hash: apiData.hash
                    }).toString()
                )
            );
        }

        const results = await Promise.all(fetchPromises);

        for (const result of results) {
            if (result.ok) {
                const response = await result.json();

                const filteredData = filterData(response);

                const insertPromises = filteredData.map(character =>
                    pool.query(
                        `INSERT INTO characters (id, name, image, description)
                         VALUES ($1, $2, $3, $4)
                         ON CONFLICT (id) DO NOTHING;`,
                        [character.id, character.name, character.image, character.description]
                    )
                );

                await Promise.all(insertPromises);
            } else {
                console.error(`Failed to fetch data for offset: ${i}, Status: ${result.status}`);
            }
        }
    } catch (error) {
        console.error('Error fetching or inserting data:', error);
    }
})

app.get('/api/marv-chars-db/', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM characters;'
    )

    res.json(result.rows);
})

app.get('/api/marv-update-chars-db/', async (req, res) => {
    const apiData = {
        api: process.env.API_KEY,
        ts: process.env.TIME_STAMP,
        hash: process.env.MD5_KEY
    }

    try {
        const fetchPromises = [];

        for (let i = 0; i < numOfCharacters; i += 100) {
            fetchPromises.push(
                fetch(
                    'http://gateway.marvel.com/v1/public/characters?limit=100&offset=' +
                    i.toString() + '&' +
                    new URLSearchParams({
                        ts: apiData.ts,
                        apikey: apiData.api,
                        hash: apiData.hash
                    }).toString()
                )
            );
        }

        const results = await Promise.all(fetchPromises);

        for (const result of results) {
            if (result.ok) {
                const response = await result.json();

                const filteredData = filterData(response);

                const insertPromises = filteredData.map(character =>
                    pool.query(
                        `UPDATE characters SET name = $2, image = $3, description = $4
                         WHERE id = $1;`,
                        [character.id, character.name, character.image, character.description]
                    )
                );

                await Promise.all(insertPromises);
                console.log(`Updated ${filteredData.length} characters`);
            } else {
                console.error(`Failed to fetch data for offset: ${i}, Status: ${result.status}`);
            }
        }
    } catch (error) {
        console.error('Error fetching or inserting data:', error);
    }
})


//Get character's comments
app.get('/api/marv-comments', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT comments.* FROM comments JOIN characters WHERE characters.id = comments.char_id;`
        )

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error getting character\'s comments' })
    }
})

// Create a new user
app.post('/api/new-user/', async (req, res) => {
    try {
        const userData = {
            login: req.body.login,
            password: req.body.password
        }

        if (userData.password.length < 8 || userData.password.length > 256) {
            throw new Error('Password');
        }
        else {
            const result = await pool.query(
                `INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *;`,
                [userData.login, userData.password]
            )
            res.json(result.rows)
        }
    } catch (error) {
        if (error.toString().includes('Password')) { // used username
            res.json({ error: 'Password must be at least 8 characters and less than 256'});
        }
        else
            res.json({ error: 'Error adding user' })
    }
})

app.post('/api/marv-comments', async (req, res) => {
    const { comment } = req.body // fetch from the field

    if (length(comment.content) < 1) {
        console.error('Fill the comment\'s field!')
    }
    else {
        const result = await pool.query(
            `INSERT INTO comments (user_id, char_id, content) VALUES ($1, $2, $3) RETURNING *;`,
            [comment.user_id, comment.char_id, comment.content]
        )
        res.json(result.rows)
    }
})

// Change login
app.patch('/api/marv-users/login/:id', async (req, res) => {
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
app.patch('/api/marv-favlist/:id', async (req, res) => {
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