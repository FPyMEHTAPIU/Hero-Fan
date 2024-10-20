CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    photo TEXT
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT,
    description TEXT,
    likes INTEGER,
    dislikes INTEGER
);

CREATE TABLE favorite_list (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    char_id INTEGER REFERENCES characters(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    char_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    content TEXT
);