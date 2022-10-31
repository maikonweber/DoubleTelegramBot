const Redis = require('ioredis');
const client =  new Redis()
const double = require('./src/Robots/Double.js')
const MQ = require('./mq');


const mq =  MQ('double');

mq.setupConnection().then(el => {
  mq.recv().then(el => console.log(el));
})
/*
SELECT * from users 
JOIN users_blaze 
ON users.id = users_blaze.users_id 
JOIN payament_value 
ON payament_value.user_id = users.id ;
*/



