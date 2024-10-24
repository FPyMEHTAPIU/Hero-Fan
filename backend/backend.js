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
}

// check Authorization
app.get ('/api/marv-user/check-token', (req, res) => {
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

// Get user's info
app.get('/api/marv-users/:id', async (req, res) => {
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

// Get all chars' info from API
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

// Get all chars' info from DB
app.get('/api/marv-chars-db/', async (req, res) => {
    const result = await pool.query(
        'SELECT * FROM characters;'
    )

    res.json(result.rows);
})

app.post('/api/marv-chars-db/sorted', async (req, res) => {
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

// Get all chars info in favs from DB
app.post('/api/marv-chars-db/fav', async (req, res) => {
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
app.get('/api/marv-chars/fav-list/:id', async (req, res) => {
    const decoded = checkAuthorization(req, res);

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
app.get('/api/marv-chars/fav-list/:id', async (req, res) => {
    const charId = parseInt(req.params.id);
    const decoded = checkAuthorization(req, res);

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

app.get('/api/marv-chars/:id', async (req, res) => {
    try {
        const charId = parseInt(req.params.id);

        const response = await pool.query(
            `SELECT * FROM characters
            WHERE id = $1;`,
            [charId]
        );

        res.json(response.rows);
    } catch (error) {
        console.error(error)
        res.json({ error: 'Error getting character\'s info' });
    }
})

// USED ONLY ONCE WHEN UPDATE/FETCH DB AT FIRST TIME - replaces empty description by custom one
app.patch('/api/marv-char/update-description', async (req, res) => {
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

// Create a new user
app.post('/api/new-user/', async (req, res) => {
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
app.patch('/api/marv-users/login/:id', async (req, res) => {
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
app.patch('/api/marv-users/password/:id', async (req, res) => {
    try {
        const user_id = parseInt(req.params.id)
        const { password, newPassword } = req.body

        const response = await checkPassword(user_id, password, res);
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

app.listen(port, () => {
    console.log(`A big hello from port ${port}`)
})

module.exports = pool;