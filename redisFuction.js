const Redis = require('ioredis');
const redis = new Redis();

async function setUserAndPreference({ user, martingale, sorogales, list, channel, game, valor }) {
  return redis.set(`${user}`, {
    martingale, sorogales, list, channel, game, valor
  })
}


async function getChannelQueue(queue) {
  return redis.get(`${queue}`);
}

async function startChannelQueue(queue){
  const array = []
  return redis.set(`${queue}`, JSON.stringify(array));
}

async function setUserToQueue(queue, sygnal) {
  return redis.set(`${queue}`, JSON.stringify(sygnal))
}

async function UnsetUser({ user, martingale, sorogales, list, channel, game }) {
  return redis.del(`${user}`);
}


async function setChatIDandName(chatid, first_name, last_name) {
  return redis.set(`${chatid}_${last_name}_${first_name}`)
}


async function getChatIDandName(chatid, first_name, last_name) {
  console.log(`${chatid}_${last_name}_${first_name}`)
  return redis.get(`${last_name}_${first_name}_${chatid}`)
}

async function setUserIsQueue(user_id, game, martingale, sorogale, maxloss, maxwin, entryValue, channel) {
  console.log(`${user_id}_${game}`)
  return redis.set(`${user_id}_${game}`, {
    entryValue,
    martingale,
    sorogale,
    maxloss,
    maxwin,
    channel
  })
}


async function setChatIdLoginAndPassword(chatid, first_name, last_name, token) {
  console.log(`${chatid}_${last_name}_${first_name}`)
  return redis.set(`${last_name}_${first_name}_${chatid}`, JSON.stringify(token));
}

async function flushall() {
  redis.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
  });
}

async function getActiveQueue() {

}



function getSessionKey(ctx) {
  if (!ctx.from || !ctx.chat) {
    return
  }
  return `${ctx.from.id}:${ctx.chat.id}`
}


module.exports = {
  setChatIdLoginAndPassword,
  setUserAndPreference,
  UnsetUser,
  getSessionKey,
  setChatIDandName,
  getChatIDandName,
  flushall,
  setUserIsQueue,
  getChannelQueue,
  startChannelQueue,
  setUserToQueue
}