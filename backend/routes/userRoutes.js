const express = require('express');
const router = express.Router();
const methods = require('../methods.js');
const pool = require('../db.js');

// Get all users' info
router.get('/api/marv-users', async (req, res) => {
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

// Get user's info
router.get('/api/marv-users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const response = await pool.query(
            `SELECT u.login, u.photo, ARRAY_AGG(f.char_id) AS favorite_characters
            FROM users u
            LEFT JOIN favorite_list f
            ON u.id = f.user_id
            WHERE u.id = $1
            GROUP BY u.id;`,
            [userId]
        );

        res.json(response.rows);
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error getting user\'s info' });
    }
});

// check username while trying log in
router.post('/api/login', async (req, res) => {
    const {login, password} = req.body;

    try {
        const result = await pool.query(
            `SELECT id, login FROM users 
             WHERE login = $1;`,
            [login]
        )
        if (result.rows.length === 0)
            return res.status(400).json({ error: 'User not found' });

        const id = result.rows[0].id

        const passwordDB = await pool.query(
            `SELECT password FROM users
            WHERE login = $1;`,
            [login]
        )
        const passwordCheck = await bcrypt.compare(password, passwordDB.rows[0].password);
        if (!passwordCheck) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign( { id, login }, secret, { expiresIn: '1h' });
        res.json({ token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
})

module.exports = router;