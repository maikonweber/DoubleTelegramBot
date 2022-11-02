module.exports = {
  apps : [{
    script: 'telegramBot.js',
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
