const express  = require('express');
const app = express();
const port = process.env.PORT || 3051; 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Blaze = require('./crash');
const webhooks = require('node-webhooks');
const { getUser } = require('./database');

app.post('/api/v1/setCrash', async (req, res) => {
          console.log(req)
          const horario = req.body.horario
          const valor = req.body.valor
          const username = req.body.username
          const password = req.body.password
          const autoretirar = req.body.autoretirar
          console.log(horario, valor, username, password, autoretirar)
          const blaze = new Blaze(valor, username, password, horario, autoretirar)
          await blaze.getEntry()
          res.json('You have set the blaze at ') 
        })

app.post('/login', async (req, res) => {
            const { username, password } = req.body
            const user = await getUser(username)
            if(user.password === password){
                res.json({
                    message: 'Login efetuado com sucesso'
                })
            } else {
                res.json({
                    message: 'Erro ao efetuar o login'
                })
            }
        })       

app.post('/api/v1/getCrash', async (req, res) => {
    // Set Webhooks
   
})
