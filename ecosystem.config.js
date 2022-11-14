module.exports = {
  apps : [{
    script: 'telegramBot.js',
    watch: '.'
  }, {
    script: 'telegramWithExpress.js',
    watch: ['.']
  },
  {
    script: 'consumerReceived.js',
    watch: '.'
  },
  {
    script: 'telegramBotObserver.js',
    watch: ['.']
  }
],

};
