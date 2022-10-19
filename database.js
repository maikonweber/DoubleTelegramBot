// const hasher = require('./hasher')
const crypto = require('crypto')

var pg = require('pg');
let client = {
    host: 'localhost',
    port: 5932,
    database: 'doubletelegram',
    user: 'doubletelegram',
    password: 'doubletelegram'
};
const crypto = require('crypto');



let pool = new pg.Pool(client);

async function getUser(login, password) {
    const query = `
        SELECT * FROM users WHERE email = '${login}' AND password = '${password}'
    `;
    const result = await pool.query(query);
    return result.rows[0];
}



async function getTokenIsValid(token) {
    const query = `
    Select * 
    FROM users_token ut
    JOIN payament_value pv
    ON pv.user_id = u.t.user_id
    WHERE token = $1;`
    const result = await pool.query(query, [token]);
    return result.rows[0];
}

async function registerToken(token, users_id) {
    const query = `INSERT INTO users_token (token, users_id) VALUES ($1, $2);`
    const result = await pool.query(query, [token, users_id]);
    return 
}


module.exports = { 
    getUser,
    registerToken,
    getTokenIsValid
  }




