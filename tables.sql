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

-- DROP TABLE IF EXISTS friendships;
-- CREATE TABLE friendships(
--     id SERIAL PRIMARY KEY,
--     receiver_id INT NOT NULL REFERENCES users(id),
--     sender_id INT NOT NULL REFERENCES users(id),
--     accepted BOOLEAN DEFAULT FALSE
-- );

-- DROP TABLE IF EXISTS chat;
-- CREATE TABLE chat(
--     id SERIAL PRIMARY KEY,
--     chat_msg VARCHAR(2000) NOT NULL,
--     msg_sender_id INT NOT NULL REFERENCES users(id),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- INSERT INTO chat (chat_msg, msg_sender_id) VALUES ('Hello, I am legend', 1);
-- INSERT INTO chat (chat_msg, msg_sender_id) VALUES ('wow, a real legen?', 110);
-- INSERT INTO chat (chat_msg, msg_sender_id) VALUES ('yes, he is true legend', 111);


-- psql -d socialmedia -f tables.sql
--(make sure you're cd'd into the the folder that contains this file before running the line above)







---- INSERTING Friends (id 110-140)
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 110, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 111, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 112, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 113, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 114, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 115, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 116, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 117, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 118, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 119, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 120, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 121, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 122, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 123, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 124, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 125, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 126, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 127, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 128, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 129, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 130, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 131, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 132, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 133, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 134, TRUE); --davida
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 135, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 136, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 137, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 138, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 139, TRUE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 140, TRUE);


-- ---- INSERTING Friend Requests (id 20-70)
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 20, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 21, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 22, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 23, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 24, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 25, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 26, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 27, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 28, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 29, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 30, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 31, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 32, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 33, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 34, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 35, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 36, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 37, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 38, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 39, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 40, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 41, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 42, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 43, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 44, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 45, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 46, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 47, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 48, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 49, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 50, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 51, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 52, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 53, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 54, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 55, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 56, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 57, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 58, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 59, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 60, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 61, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 62, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 63, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 64, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 65, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 66, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 67, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 68, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 69, FALSE);
-- INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES (1, 70, FALSE);