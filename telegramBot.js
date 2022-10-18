
const token = '5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc'
const { Telegraf } =  require('telegraf');
const { Scenes, Stage }  = require('telegraf');
const axios = require('axios');

const {
  getChatIDandName,  
  setUserAndPreference,
    UnsetUser,
    setChatIDandName,
    setChatIdLoginAndPassword
} = require('./redisFuction')
const bot = new Telegraf(token)

const contactDataWizard = new Scenes.WizardScene(
  'start', (ctx) => {
    console.log('Start this ')
    ctx.reply('Qual jogo você quer Jogar');
    ctx.wizard.state.contactData = {}
    return ctx.wizard.next();
  },
  (ctx) => {
  if(ctx.message.text.length < 2) {
      ctx.reply('Por Favor Digite um Email');
      return
  }
  ctx.wizard.state.contactData.fil = ctx.message.text;
  ctx.reply('Digite sua Senha');
  return ctx.wizard.next();
},
 async (ctx) => {
    ctx.wizard.contactData.password = ctx.message.text;
    ctx.reply('Set Martingale Number');
    return ctx.wizard.next();
 },
 async (ctx) => {
  ctx.wizard.contactData.martigale = ctx.message.text;
  ctx.reply('Set Sorogale Porcent');
  return ctx.wizard.next();
 },
 async (ctx) => {
  ctx.wizard.contactData.sorogale = ctx.message.text;
  ctx.reply('Set Sorogale Porcent');
  return ctx.wizard.next();
 },
 async (ctx) => {
  ctx.wizard.contactData.worktime = ctx.message.text;
  ctx.reply('Set Valor das Entradas');
  return ctx.wizard.next();
 },
 async (ctx) => {
  ctx.wizard.contactData.valor = ctx.message.text;
  ctx.reply('Set maxloss das Entradas');
  return ctx.wizard.next();
 },
 async (ctx) => {
  ctx.wizard.contactData.maxloss = ctx.message.text;
  ctx.reply('Set winstop das Entradas');
  return ctx.wizard.next();
 },
 async (ctx) => {
  ctx.wizard.contactData.winstop = ctx.message.text;
  ctx.reply('Deseja iniciar a entradas');
  return ctx.wizard.next();
 },
 async (ctx) => {
  const body = {}
  body.username = ctx.wizard.contactData.fio
  body.password = ctx.wizard.contactData.password
  body.martigale = ctx.wizard.contactData.martigale
  body.sorogale = ctx.wizard.contactData.sorogale
  body.maxloss = ctx.wizard.contactData.valor
  body.winstop = ctx.wizard.contactData.maxloss
  body.valor = ctx.wizard.contactData.winstop
  ctx.wizard.contactData.valor = ctx.message.text;
  await axios.post('http://localhost:3053/crash', body);
  ctx.reply('Seu Bot foi Configurado');
  return ctx.scene.leave();
 }
)



// to  be precise, session is not a must have for Scenes to work, but it sure is lonely without one
bot.hears('start',  contactDataWizard.enter('start'));
// bot.use(async (ctx, next) => {
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