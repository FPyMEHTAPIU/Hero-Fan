const express = require('express')
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express()
const port = 3000
const numOfCharacters = 1600
const secret = process.env.SECRET_KEY
const users = [];

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
}

// check Authorization
app.get ('/api/marv-user/check-token', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({message: 'Token not found!'});

    try {
        const decoded = jwt.verify(token, secret);
        return res.status(200).json({message: 'Token is valid!'});
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token!' });
    }
});

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
app.post('/api/login', async (req, res) => {
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

// password comparison ??
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

// Add character to favorites
app.post('/api/marv-chars/fav', async (req, res) => {
    const charName = req.body.name;

    const decoded = checkAuthorization(req, res);

    if (decoded === 401 || decoded === 403)
        return res.status(200).json({ message: 'Empty' });

    const userId = decoded.id;

    const charId = await getCharId(charName);

    if (charId.rows.length === 0)
        return res.status(400).json({ error: 'Character not found' });

    const charInFav = await checkCharInFav(userId, charId.rows[0].id);

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
app.get('/api/marv-chars/fav-list', async (req, res) => {
    const decoded = checkAuthorization(req, res);

    if (decoded === 401 || decoded === 403)
        return res.status(403).json({ message: 'Invalid or expired token' });

    const userId = decoded.id;

    try {
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

// Update DB
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


//Get character's comments ??
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
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const result = await pool.query(
                `INSERT INTO users (login, password) VALUES ($1, $2) RETURNING *;`,
                [userData.login, hashedPassword]
            )
            res.status(201).json({ message: 'User registered successfully!' });
        }
    } catch (error) {
        if (error.toString().includes('Password')) {
            res.json({ error: 'Password must be at least 8 characters and less than 256'});
        }
        else
            res.json({ error: 'Error adding user' })
    }
})

app.post('/api/marv-comments', async (req, res) => {
    const { comment } = req.body;

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


app.listen(port, () => {
    console.log(`A big hello from port ${port}`)
})

module.exports = pool;