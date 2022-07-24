const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: false});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatid = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatid, resp);
})

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  bot.setChatDescription(chatId, 'Double and Crash Bot')

})