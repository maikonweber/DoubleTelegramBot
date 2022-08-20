const MQ = require('./mq');
const q = 'test';
const Crash = require('./src/Robots/crash');
const mq = new MQ(q);

const crash = new Crash( 
'm.carvalho@grouplinknetwork.com',
'Ma128sio5',
10,
0.5,
0.5,
0.5,
100
);


mq.setupConnection().then(() => {
    console.log('Connection established')
    console.log(crash)
    crash.init().then().catch(err => {
        console.log(err)
    })
}).catch((err) => {
    console.log(err);
}).finally(() => {
    // const channel = mq.recv();
    // channel.consume(q, (msg) => {
    //     crash.getEntry(msg)
    //     console.log(' [x] Received %s', msg.content.toString());
    // })
})