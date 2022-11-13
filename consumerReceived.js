const Double = require('./src/Robots/Double');
const MQ = require('./mq');
const mq = new MQ('teste');
const {
    getChannelQueue
} = require('./redisFuction');

mq.setupConnection(el => {
    mq.recv().consume(mq.queue, async (msg) => {
        if (msg) {
            console.log(msg);
            let msgString = msg.content.toString();
            msgString = JSON.parse(msgString)
            const arrayOfUsersInQueue = await getChannelQueue('teste');
            arrayOfUsersInQueue.forEach(element => {
                const blaze = new Double()

            });
        }
    }, { noAck : true});
})