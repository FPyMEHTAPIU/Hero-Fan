const express = require('express');
const router = express.Router();
const methods = require('../methods.js');
const pool = require('../db.js');

const numOfCharacters = 1600;

// Get all chars' info from API
router.get('/api/marv-chars-api/', async (req, res) => {
    const apiData = {
        api: process.env.API_KEY,
        ts: process.env.TIME_STAMP,
        hash: process.env.MD5_KEY
    }

    try {
        const results = methods.fetchPromises(numOfCharacters, apiData);

        for (const result of results) {
            if (result.ok) {
                const response = await result.json();

                const filteredData = methods.filterData(response);

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

// Get all chars' info from DB
router.get('/api/marv-chars-db/', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM characters;'
    )

    res.json(result.rows);
})

router.post('/api/marv-chars-db/sorted', async (req, res) => {
    try {
        const ascOrder = req.body.order;

        if (ascOrder) {
            const result = await pool.query(
                'SELECT * FROM characters ORDER BY name ASC;'
            )
            res.json(result.rows);
        } else {
            const result = await pool.query(
                'SELECT * FROM characters ORDER BY name DESC;'
            )
            res.json(result.rows);
        }
    } catch (error) {
        console.error({error: 'Error ordering characters!'});
    }
})

// Update DB
router.get('/api/marv-update-chars-db/', async (req, res) => {
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

                const filteredData = methods.filterData(response);

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

router.get('/api/marv-chars/:id', async (req, res) => {
    try {
        const charId = parseInt(req.params.id);

        const response = await pool.query(
            `SELECT * FROM characters
            WHERE id = $1;`,
            [charId]
        );
        if (response.rows.length === 0)
            throw new Error('Character not found')

        res.status(200).json(response.rows);
    } catch (error) {
        console.error(error)
        res.status(404).json({ error: 'Character not found' });
    }
})

// USED ONLY ONCE WHEN UPDATE/FETCH DB AT FIRST TIME - replaces empty description by custom one
router.patch('/api/marv-char/update-description', async (req, res) => {
    const description = req.body.description;

    if (!description)
        return res.status(400).json({message: 'description is empty, fill it!'});

    const result = await pool.query(
        `UPDATE characters SET description = $1
        WHERE description IS NULL
        OR description = '' 
        RETURNING *;`,
        [description]
    );

    res.json(result.rows);
});

module.exports = router;