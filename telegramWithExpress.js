const express = require('express');
const {
  startChannelQueue, setUserIsQueue, getChannelQueue,setUserToQueue,setUserOnline
} = require('./redisFuction.js');

const MQ = require('./mq');

var bodyParser = require('body-parser')
const crypto = require('crypto');

const {
  getUser,
  registerToken,
  getTokenIsValid,
  getTokenAndUserInformation,
  getChannelInformationDouble,

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
  const tokenAPI = 'xxx-xxx-567-9'
  if (token == tokenAPI) {
    next()
  }
  res.send('Not Found').status(404)
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
  const body = req.body
  console.log(body)
  const channel = await getChannelInformationDouble(req.body.channel);
  console.log(channel);
  const syngal = channel.sygnal_position;
  const element = req.body.text

  console.log(element)
  const element1 = (element[syngal].replace(/✨/, '')).replace(/\n/g, '');
  console.log(element1, 'sygnal')

  const message = {}
  if (element1 === channel.symbol_red) {
    message.aposta = 'red'
  } else if (element1 === channel.symbol_white) {
    message.aposta = 'white'
  } else if (element1 === channel.symbol_black) {
    message.aposta = 'black'
  }
  
  message.channel_name = channel.channel_name;
  message.white_protect = channel.white_procted;
  console.log(message);
  const mq = new MQ(channel.channel_name);
  mq.setupConnection().then(async el => {
    mq.send(JSON.stringify(message));

  });

  res.status(200);
})


app.post('/v1/crash', async (req, res) => {
  console.log(req.body);
  const token = req.headers.token
  const getUser = await getTokenAndUserInformation(token);
  const { valor, martingale, channel, sorogale, maxloss, stopwin } = req.body
  let arrayQueue = await getChannelQueue(`${channel}`);
  arrayQueue = JSON.parse(arrayQueue);
  console.log(arrayQueue);

  const userQueue = {
      getUser,
      valor,
      martingale,
      sorogale,
      maxloss,
      stopwin
  }  
  
  arrayQueue.push(userQueue)
  await setUserToQueue(`${channel}`, arrayQueue);
  console.log(await getChannelQueue(`${channel}`));
  await setUserOnline(`${getUser.users_id}`, userQueue)
  return res.json("Sua posição foi posicionada aguarde os Resultados").status(200)
})


app.post('/v1/double', async (req, res) => {
  const token = req.headers.token
  const getUser = await getTokenAndUserInformation(token);
  const { valor, martingale, channel, sorogale, maxloss, stopwin } = req.body
  console.log(channel);
  let arrayQueue = await getChannelQueue(`${channel}`);
  arrayQueue = JSON.parse(arrayQueue);
  console.log(arrayQueue);

  const userQueue = {
      getUser,
      valor,
      martingale,
      sorogale,
      maxloss,
      stopwin
  }  

  arrayQueue.push(userQueue)
  await setUserToQueue(`${channel}`, arrayQueue);
  await setUserOnline(`${getUser.users_id}`, userQueue)
  console.log(await getChannelQueue(`${channel}`));
  return res.json("Sua posição foi posicionada aguarde os Resultados").status(200)/* Expirart em worktime */
})

app.listen(port, () => {
  console.log('App Express is Running, ' + port);
})
