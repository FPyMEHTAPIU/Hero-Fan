const express = require('express');
const router = express.Router();
const methods = require('../methods.js');
const pool = require('../db.js');

router.get('/api/char-likes/:id', async (req, res) => {
    try {
        const charId = req.params.id;

        const result = await pool.query(
            `SELECT * FROM likes
            WHERE char_id = $1;`,
            [charId]
        );
        return res.json(result.rows.length);
    } catch (error) {
        console.error(error);
    }
})

router.get('/api/char-dislikes/:id', async (req, res) => {
    try {
        const charId = req.params.id;

        const result = await pool.query(
            `SELECT * FROM dislikes
            WHERE char_id = $1;`,
            [charId]
        );
        return res.json(result.rows.length);
    } catch (error) {
        console.error(error);
    }
})

// Add/Remove like
router.post('/api/likes', async (req, res) => {
    const {charId} = {
        charId: parseInt(req.body.charId)
    }

    const decoded = methods.checkAuthorization(req, res);

    if (!decoded) return;

    const userId = decoded.id;

    const charInLikes = await methods.checkCharInLikes(userId, charId);
    const charInDislikes = await methods.checkCharInDislikes(userId, charId);

    if (charInDislikes.rows.length > 0) {
        const result = await pool.query(
            `DELETE FROM dislikes 
            WHERE user_id = $1 AND char_id = $2;`,
            [userId, charId]
        );
    }

    if (charInLikes.rows.length === 0) {
        const result = await pool.query(
            `INSERT INTO likes (user_id, char_id)
            VALUES ($1, $2);`,
            [userId, charId]
        );
        res.json(true);
    }
    else {
        const result = await pool.query(
            `DELETE FROM likes 
            WHERE user_id = $1 AND char_id = $2;`,
            [userId, charId]
        );
        res.json(false);
    }
})

// Add/Remove dislike
router.post('/api/dislikes', async (req, res) => {
    const { charId } = req.body;

    const decoded = methods.checkAuthorization(req, res);

    if (!decoded) {
        return res.status(401).json(null);
    }

    const userId = decoded.id;
    try {
        const charInDislikes = await methods.checkCharInDislikes(userId, charId);
        const charInLikes = await methods.checkCharInLikes(userId, charId);

        if (charInLikes.rows.length > 0) {
            await pool.query(
                `DELETE FROM likes WHERE user_id = $1 AND char_id = $2;`,
                [userId, charId]
            );
            console.log("error 1")
        }

        if (charInDislikes.rows.length === 0) {
            await pool.query(
                `INSERT INTO dislikes (user_id, char_id) VALUES ($1, $2);`,
                [userId, charId]
            );
            console.log("error 2")
            return res.status(200).json(true);
        } else {
            await pool.query(
                `DELETE FROM dislikes WHERE user_id = $1 AND char_id = $2;`,
                [userId, charId]
            );
            console.log("error 3")
            return res.status(200).json(false);
        }
    } catch (error) {
        console.error("Error handling dislikes:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});


// check is character in user's likes
router.post('/api/is-liked', async (req, res) => {
    try {
        const {charId} = {
            charId: parseInt(req.body.charId)
        }

        const decoded = methods.checkAuthorization(req, res);

        if (!decoded) return;

        const userId = decoded.id;

        const charInLikes = await methods.checkCharInLikes(userId, charId);

        if (charInLikes.rows.length > 0)
            return res.json(true);
        else
            return res.json(false);
    } catch (error) {
        console.error(error);
    }
})

// check is character in user's dislikes
router.post('/api/is-disliked', async (req, res) => {
    try {
        const {charId} = {
            charId: parseInt(req.body.charId)
        }

        const decoded = methods.checkAuthorization(req, res);

        if (!decoded) return;

        const userId = decoded.id;

        const charInDislikes = await methods.checkCharInDislikes(userId, charId);

        if (charInDislikes.rows.length > 0)
            return res.json(true);
        else
            return res.json(false);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;