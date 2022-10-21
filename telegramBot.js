
const token = '5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc'
const { Telegraf } = require('telegraf');
const bot = new Telegraf(token)
const axios = require('axios');
const {
  flushall, setChatIdLoginAndPassword, getChatIDandName
} = require('./redisFuction');

const helpMessage = `
  Este são os commandos;
  /login <email> <password> - Login,
  /help - command reference;
`


bot.command(['help'], (ctx) => {
  ctx.reply(helpMessage);
})

bot.command(['login'], async (ctx, next) => {
  console.log(ctx.message.text);
  const inputuser = ctx.message.text.split(" ");
  const email = inputuser[1];
  const password = inputuser[2];
  let body = {
    "password": password,
    "email": email
  }

  const from = ctx.message.from;

  body = JSON.stringify(body);
  console.log(body);
  try {
  axios({
    method: 'post', url: 'http://localhost:3053/login', data: {
      password, email
    }
  }).then(async el => {
    await setChatIdLoginAndPassword(from.id, from.first_name, from.last_name, {
      "token": el.data.token
    })
    ctx.state.token = el.data.token
    ctx.reply(el.data.message);
  })
  return next(ctx);
  } catch (e) {
    ctx.reply('Houve um problema para fazer as chamadas a API');
  }
});

bot.command(['game_crash'], async (ctx, next) => {
  const from = ctx.message.from
  let users_token = await getChatIDandName(from.id, from.first_name, from.last_name);
  users_token = JSON.parse(users_token);
  const password = 'ma128sio4';
  const username = "maikonweber@gmail.com";
  const martingale = 2;
  const sorogale = 10;
  const meta = 20;
  const maxloss = 20;
  try {
    axios({
      method: 'post',
      url: 'http://localhost:3053/v1/crash',
      headers: {
        "token": users_token.token
      },
      data: {
        "password": password,
        "username": username,
        "martingale": martingale,
        "sorogale": sorogale,
        "maxloss": maxloss,
        "meta": meta,
      }
    }).then(el => {
      console.log(el.data);
      ctx.reply('Iniciando o Bot');
    })
  } catch (e) {
    return ctx.reply('Ocorreu um erro na sua solicitação a API, Por favor entre em contato conosco');
  }
})

process.once('SIGINT', () => {
  flushall().then()
  return bot.stop('SIGINT')

});
process.once('SIGTERM', () => {
  flushall().then()
  return bot.stop('SIGTERM')
});

bot.launch()
