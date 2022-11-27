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
const sygnal = "red";
const protectWhite = false;
const autoretira = '1.20';

const element = {
    "getUser" : getUsers,
    "martingale" : martigale,
    "sorogales" : sorogale,
    "valor" : valor,
    "winloss" : winloss,
    "stoploss" : stoploss,
    "autoretirar" : autoretira,
    "posHit" : false,
    "ciclos" : false

    }

    console.log(element);

const Robot = new double(sygnal, protectWhite, element, 'teste', 'Double');


Promise.all([
  Robot.routine()
]).then();




