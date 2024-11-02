const express = require('express');
const router = express.Router();
const methods = require('../methods.js');
const pool = require('../db.js');

// Get all chars info in favs from DB
router.post('/api/marv-chars-db/fav', async (req, res) => {
    try {
        const charNames = req.body.names;

        if (!Array.isArray(charNames) || charNames.length === 0) {
            return res.status(400).json({ error: 'Invalid input, names should be a non-empty array.' });
        }

        const placeholders = charNames.map((_, index) => ` $${index + 1}`).join(',');
        const query = `SELECT * FROM characters WHERE name IN (${placeholders})`;

        const result = await pool.query(query, charNames);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Add character to favorites
router.post('/api/marv-chars/fav', async (req, res) => {
    const charName = req.body.name;

    const decoded = methods.checkAuthorization(req, res);

    if (decoded === 401 || decoded === 403)
        return res.status(200).json({ message: 'Empty' });

    const userId = decoded.id;

    const charId = await methods.getCharId(charName);

    if (charId.rows.length === 0)
        return res.status(400).json({ error: 'сharacter not found' });

    const charInFav = await methods.checkCharInFav(userId, charId.rows[0].id);

    if (charInFav.rows.length === 0) {
        const result = await pool.query(
            `INSERT INTO favorite_list (user_id, char_id)
            VALUES ($1, $2);`,
            [userId, charId.rows[0].id]
        );
        res.json(result.rows);
    }
    else {
        const result = await pool.query(
            `DELETE FROM favorite_list 
            WHERE user_id = $1 AND char_id = $2;`,
            [userId, charId.rows[0].id]
        );
        res.json(result.rows);
    }
})

// Get all chars from favlist
router.get('/api/marv-chars/fav-list/:id', async (req, res) => {
    const decoded = methods.checkAuthorization(req, res);

    if (decoded === 401 || decoded === 403)
        return res.status(403).json({ message: 'Invalid or expired token' });

    try {
        const userId = parseInt(req.params.id);
        const favChars = await pool.query(
            `SELECT c.name
             FROM favorite_list f
                      JOIN characters c ON f.char_id = c.id
             WHERE f.user_id = $1;`,
            [userId]
        );

        if (favChars.rows.length === 0) {
            return res.status(200).json([]);
        }

        const favCharNames = favChars.rows.map(row => row.name);

        return res.status(200).json(favCharNames);
    } catch (error) {
        console.error('Error fetching favorite characters:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Check only one character in favlist
router.get('/api/marv-chars/fav-list/:id', async (req, res) => {
    const charId = parseInt(req.params.id);
    const decoded = methods.checkAuthorization(req, res);

    if (decoded === 401 || decoded === 403)
        return res.status(403).json({ message: 'Invalid or expired token' });

    const userId = decoded.id;

    try {
        const result = await pool.query(
            `SELECT c.name
            FROM favorite_list f
            JOIN characters c ON f.char_id = c.id
            WHERE f.user_id = $1 AND f.char_id = $2;`,
            [userId, charId]
        );

        if (result.rows.length === 0) {
            return res.status(200).json([]);}

        const favCharNames = result.rows.map(row => row.name);
        return res.status(200).json(favCharNames);
    } catch (error) {
        console.error('Error checking favorite character:', error);
        return res.status(500).json({ error: 'Server error' });
    }
})

module.exports = router;