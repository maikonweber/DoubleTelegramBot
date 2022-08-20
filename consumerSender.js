const MQ = require('./mq');
const mq = new MQ('guest', 'guest', 'localhost', '5672');

const msg = {
    enterTime: '',
    retirar: 2.0,
    valor: 2.0,
}
const q = 'test';

mq.setupConnection().then(async() => {
    await mq.send(JSON.stringify(msg));
})


