const Redis =  require('ioredis');
const redis = new Redis();

function setUserAndPreference({user, martingale, sorogales, list, channel, game, valor}){  
    return redis.set(`${user}`, {
            martingale, sorogales, list, channel, game, valor
    })
}

function UnsetUser({user, martingale, sorogales, list, channel, game}){  
            return redis.del(`${user}`);
}


function setChatIdLoginAndPassword(first_name, last_name, chatid, login, password) {
    return redis.set(`${chatid}_${last_name}_${first_name}`, { login : login, password : password,})
}


module.exports = {
    setChatIdLoginAndPassword,
    setUserAndPreference,
    UnsetUser,
}