const Redis = require('ioredis');
const client =  new Redis()
const Crash = require('./src/Robots/crash');
const MQ = require('./mq');
const mq = new MQ('crash')

mq.setupConnection().then(el => {
  mq.recv().then(el => {
    console.log(el.content);
  })
})  /*
SELECT * from users 
JOIN users_blaze 
ON users.id = users_blaze.users_id 
JOIN payament_value 
ON payament_value.user_id = users.id ;
*/



