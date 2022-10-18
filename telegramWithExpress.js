const express = require('express');
const appWs = require('./app-ws');
const redis = require('ioredis');
const Crash  = require('./src/Robots/crash');
const client = new redis();
require('dotenv').config()
const port = 3053;

const app = express()

app.get('/', (req, res) => res.send('Hello World!'))
// Set the bot API endpoin

app.post('/login', async (req, res) => {
  const { email, senha } = req.body
  const user = await getUser(username)
  console.log(user)
  console.log(email, senha)
  if(user.senha === senha){
      res.json({
          message: 'Login efetuado com sucesso'
      })
  } else {
      res.json({
          message: 'Erro ao efetuar o login'
      })
  }
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
  
appWs(app)
