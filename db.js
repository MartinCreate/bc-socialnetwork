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
module.exports.acceptFriendship = (receiver) => {
    return db.query(
        `
        UPDATE friendships
        SET accepted = true
        WHERE receiver_id = $1`,
        [receiver]
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
