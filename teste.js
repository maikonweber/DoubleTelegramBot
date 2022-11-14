const {
 getChannelQueue
} = require('./redisFuction')



const arrays = getChannelQueue('teste')

Promise.all([arrays]).then(el => console.log(el));