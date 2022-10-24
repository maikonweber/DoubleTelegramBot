module.exports = {
  apps : [{
    script: 'telegramBot.js',
    watch: '.'
  }, {
    script: 'telegramWithExpress.js',
    watch: ['.']
  }],
};
