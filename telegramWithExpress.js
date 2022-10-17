const express = require('express');
const appWs = require('./app-ws');
const redis = require('ioredis');
const client = new redis();
require('dotenv').config()


// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
// Set the bot API endpoin


app.listen(port, () => {
  console.log('App Express is Running, '  + port);
  })
  
appWs(app)
  