
 // https://github.com/SerjoPepper/bot-brother
// npm install bot-brother
// Criando o Bot do Telegram - Utilizando a Biblioteca - 
// bot_brother ->
const token = '5189315995:AAF7Ei5ozq6kHLSZTWHS_Xjy0ku-u-cxmfc';

var bb = require('bot-brother');
var bot = bb({
  key: token,
  sessionManager: bb.sessionManager.memory(),
  polling: { interval: 0, timeout: 1 }
});


// replace the value below with the Telegram token you receive from @BotFather

// Create a bot that uses 'polling' to fetch new updates
bot.command('start')
.invoke(function (ctx) {
  // Setting data, data is used in text message templates.
  ctx.data.user = ctx.meta.user;
  // Invoke callback must return promise.
  return ctx.sendMessage('Hello <%=user.first_name%>. How are you?');
})


// comente 
.answer(function (ctx) {
    ctx.data.answer = ctx.answer;
    // Returns promise.
    return ctx.sendMessage('OK. I understood. You feel <%=answer%>');
  });
  
  // Creating command '/upload_photo'.
  bot.command('upload_photo')
  .invoke(function (ctx) {
    return ctx.sendMessage('Drop me a photo, please');
  })
  .answer(function (ctx) {
    // ctx.message is an object that represents Message.
    // See https://core.telegram.org/bots/api#message 
    return ctx.sendPhoto(ctx.message.photo[0].file_id, {caption: 'I got your photo!'});
  });