// Import amqp lib
// Import moment lib
var moment = require('moment-timezone');
// Import redis lib
const amqp = require('amqplib');


module.exports = class MQ {
    constructor(queue) {
        this.conn;
        this.uri = 'amqp://' + 'guest' + ':' + 'guest' + '@' + 'localhost' + ':' + '5672';
        this.channel;
        this.q = queue;
    }

   async setupConnection() {
        this.conn = await amqp.connect(this.uri);
        this.channel = await this.conn.createChannel();
        await this.channel.assertQueue(this.q, { durable: false });
    }   

    send(msg) {
        this.channel.sendToQueue(this.q, Buffer.from(msg));
        console.log(' [x] Sent %s', msg);
    }

    recv() {
        return this.channel
    }
}


