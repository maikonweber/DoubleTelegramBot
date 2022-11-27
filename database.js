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


async function insertRegisterAction(game, valor, bankValue, win, time) {
    const query = `INSERT INTO register_action (game, valor, bankvalue, win, time) 
                   VALUES ($1, $2, $3, $3, $5)`
    const result = await pool.query(query, [game, valor, bankValue, win, time]);
    return result.rows();

}
  
async function getUser(login, password) {
    const query = `
        SELECT * FROM users WHERE email = '${login}' AND password = '${password}'
    `;
    const result = await pool.query(query);
    return result.rows[0];
}

async function getChannelInformationDouble(channel) {
    const query = `SELECT * from channel_config_double
                   JOIN channel_name_double
                   ON channel_name_double.channel_id = channel_config_double.id                
                   Where id = $1`

    const res = await pool.query(query, [channel])
    return res.rows[0] 
}

async function getTokenAndUserInformation(token) {
    const query = `SELECT password_, username_, users_id 
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

async function getToken(user_id) {
    const query = `Select token from token_users WHERE user_id = $1 Order by created_at DESC limit 1;`
    const result = await pool.query(query, [user_id])
    console.log(result);
    return result.rows[0].token
}


async function getAllUsersPayment() {
    const query = `SELECT email, users_id, pay, users_id, username_, password_ from users 
    JOIN users_blaze 
    ON users.id = users_blaze.users_id 
    JOIN payament_value 
    ON payament_value.user_id = users.id;
    `;

    const result = await pool.query(query)
    console.log(result.rows);
    return result.rows
    //   return result.rows.map(el => {
    // return {
    //     "email" : el.email,
    //     "pay" : el.pay,
    //     "users_id" : el.users_id,
    //     "username" : el.username_,
    //     "password" : el.password_
    //      }
    // })
}

async function getallChannelDatabase(channel) {
    const query = `
        Select * from $1;
    `
    const result = await pool.query(query, [channel])
    return result.rows[0];
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
    getTokenAndUserInformation,
    getChannelInformationDouble,
    getToken,
    insertRegisterAction,
    getallChannelDatabase
}




