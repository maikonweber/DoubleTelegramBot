
const token = '5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc'
const { Telegraf } = require('telegraf');
const bot = new Telegraf(token)
const axios = require('axios');
const {
  flushall, setChatIdLoginAndPassword, getChatIDandName
} = require('./redisFuction');


process.once('SIGINT', () => {
  flushall().then()
  return bot.stop('SIGINT')

});
process.once('SIGTERM', () => {
  flushall().then()
  return bot.stop('SIGTERM')
});

bot.launch()
