// Import amqp lib
var amqp = require('amqplib/callback_api');
// Import moment lib
var moment = require('moment-timezone');
// Import redis lib


class mq {
    constructor() {
        this.channel = null;
        this.connection = null;
        this.queue = 'crash';
        this.exchange = 'crash';
        this.routingKey = 'crash';
        this.queueOptions = {
            durable: true
        };
        this.exchangeOptions = {
            durable: true
        };
        this.routingKeyOptions = {
            durable: true
        };
        this.message = {
            contentType: 'application/json',
            contentEncoding: 'utf-8',
            headers: {
                'x-match': 'all',
                'x-priority': '1'
            },
            deliveryMode: 2
        };
    }

    static async init() {
    // Connetec to RabbitMQ and save this connection in a variable
        const connection = await amqp.connect('amqp://localhost');
        // Create a channel and save this channel in a variable
        const channel = await connection.createChannel();
        // Create a queue and save this queue in a variable
        const queue = await channel.assertQueue(this.queue, this.queueOptions);
        // Create an exchange and save this exchange in a variable
        const exchange = await channel.assertExchange(this.exchange, 'topic', this.exchangeOptions);
        // Bind the queue to the exchange with the routing key
        const routingKey = await channel.bindQueue(queue.queue, exchange.exchange, this.routingKey, this.routingKeyOptions);
        // Return the channel and the queue    
        return {
            channel,
            queue
        };
}