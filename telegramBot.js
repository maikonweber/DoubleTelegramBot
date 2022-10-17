const telegram = require('node-telegram-bot-api');
console.log(telegram)
const axios = require('axios');
const token = '5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc'
const {
    setUserAndPreference,
    UnsetUser,
    setChatIdLoginAndPassword
} = require('./redisFuction')
 /* Polling mantem a conexão com )HTTP  */
const bot = new telegram(token, {
    polling: true
});

bot.on('message', ({ from, chat }) => {
    setChatIdLoginAndPassword()
    bot.sendMessage(from.id, 'Ola');
})
