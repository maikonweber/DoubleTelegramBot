const express = require('express');
const redis = require('ioredis');
var bodyParser = require('body-parser')
const crypto = require('crypto');
const {
  getUser,
  registerToken,
  getTokenIsValid
} = require('./database');
const Crash  = require('./src/Robots/crash');
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
  res.send({message : 'Não foi localizado seu usuário, Faça seu cadastro aqui : https://muttercorp.online'}).status(400);
  } else {
  const secret = "X64as5861to156";
  const payload =  JSON.stringify({"email" : email, "password" : password});
  const header = JSON.stringify({"alg": "HS256", "typ": "JWT"})
  const base64Header = Buffer.from(header).toString('base64').replace(/=/g, '');
  const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '');
  const data =  base64Header + '.' + base64Payload;
  const token = crypto.createHmac('sha256', secret).update(data).digest('base64');
  await registerToken(token, user.id);
  res.json({message : 'Bem Vindo ao CrashDoubleTelgram', token: token}).status(200);
  };
})


app.use('/v1', async (req, res, next) => {
  const token = req.headers.token
  console.log(token, "token")
  const result = await getTokenIsValid(token);
  req.users = result 
  if(result.pay === true) {
    next();
  } else if (!result) {
    res.json('Tente fazer login novamente').status(200);
  } else if (result.pay === false) {
    res.json('Ocorreu um erro, você ainda não pagou a mensalidade deste mês');
  }
})

app.post('/v1/crash', async (req, res) => {
  const { worktime, martingale, sorogales, maxloss, valor  } = req.body

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
