// const hasher = require('./hasher')
const crypto = require('crypto')

var pg = require('pg');
let client = {
    host: 'localhost',
    port: 5532,
    database: 'roullet',
    user: 'roullet',
    password: 'roullet'
};


let pool = new pg.Pool(client);

async function getUser(login, password) {
    const query = `
        SELECT * FROM users WHERE login = '${login}' AND password = '${password}'
    `;
    const result = await pool.query(query);
    return result.rows[0];
}


module.exports = { 
    getUser,
  }




