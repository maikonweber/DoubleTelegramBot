const Double = require('./src/Robots/Double');
const MQ = require('./mq');
const mq = new MQ('teste');

const {
    getChannelQueue, startChannelQueue, flushall
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
            if (arrayOfUsersInQueue) {
                arrayOfUsersInQueue.forEach(async element => {
                    console.log('queue loop')
                    const blaze = new Double(msgString.aposta, false, element);
                    if (element['maxloss'] > 0 || element['stopwin'] > 0) {
                        blaze.routine().then((async el => {
                        }))
                        console.log('End of Operation');
                    }
                });
            } else {
                console.log('Not Have Any Client Routine');
            }
        }
    }, { noAck: true });
})

process.once('SIGINT', () => {
    flushall().then()
});
process.once('SIGTERM', () => {
    flushall().then()
});

