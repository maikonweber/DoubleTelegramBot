const { Telegraf } = require('telegraf')
const axios = require('axios')
const bot = new Telegraf('5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc')

bot.start((ctx) => ctx.reply('Welcome'))
bot.command('login', (ctx) => {
    ctx.reply('Bem vindo ao Bot de Blaze')
    ctx.reply('Digite o seu email')     
    bot.on('text', (ctx) => {
    var email = ctx.message.text
    ctx.reply('Digite a sua senha')
    })
    bot.on('text', (ctx) => {
    var senha = ctx.message.text
    ctx.reply('Executando o login')
    axios.post('http://localhost:3000/login', {
        email: email,
        senha: senha
    }).then(function (response) {
        console.log(response.data)
        ctx.reply('Login efetuado com sucesso')
        ctx.reply(`${JSON.stringify(response.data)}`)
        }).catch(function (error) {
        console.log(error)
        ctx.reply('Erro ao efetuar o login')
        })
    })


})  

bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()