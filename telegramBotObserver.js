
const token = '5697125034:AAETDW7Nem17erD_c5_xsv6WycyYmqn-urM'
const { Telegraf } = require('telegraf');
const bot = new Telegraf(token)
const axios = require('axios');
// const {
//   flushall, setChatIdLoginAndPassword, getChatIDandName
// } = require('./redisFuction');
// const database = queryGroupChannel(groupId);
const tokenAPI = 'xxx-xxx-567-9' 

bot.hears(/✨/g, (ctx) => {
    console.log(ctx)
    const text = ctx.message.text.split(' ')
    const body = {
      text
    }
    body.channel = 1
    try {
      axios({
        method: 'post',
        url: 'http://localhost:3053/v2/observer',
        headers: {
          "token": tokenAPI
        },
        data: body
      }).then(el => {
        console.log(el.data);
      })
    } catch (e) {
      return ctx.reply('Ocorreu um erro na sua solicitação a API, Por favor entre em contato conosco, Faço seu Registro e Utilize o Bot');
    }
})


process.once('SIGINT', () => {
  
  return bot.stop('SIGINT')

});
process.once('SIGTERM', () => {
  return bot.stop('SIGTERM')
});

bot.launch()
