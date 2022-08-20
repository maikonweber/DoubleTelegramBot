module.exports = {
  apps : [{
    script: './server.js',
    watch: '.'
  }, {
    script: './telegramBot.js',
    watch: ['.']
  }],
};
