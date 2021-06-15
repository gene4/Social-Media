const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.addUser = (first, last, email, password) => {
    const q = `
    INSERT INTO users (first, last, email, password)
    values ($1, $2, $3, $4)  
    RETURNING id , first
    `;
    const params = [first, last, email, password];
    return db.query(q, params);
};

module.exports.getUser = (userEmail) => {
    return db.query(`SELECT * FROM users WHERE email=$1`, [userEmail]);
};

module.exports.getUserById = (userId) => {
    return db.query(`SELECT * FROM users WHERE id=$1`, [userId]);
};

module.exports.addCode = (code, email) => {
    const q = `
    INSERT INTO reset_codes (code, email)
    values ($1, $2)  
    RETURNING code, email
    `;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.getCode = (userEmail) => {
    return db.query(
        `SELECT * FROM reset_codes WHERE email=$1
         AND CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
         LIMIT 1
         `,
        [userEmail]
    );
};

module.exports.updatePassword = (password, email) => {
    const q = `
    UPDATE users
    SET password = $1 
    WHERE users.email = $2
    `;
    const params = [password, email];
    return db.query(q, params);
};

module.exports.updateProfilePic = (url, userId) => {
    const q = `
    UPDATE users
    SET url = $1
    WHERE users.id = $2
    RETURNING url
    `;
    const params = [url, userId];
    return db.query(q, params);
};

module.exports.updateBio = (bio, userId) => {
    const q = `
    UPDATE users
    SET bio = $1
    WHERE users.id = $2
    RETURNING bio
    `;
    const params = [bio, userId];
    return db.query(q, params);
};

module.exports.getLastUsers = () => {
    return db.query(`SELECT * FROM users ORDER BY id DESC LIMIT 3`);
};

module.exports.getUserSearch = (input) => {
    return db.query(
        `SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1`,
        [input + "%"]
    );
};

module.exports.getFriendship = (userId1, usersId2) => {
    const q = `SELECT * FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;

    const params = [userId1, usersId2];

    return db.query(q, params);
};

module.exports.requestFriendship = (userId1, userId2) => {
    const q = `
    INSERT INTO friendships (sender_id, recipient_id)
    values ($1, $2)  
    `;
    const params = [userId1, userId2];
    return db.query(q, params);
};

module.exports.cancelFriendship = (userId1, userId2) => {
    const q = `
    DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;

    const params = [userId1, userId2];
    return db.query(q, params);
};

module.exports.acceptFriendRequest = (userId1, userId2) => {
    const q = `
    UPDATE friendships
    SET accepted = true 
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;

    const params = [userId1, userId2];
    return db.query(q, params);
};
