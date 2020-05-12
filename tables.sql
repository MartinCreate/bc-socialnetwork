-- DROP TABLE IF EXISTS users, reset_codes;
-- CREATE TABLE users(
--       id SERIAL PRIMARY KEY,
--       first VARCHAR(255) NOT NULL CHECK (first != '' AND first != ' '),
--       last VARCHAR(255) NOT NULL CHECK (last != '' AND last != ' '),
--       email VARCHAR(255) NOT NULL CHECK (email != '' AND email != ' ') UNIQUE,
--       password VARCHAR(255) NOT NULL CHECK (password != '' AND password != ' '),
--       image_url TEXT,
--       bio VARCHAR(5000),
--       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--       );

-- CREATE TABLE reset_codes(
--       id SERIAL PRIMARY KEY,
--       email VARCHAR NOT NULL,
--       code VARCHAR NOT NULL,
--       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    receiver_id INT NOT NULL REFERENCES users(id),
    sender_id INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT FALSE
);


-- psql -d socialmedia -f tables.sql
--(make sure you're cd'd into the the folder that contains this file before running the line above)