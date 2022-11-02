const Redis = require('ioredis');
const client =  new Redis()
const Crash = require('./src/Robots/crash');
const MQ = require('./mq');
const mq = new MQ('crash')

mq.setupConnection().then(el => {
  mq.recv().consume(mq.queue, async (msg) => {
    if(msg) {
      let msgString = msg.content.toString();
      msgString = JSON.parse(msgString)
      // await setUserIsQueue(msgString[0], msgString[1]) - Set this user to Queue for use in the next version for channel
      const Robots = new Crash(msgString[0].username, msgString[1].password, msgString[1].valor, msgString[1].martingale, msgString[1].sorogale, msgString[1].maxloss, msgString.stopwin)
      
    } 
  }, { noAck : true})
  })
    /*
SELECT * from users 
JOIN users_blaze 
ON users.id = users_blaze.users_id 
JOIN payament_value 
ON payament_value.user_id = users.id ;
*/



