
const token = '5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc'
const {  Telegraf } = require('telegraf');
const bot = new Telegraf(token)
const axios = require('axios');

const helpMessage = `
  Este são os commandos;
  /login <email> <password> - Login,
  /help - command reference;
`


bot.command(['help'], (ctx) => {
   ctx.reply(helpMessage);
})

bot.command(['login'], async (ctx) => {
  console.log(ctx.message.text);
  const inputuser = ctx.message.text.split(" ");
  const email = inputuser[1];
  const password = inputuser[2];
  let body = {
    "password" : password,
    "email" : email
  }

  body = JSON.stringify(body);
  console.log(body);
  axios({method: 'post', url : 'http://localhost:3053/login', data : {
    password, email
  }
}).then(el => {
    console.log(el)
    ctx.state.token = el.token;
    return ctx.reply(el.data.message);
  });
});







// to  be precise, session is> {
//   const start = new Date();
//   await next();
//   const ms = new Date() - start;
//   console.log('Response time: %sms', ms);
// });

// bot.catch((err, ctx) => {
//   console.log(`Ooops, ecountered an error for ${ctx.updateType}`, err);
// });

// // * Bot start and Save in Redis the inf

// bot.start(async (ctx, next) => {
//   console.log(ctx)
//   const { id, first_name, last_name } = ctx.message.from;
//   const users = await getChatIDandName()
//   if(!users) {
//   setChatIDandName(first_name, last_name, id);
//   ctx.reply(`Bem vindo ao Bot Double e Crash da Blaze`, first_name);
//   }
//   ctx.reply(`Bem Vindo ao Crash e Double`, first_name)
//   await next();
// });

// bot.command('/startgame',  async (ctx) => {
//     ctx.session.myData = {};
//     ctx.reply('Qual jogo você deseja iniciar', () => {})
//   })


bot.launch()

