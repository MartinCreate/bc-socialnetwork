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
module.exports.deleteFriendship = (unfriender) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE sender_id = $1
        OR receiver_id = $1`,
        [unfriender]
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

////// --------------------------------/users ------------------------------------------------//
module.exports.getRecentRegisters = () => {
    return db.query(`
    SELECT * FROM users
    ORDER BY id
    DESC LIMIT 3`);
};

module.exports.getMatchingUsersFirst = (val) => {
    return db.query(
        `SELECT * FROM users WHERE first ILIKE $1 ORDER BY first LIMIT 10`,
        [val + "%"]
    );
};
module.exports.getMatchingUsersLast = (val) => {
    return db.query(
        `SELECT * FROM users WHERE last ILIKE $1 ORDER BY last LIMIT 10`,
        [val + "%"]
    );
};

//////////////////////////////////FROM Petition:   ///////////////////////////////////////////////////////////////

// ////--GET
// module.exports.sigCheck = (userID) => {
//     return db.query(
//         `
//     SELECT EXISTS(SELECT id FROM signatures WHERE user_id = $1)`,
//         [userID]
//     );
// };

// module.exports.getData = (querySQL) => {
//     return db.query(querySQL);
// };

// ////// --------------------------------/register & /login page------------------------------------------------//
// ////--POST
// module.exports.submitRegistration = (first, last, email, password) => {
//     return db.query(
//         `
//     INSERT INTO users (first, last, email, password)
//     VALUES ($1, $2, $3, $4)
//     RETURNING id`,
//         [first, last, email, password]
//     );
// };

// ////--GET
// module.exports.loginAttempt = (loginEmail) => {
//     return db.query(
//         `
//     SELECT password, id FROM users WHERE email = $1`,
//         [loginEmail]
//     );
// };

// ////// --------------------------------/profile page------------------------------------------------//
// ////--GET
// module.exports.userProfileCheck = (userID) => {
//     return db.query(
//         `
//     SELECT EXISTS(SELECT id FROM user_profiles WHERE user_id = $1)`,
//         [userID]
//     );
// };

// ////--POST
// module.exports.submitProfile = (user_id, age, city, user_website) => {
//     const checkUrl = (url) => {
//         return url.startsWith("http://") || url.startsWith("https://")
//             ? url
//             : null;
//     };

//     return db.query(
//         `
//     INSERT INTO user_profiles (user_id, age, city, url)
//     VALUES ($1, $2, $3, $4)`,
//         [user_id, age || null, city, checkUrl(user_website)]
//     );
// };

// ////// --------------------------------/profile/edit page------------------------------------------------//
// ////--GET
// module.exports.getProfileEditInfo = (user_id) => {
//     return db.query(
//         `
//     SELECT users.id AS user_id, first, last, email, age, city, url
//     FROM users
//     LEFT JOIN user_profiles
//     ON users.id = user_id
//     WHERE user_id = $1`,
//         [user_id]
//     );
// };

// ////--POST
// module.exports.updateUsers = (user_id, first, last, email, password) => {
//     if (password) {
//         return db.query(
//             `
//     UPDATE users SET first = $2, last = $3, email = $4, password = $5
//     WHERE id = $1`,
//             [user_id, first, last, email, password]
//         );
//     } else {
//         return db.query(
//             `
//     UPDATE users SET first = $2, last = $3, email = $4
//     WHERE id = $1`,
//             [user_id, first, last, email]
//         );
//     }
// };

// ////--UPSERT
// module.exports.updateUserProfiles = (user_id, age, city, url) => {
//     const checkUrl = (url) => {
//         return url.startsWith("http://") || url.startsWith("https://")
//             ? url
//             : null;
//     };

//     return db.query(
//         `
//             INSERT INTO user_profiles (user_id, age, city, url)
//             VALUES ($1, $2, $3, $4)
//             ON CONFLICT (user_id) DO UPDATE SET age = $2, city = $3, url = $4`,
//         [user_id, age || null, city, checkUrl(url)]
//     );
// };

// ////// --------------------------------/petition page------------------------------------------------//
// ////-- Not used (was probably used in part 3)
// // module.exports.getSigId = (userID) => {
// //     return db.query(
// //         `
// //     SELECT id FROM signatures WHERE user_id = $1`,
// //         [userID]
// //     );
// // };

// ////--POST
// module.exports.submitSig = (signature, user_id) => {
//     return db.query(
//         `
//     INSERT INTO signatures (signature, user_id)
//     VALUES ($1, $2)`,
//         [signature, user_id]
//     );
// };

// ////// --------------------------------/sig-delete ------------------------------------------------//
// ////--POST
// module.exports.deleteSig = (user_id) => {
//     return db.query(`DELETE FROM signatures WHERE user_id = $1`, [user_id]);
// };

// ////// --------------------------------/signers page------------------------------------------------//
// ////--GET
// module.exports.getFullSigners = () => {
//     return db.query(`
//     SELECT users.id AS user_id, first, last, age, city, url
//     FROM signatures
//     JOIN users
//     ON signatures.user_id = users.id
//     LEFT OUTER JOIN user_profiles
//     ON users.id = user_profiles.user_id`);
// };

// module.exports.getSignerCity = (city) => {
//     return db.query(
//         `
//     SELECT users.id AS user_id, first, last, age, city, url
//     FROM signatures
//     JOIN users
//     ON signatures.user_id = users.id
//     LEFT OUTER JOIN user_profiles
//     ON users.id = user_profiles.user_id
//     WHERE LOWER(city)=LOWER($1)`,
//         [city]
//     );
// };

// ////// --------------------------------/delete page------------------------------------------------//
// ////--POST
// module.exports.deleteSignaturesRow = (user_id) => {
//     return db.query(`DELETE FROM signatures WHERE user_id = $1`, [user_id]);
// };

// module.exports.deleteUserProfilesRow = (user_id) => {
//     return db.query(`DELETE FROM user_profiles WHERE user_id = $1`, [user_id]);
// };

// module.exports.deleteUsersRow = (user_id) => {
//     return db.query(`DELETE FROM users WHERE id = $1`, [user_id]);
// };
