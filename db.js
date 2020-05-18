const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialmedia"
);

////// --------------------------------/register & /login page------------------------------------------------//
////--POST
module.exports.submitRegistration = (first, last, email, password) => {
    return db.query(
        `
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id`,
        [first, last, email, password]
    );
};

module.exports.login = (loginEmail) => {
    return db.query(
        `
    SELECT password, id FROM users WHERE email = $1`,
        [loginEmail]
    );
};

////// --------------------------------/reset-password ------------------------------------------------//
////--POST
module.exports.checkUser = (loginEmail) => {
    return db.query(
        `
    SELECT id, email, first, last FROM users WHERE email = $1`,
        [loginEmail]
    );
};

module.exports.saveCode = (email, code) => {
    return db.query(
        `
    INSERT INTO reset_codes (email, code)
    VALUES ($1, $2)`,
        [email, code]
    );
};

module.exports.getCode = () => {
    return db.query(
        `
        SELECT * FROM reset_codes
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '20 minutes'
        ORDER BY id DESC
        LIMIT 1`
    );
};

module.exports.updatePassword = (email, password) => {
    return db.query(
        `
        UPDATE users
        SET password = $2
        WHERE email = $1`,
        [email, password]
    );
};

////// --------------------------------/user ------------------------------------------------//
module.exports.getUserInfo = (id) => {
    return db.query(
        `
    SELECT * FROM users WHERE id = $1`,
        [id]
    );
};

module.exports.updateImgUrl = (imgUrl, id) => {
    return db.query(
        `
        UPDATE users
        SET image_url = $1
        WHERE id = $2
        RETURNING image_url`,
        [imgUrl, id]
    );
};

module.exports.updateBio = (biotext, id) => {
    return db.query(
        `
        UPDATE users
        SET bio = $1
        WHERE id = $2`,
        [biotext, id]
    );
};

////// --------------------------------/other-user/:id ------------------------------------------------//
module.exports.getOtherUserInfo = (id) => {
    return db.query(
        `
    SELECT id, first, last, email, image_url, bio, created_at FROM users WHERE id = $1`,
        [id]
    );
};

////// --------------------------------/friend-status ------------------------------------------------//

module.exports.checkFriendship = (receiver, sender) => {
    return db.query(
        `
        SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver, sender]
    );
};
module.exports.requestFriendship = (receiver, sender) => {
    return db.query(
        `
        INSERT INTO friendships (receiver_id, sender_id)
        VALUES ($1, $2)`,
        [receiver, sender]
    );
};
module.exports.deleteFriendship = (r, s) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [r, s]
    );
};
module.exports.acceptFriendship = (r, s) => {
    return db.query(
        `
        UPDATE friendships
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [r, s]
    );
};

////// --------------------------------/friend-wannabes ------------------------------------------------//

module.exports.getFriendsAndWannabes = (myID) => {
    return db.query(
        `
    SELECT users.id, first, last, image_url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [myID]
    );
};

////// --------------------------------/users FindPeople/Search------------------------------------------------//
module.exports.getRecentRegisters = () => {
    return db.query(`
    SELECT * FROM users
    ORDER BY id
    DESC LIMIT 3`);
};

module.exports.getMatchingUsersFirst = (val) => {
    return db.query(
        `SELECT * FROM users
        WHERE first ILIKE $1
        ORDER BY first LIMIT 20`,
        [val + "%"]
    );
};
module.exports.getMatchingUsersLast = (val) => {
    return db.query(
        `SELECT * FROM users
        WHERE (last ILIKE $1 AND last ILIKE $1  <> first ILIKE $1)
        ORDER BY last LIMIT 20`,
        [val + "%"]
    );
};

////// --------------------------------/chat ------------------------------------------------//
module.exports.getLastTenMessages = () => {
    // needs to be a join from users (first, last, image_url) and chats (chat_text, chat_sender_id)
    return db.query(`
    SELECT chat.id AS id, msg_sender_id AS msg_sender_id, chat_msg, chat.created_at, first, last, image_url
    FROM chat
    JOIN users
    ON (msg_sender_id = users.id)
    ORDER BY chat.created_at
    DESC LIMIT 10`);
    // return db.query(`
    // SELECT msg_sender_id, chat_msg, chat.created_at, first, last, image_url FROM chat JOIN users ON (msg_sender_id = users.id) ORDER BY chat.created_at ASC LIMIT 10
    // `);
};

module.exports.insertNewMessage = (msg, sender_id) => {
    //insert into chat and get info (first, last, image_url) about sender_id
    //gonna have to be a join aswell. output has to look just like getLastTenMessages

    return db.query(
        `
    INSERT INTO chat (chat_msg, msg_sender_id)
    VALUES ($1, $2)`,
        [msg, sender_id]
    );
};

module.exports.mostRecentMessage = () => {
    // needs to be a join from users (first, last, image_url) and chats (chat_text, chat_sender_id)
    return db.query(`
    SELECT chat.id AS id, msg_sender_id AS msg_sender_id, chat_msg, chat.created_at, first, last, image_url
    FROM chat
    JOIN users
    ON (msg_sender_id = users.id)
    ORDER BY chat.created_at
    DESC LIMIT 1`);
    // return db.query(`
    // SELECT msg_sender_id, chat_msg, chat.created_at, first, last, image_url FROM chat JOIN users ON (msg_sender_id = users.id) ORDER BY chat.created_at ASC LIMIT 1
    // `);
};
