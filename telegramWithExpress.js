const express = require('express');
const appWs = require('./app-ws');
const redis = require('ioredis');

var bodyParser = require('body-parser')

const {
  getUser
} = require('./database');
const Crash  = require('./src/Robots/crash');
const client = new redis();
require('dotenv').config()
const port = 3053;

const app = express()

// parse application/x-www-form-urlencodedc
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', (req, res) => res.send('Hello World!'))
// Set the bot API endpoin

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email, password);
  if (!user) {
  res.send({message : 'Não foi localizado seu usuário, Faça seu cadastro aqui : https://muttercorp.online'}).status(400);
  } else {
  res.send({message : 'Bem Vindo ao CrashDoubleTelgram', token: '091x082'}).status(200);
  };
})       

app.use('/v1', (req, res, next) => {
  if(req.headers.token == 'xxxx1xx2') {
    next();
  }
})

/*
  'm.carvalho@grouplinknetwork.com',
                          'Ma128sio5',
                          10,
                          0.5,
                          0.5,
                          0.5,
                          100
*/

app.post('/crash', async (req, res) => {
  const { username, senha, worktime, martingale, sorogales, maxloss, valor  } = req.body
  try {
              const crash = new Crash(
                  username, senha, worktime, martingale, sorogales, maxloss, valor          
              );

              crash.init().then((el) => {
              res.status(200).send(el)         
              }).catch(err => {
              
              
              })
  } catch (e) {
              res.status(500).send(e);
  }
})

app.listen(port, () => {
  console.log('App Express is Running, '  + port);
  })
