// const hasher = require('./hasher')

var pg = require('pg');
let client = {
    host: 'localhost',
    port: 5932,
    database: 'doubletelegram',
    user: 'doubletelegram',
    password: 'doubletelegram'
};


let pool = new pg.Pool(client);

async function getUser(login, password) {
    const query = `
        SELECT * FROM users WHERE email = '${login}' AND password = '${password}'
    `;
    const result = await pool.query(query);
    return result.rows[0];
}

async function getTokenAndUserInformation(token) {
    const query = `SELECT password_, username_ 
                   FROM token_users tu 
                   JOIN users_blaze ub 
                   ON tu.user_id = ub.users_id 
                   WHERE token = $1
                   ORDER BY tu.created_at 
                   DESC LIMIT 1;
                   `
        const result = await pool.query(query, [token])
        return result.rows
    }
 

async function getUserBlaze(users_id) {
    const query = `
        Select * from users u
        JOIN users_blaze  ab
        ON u.id = ab.users_id
        WHERE users_id = $1;    
    `

    const result = await pool.query(query, [users_id])
    return result.rows[0];
}


async function getTokenIsValid(token) {
    const query = `
    Select * 
    FROM token_users ut
    JOIN payament_value pv
    ON pv.user_id = ut.user_id
    WHERE token = $1;`
    const result = await pool.query(query, [token]);
    return result.rows[0];
}

async function registerToken(token, users_id) {
    const query = `INSERT INTO token_users (token, user_id) VALUES ($1, $2);`
    const result = await pool.query(query, [token, users_id]);
    return 
}


module.exports = { 
    getUser,
    registerToken,
    getTokenIsValid,
    getTokenAndUserInformation
  }




