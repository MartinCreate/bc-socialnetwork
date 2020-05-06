DROP TABLE IF EXISTS users, reset_codes;
CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != '' AND first != ' '),
      last VARCHAR(255) NOT NULL CHECK (last != '' AND last != ' '),
      email VARCHAR(255) NOT NULL CHECK (email != '' AND email != ' ') UNIQUE,
      password VARCHAR(255) NOT NULL CHECK (password != '' AND password != ' '),
      image_url TEXT,
      bio VARCHAR(5000),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

CREATE TABLE reset_codes(
      id SERIAL PRIMARY KEY,
      email VARCHAR NOT NULL,
      code VARCHAR NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- -- psql -d socialmedia -f tables.sql














-- from petition Project:
-- DROP TABLE IF EXISTS signatures, user_profiles, users;
-- CREATE TABLE users(
--       id SERIAL PRIMARY KEY,
--       first VARCHAR(255) NOT NULL CHECK (first != '' AND first != ' '),
--       last VARCHAR(255) NOT NULL CHECK (last != '' AND last != ' '),
--       email VARCHAR(255) NOT NULL CHECK (email != '' AND email != ' ') UNIQUE,
--       password VARCHAR(255) NOT NULL CHECK (password != '' AND password != ' '),
--       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--  );
-- CREATE TABLE signatures(
--       id SERIAL PRIMARY KEY,
--       signature TEXT NOT NULL CHECK (signature != ''),
--       user_id INTEGER NOT NULL REFERENCES users(id),
--       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--   );
-- CREATE TABLE user_profiles(
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) NOT NULL UNIQUE,
--     age INTEGER NULL,
--     city VARCHAR(100),
--     url VARCHAR(300)
--     );

-- -- cd into folder containing tables.sql, then run this line in terminal to reset the tables
-- -- psql -d petition -f tables.sql
