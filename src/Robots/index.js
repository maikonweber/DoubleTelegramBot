const double = require('./Double');


const getUsers = [{
  username_: "igorchagasrko@gmail.com",
  password_: "Para123#",
  users_id : 1
}]

const martigale = 4;
const sorogale = 4;
const winloss = 5;
const stoploss = 5;
const valor = 1.11;
const sygnal = "black";
const protectWhite = true;

const element = {
    "getUser" : getUsers,
    "martingale" : martigale,
    "sorogales" : sorogale,
    "valor" : valor,
    "winloss" : winloss,
    "stoploss" : stoploss
  }


const Robot = new double(sygnal, protectWhite, element, 'teste', 'Crash');


Promise.all([
  Robot.routine()
]).then();




