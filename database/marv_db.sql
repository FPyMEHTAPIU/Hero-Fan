CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    photo TEXT
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name TEXT,
    image TEXT,
    description TEXT DEFAULT 'Cannot say much about this character yet, but who knows what their story will be...',
    likes INTEGER,
    dislikes INTEGER,
    series TEXT[]
);

CREATE TABLE series (
    char_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    series_name TEXT,
    series_url TEXT,
    PRIMARY KEY (char_id, series_name, series_url)
);

CREATE TABLE favorite_list (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    char_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, char_id)
);

CREATE TABLE comments (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    char_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    content TEXT,
    PRIMARY KEY (user_id, char_id, content)
);

CREATE TABLE likes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    char_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, char_id)
);

CREATE TABLE dislikes (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    char_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, char_id)
);