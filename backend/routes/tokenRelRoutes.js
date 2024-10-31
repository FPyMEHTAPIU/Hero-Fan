const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY
const methods = require('../methods.js');
const pool = require('../db.js');

// check Authorization
router.get ('/api/marv-user/check-token', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({message: 'Token not found!'});

    try {
        const decoded = jwt.verify(token, secret);
        return res.status(200).json(decoded);
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token!' });
    }
});

// Create a new user
router.post('/api/new-user/', async (req, res) => {
    try {
        const userData = {
            login: req.body.login,
            password: req.body.password
        }

        const loginCheck = await pool.query(
            `SELECT login FROM users
            WHERE login = $1;`,
            [userData.login]
        )

        if (loginCheck.rows.length !== 0)
            throw new Error('Duplicate');

        if (userData.password.length < 8 || userData.password.length > 256) {
            throw new Error('Password');
        }
        else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const result = await pool.query(
                `INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *;`,
                [userData.login, hashedPassword]
            )

            res.status(201).json({ message: 'User registered successfully!' });
        }
    } catch (error) {
        if (error.toString().includes('Password')) {
            res.status(400).json({ error: 'Password must be at least 8 characters and less than 256'});
        }
        else if (error.toString().includes('Duplicate')) {
            res.status(409).json({ error: 'That username already exists. Please try another one!' });
        }
        else
            res.status(400).json({ error: 'Error adding user' })
    }
})

// Change login
router.patch('/api/marv-users/login/:id', async (req, res) => {
    try {
        const user_id = parseInt(req.params.id)
        const { login, password } = req.body

        const loginCheck = await pool.query(
            `SELECT * FROM users
            WHERE login = $1;`,
            [login]
        );

        if (loginCheck.rows.length !== 0) {
            return res.status(409).json({ error:'Duplicate'});
        }

        const passwordDB = await pool.query(
            `SELECT password FROM users
             WHERE id = $1;`,
            [user_id]
        )
        const passwordCheck = await bcrypt.compare(password, passwordDB.rows[0].password);
        if (!passwordCheck) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const result = await pool.query(
            `UPDATE users SET login = $1 WHERE id = $2;`,
            [login, user_id]
        )
        res.json(result.rows)
    } catch (error) {
        if (error === 'Duplicate') {
            console.error(error);
            res.json({error: "Unable to use provided login. User already exists!"})
        }
        else {
            console.error(error)
            res.json({ error: 'Error updating user\'s login' })
        }
    }
})

// Change password
router.patch('/api/marv-users/password/:id', async (req, res) => {
    try {
        const user_id = parseInt(req.params.id)
        const { password, newPassword } = req.body

        const response = await methods.checkPassword(user_id, password, res);
        if (response !== 'Valid!')
            return res.json();

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await pool.query(
            `UPDATE users SET password = $1 WHERE id = $2;`,
            [hashedPassword, user_id]
        );
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error updating user\'s login' })
    }
})

module.exports = router;