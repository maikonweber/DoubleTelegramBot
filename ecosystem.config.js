module.exports = {
  apps : [{
    script: 'telegramBotObserver.js',
    watch: '.'
  }, {
    script: 'telegramWithExpress.js',
    watch: ['.']
  },
  {
    script: 'queueCrash.js',
    watch: '.'
  },
  {
    script: 'queueDouble.js',
    watch: ['.']
  }
],

};
