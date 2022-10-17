const express  = require('express');
const app = express();
const port = process.env.PORT || 3051; 
const cookieParser = require('cookie-parser');
//const cors = require('cors');
// const Blaze = require('./crash');
// const webhooks = require('node-webhooks');
const { getUser } = require('./database');


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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

