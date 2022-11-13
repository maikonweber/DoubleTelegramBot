const {
  setUserIsQueue,
  getChannelQueue
} = require('./redisFuction');
const double = require('./src/Robots/Double.js')
const MQ = require('./mq');
const mq = new MQ('double');

mq.setupConnection().then(el => {  
mq.recv().consume(mq.queue, async (msg) => {
    if(msg) {
      console.log(msg)
      let msgString = msg.content.toString();
      msgString = JSON.parse(msgString)

      let arrayOfQueue = await getChannelQueue(msgString.channel);
      arrayOfQueue = JSON.parse(arrayOfQueue);
      if(arrayOfQueue) {
        arrayOfQueue.push(msgString);
        await setUserIsQueue(`${msg.msgString}`, arrayOfQueue);
      }
      
      //const Robots = new double(msgString[0].username, msgString[1].password, msgString[1].valor, msgString[1].martingale, msgString[1].sorogale, msgString[1].maxloss, msgString.stopwin)
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



