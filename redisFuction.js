const Redis =  require('ioredis');
const redis = new Redis();

async function setUserAndPreference({user, martingale, sorogales, list, channel, game, valor}){  
    return redis.set(`${user}`, {
            martingale, sorogales, list, channel, game, valor
    })
}

async function UnsetUser({user, martingale, sorogales, list, channel, game}){  
            return redis.del(`${user}`);
}


async function setChatIDandName(first_name, last_name, chatid) {
    return redis.set(`${chatid}_${last_name}_${first_name}`)
}


async function getChatIDandName(first_name, last_name, chatid) {
  return redis.get(`${chatid}_${last_name}_${first_name}`)
}


async function setChatIdLoginAndPassword(first_name, last_name, chatid, login, password) {
  const object = {}
  object.login;
  object.password;
  return redis.set(`${chatid}_${last_name}_${first_name}`, object);
}


function getSessionKey (ctx) {
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
  }