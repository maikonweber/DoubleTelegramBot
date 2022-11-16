const Double = require('./src/Robots/Double');
const MQ = require('./mq');
const mq = new MQ('teste');



const {
    getChannelQueue, startChannelQueue
} = require('./redisFuction');
const { getUser } = require('./database');

mq.setupConnection().then(async el => {
    await startChannelQueue('teste')
    mq.recv().consume(mq.queue, async (msg) => {
        if (msg) {
            let msgString = msg.content.toString();
            msgString = JSON.parse(msgString)
            console.log(msgString);

            let arrayOfUsersInQueue = await getChannelQueue(msgString.channel_name);
            console.log(arrayOfUsersInQueue)
            arrayOfUsersInQueue = JSON.parse(arrayOfUsersInQueue)           
            if(arrayOfUsersInQueue) {
            arrayOfUsersInQueue.forEach(async element => {    
                console.log(element);
                const blaze = new Double(msgString.aposta, false, element);
                blaze.routine().then();
            });
            } else {
                console.log('Not Have Any Client Routine');
            }
        }
    }, { noAck: true });
})