const express = require('express');
const router = express.Router();
const methods = require('../methods.js');
const pool = require('../db.js');

router.post('/api/search/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const isUser = req.body.isUser;

        if (isUser) {
            const result = await pool.query(
                `SELECT id, login, photo FROM users
                WHERE login ILIKE $1;`,
                [`%${name}%`]
            )
            return res.status(200).json(result.rows);
        } else {
            const result = await pool.query(
                `SELECT * FROM characters
                WHERE name ILIKE $1;`,
                [`%${name}%`]
            )
            return res.status(200).json(result.rows);
        }
    } catch (error) {
        return res.status(400).json({ error: 'Error searching user/hero!' })
    }
})

module.exports = router;