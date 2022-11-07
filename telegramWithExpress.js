const express = require('express');
const {
  setUserIsQueue
} = require('./redisFuction.js');

const MQ = require('./mq');

var bodyParser = require('body-parser')
const crypto = require('crypto');

const {
  getUser,
  registerToken,
  getTokenIsValid,
  getTokenAndUserInformation
} = require('./database');

const Crash = require('./src/Robots/crash');
const redis = require('ioredis');
const client = new redis();

require('dotenv').config();


const port = 3053;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
// Set the bot API endpoin
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email, password);
  if (!user) {
    res.send({ message: 'Não foi localizado seu usuário, Faça seu cadastro aqui : https://muttercorp.online' }).status(400);
  } else {
    const secret = "X64as5861to156";
    const payload = JSON.stringify({ "email": email, "password": password });
    const header = JSON.stringify({ "alg": "HS256", "typ": "JWT" })
    const base64Header = Buffer.from(header).toString('base64').replace(/=/g, '');
    const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '');
    const data = base64Header + '.' + base64Payload;
    const token = crypto.createHmac('sha256', secret).update(data).digest('base64');
    await registerToken(token, user.id);
    res.json({ message: 'Bem Vindo ao CrashDoubleTelgram', token: token }).status(200);
  };
})

app.use('/v2', async (req, res, next) => {
  const token = req.headers.token
  console.log(token, "token")
  const result = await getTokenIsValid(token);
  req.users = result
  if (result.pay === true) {
    next();
  } else if (!result) {
    res.json('Tente fazer login novamente').status(200);
  } else if (result.pay === false) {
    res.json('Ocorreu um erro, você ainda não pagou a mensalidade deste mês').status(404);
  }
})


app.use('/v1', async (req, res, next) => {
  const token = req.headers.token
  console.log(token, "token")
  const result = await getTokenIsValid(token);
  req.users = result
  if (result.pay === true) {
    next();
  } else if (!result) {
    res.json('Tente fazer login novamente').status(200);
  } else if (result.pay === false) {
    res.json('Ocorreu um erro, você ainda não pagou a mensalidade deste mês').status(404);
  }
})

app.post('/v2/observer', async (req, res) => {
  const token = req.headers.token 
  const getChannelInformation = getChannelInformation(token)
  const mq = new MQ('crash')
  const getUser = await getTokenAndUserInformation(token);
  const { valor, martingale , channel, sorogale, maxloss, stopwin } = req.body
  console.log('Start This Shit')
  mq.setupConnection().then(el => {
  mq.send(JSON.stringify([ getUser , {
        martingale, valor, channel, sorogale, maxloss, stopwin
    }]))
    return res.json("Sua posição foi posicionada aguarde os Resultados").status(200)/* Expirart em worktime */
    })
})


app.post('/v1/crash', async (req, res) => {
  console.log(req.body);
  const token = req.headers.token 
  const mq = new MQ('crash')
  const getUser = await getTokenAndUserInformation(token);
  const { valor, martingale , channel, sorogale, maxloss, stopwin } = req.body
  console.log('Start This Shit')
  mq.setupConnection().then(el => {
  mq.send(JSON.stringify([ getUser , {
        martingale, valor, channel, sorogale, maxloss, stopwin
    }]))
    return res.json("Sua posição foi posicionada aguarde os Resultados").status(200)/* Expirart em worktime */
    })
})


app.post('/v1/double', async (req, res) => {
  const token = req.headers.token
  const getUser = await getTokenAndUserInformation(token);
  const { martingale, valor, channel, sorogale, maxloss, stopwin } = req.body
  const queueSetPosition = client.publisher('double' , JSON.stringify({getUser, worktime, martingale, sorogale, valor, channel, maxloss, stopwin}));
  if (queueSetPosition) {
    res.json("Sua posição foi posicionada aguarde os Resultados").status(200)/* Expirart em worktime */
  } else {
    res.json('Sua posição não foi verificada!!!').status(404)
  }
})


app.listen(port, () => {
  console.log('App Express is Running, ' + port);
})
