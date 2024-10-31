require('dotenv').config();
const express = require('express');

const pool = require('./db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY

const Methods = () => {
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
    };

    const checkAuthorization = (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token)
            return 401;
        try {
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (error) {
            return 403;
        }
    };

    const getCharId = (charName) => {
        return ( pool.query(
            `SELECT id FROM characters
        WHERE name = $1;`,
            [charName]
        ));
    };

    const checkCharInFav = (userId, charId) => {
        return ( pool.query(
            `SELECT * FROM favorite_list
         WHERE user_id = $1 AND char_id = $2;`,
            [userId, charId]
        ));
    };

    const checkCharInLikes = (userId, charId) => {
        return ( pool.query(
            `SELECT * FROM likes
         WHERE user_id = $1 AND char_id = $2;`,
            [userId, charId]
        ));
    };

    const checkCharInDislikes = (userId, charId) => {
        return ( pool.query(
            `SELECT * FROM dislikes
         WHERE user_id = $1 AND char_id = $2;`,
            [userId, charId]
        ));
    };

    const checkPassword = async (user_id, password, res) => {
        const passwordDB = await pool.query(
            `SELECT password FROM users
             WHERE id = $1;`,
            [user_id]
        )
        const passwordCheck = await bcrypt.compare(password, passwordDB.rows[0].password);
        if (!passwordCheck) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        return ('Valid!')
    };

    const fetchPromises = async (numOfCharacters, apiData) => {
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
        return (await Promise.all(fetchPromises));
    };

    return {
        filterData,
        checkAuthorization,
        getCharId,
        checkCharInFav,
        checkCharInLikes,
        checkCharInDislikes,
        checkPassword,
        fetchPromises
    };
};

module.exports = Methods();