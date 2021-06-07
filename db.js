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
