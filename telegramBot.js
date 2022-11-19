
const token = '5189315995:AAH08sFdFug0515I3RvBiYHVQo9aK4SomiY'
const { Telegraf } = require('telegraf');
const bot = new Telegraf(token)
const axios = require('axios');
const {
  flushall, setChatIdLoginAndPassword, getChatIDandName,
  setTokenToInformation
} = require('./redisFuction');

const helpMessage = `
  Este são os commandos;
  /login <email> <password> - Login,
  /help - command reference;
  /game_crash $<valor> #<martingale:numeral> $<sorosgale:porcentagem> @<maxloss:porcentagem> &<stopWin>
  /game_double $<valor> #<martingale:numeral> $<sorosgale:porcentagem> @<maxloss:porcentagem> &<stopWin> 
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
      await setTokenToInformation(`${el.data.token}`, JSON.stringify({ id : from.id , from : from.first_name }))
      ctx.state.token = el.data.token;
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
  users_token = JSON.parse(users_token)
  const message = ctx.message.text
  const body = {
    valor : 1.11,
    martingale : 0,
    channel : 'teste',
    sorogale : 0,
    maxloss : 9999,
    stopwin : 9999
  }

  
  if (message) {
    const splitMessage = message.split(' ')
    console.log(splitMessage)
    splitMessage.forEach(el => {
      console.log(el)
      if (/>/g.test(el)) {
        body.valor = el.replace(/>/g, '');
      }
      if (/#/g.test(el)) {
        body.martingale = el.replace(/#/g, '');
      }
      if (/%/g.test(el)) {
        body.sorogale = el.replace(/%/g, '')
      }
      if (/!/g.test(el)) {
        body.maxloss = el.replace(/!/g, ' ')
      }
      if (/&/g.test(el)) {
        body.stopwin = el.replace(/&/g, '')
      }
      if (/@/g.test(el)) {
        body.channel = el.replace(/@/g, '')
      }
    })
  }

  try {
    axios({
      method: 'post',
      url: 'http://localhost:3053/v1/crash',
      headers: {
        "token": users_token.token
      },
      data: body
    }).then(el => {
      console.log(el.data);
      ctx.reply('Iniciando o Bot');
    })
  } catch (e) {
    return ctx.reply('Ocorreu um erro na sua solicitação a API, Por favor entre em contato conosco, Faço seu Registro e Utilize o Bot');
  }
})

bot.command(['game_double'], async (ctx, next) => {
  const from = ctx.message.from
  let users_token = await getChatIDandName(from.id, from.first_name, from.last_name);
  users_token = JSON.parse(users_token)
  const message = ctx.message.text
  const body = {
    valor : 1.11,
    martingale : 0,
    channel : 'teste',
    sorogale : 0,
    maxloss : 9999,
    stopwin : 9999
  }
  
  if (message) {
    const splitMessage = message.split(' ')
    console.log(splitMessage)
    splitMessage.forEach(el => {
      console.log(el)
      if (/>/g.test(el)) {
        body.valor = el.replace(/>/g, '');
      }
      if (/#/g.test(el)) {
        body.martingale = el.replace(/#/g, '');
      }
      if (/%/g.test(el)) {
        body.sorogale = el.replace(/%/g, '')
      }
      if (/!/g.test(el)) {
        body.maxloss = el.replace(/!/g, ' ')
      }
      if (/&/g.test(el)) {
        body.stopwin = el.replace(/&/g, '')
      }
      if (/@/g.test(el)) {
        body.channel = el.replace(/@/g, '')
      }
    })
  }

  try {
    axios({
      method: 'post',
      url: 'http://localhost:3053/v1/double',
      headers: {
        "token": users_token.token
      },
      data: body
    }).then(el => {
      console.log(el.data);
      ctx.reply('Iniciando o Bot');
    })
  } catch (e) {
    return ctx.reply('Ocorreu um erro na sua solicitação a API, Por favor entre em contato conosco, Faço seu Registro e Utilize o Bot');
  }
})


bot.launch()

