const double = require('./Double');


const getUsers = {
  username: "igorchagasrko@gmail.com",
  password: "Para123#"
}
const martigale = 4;
const sorogale = 20;
const winloss = 5;
const stoploss = 5;
const valor = '5';
const sygnal = "black";
const protectWhite = true;

const Robot = new double(getUsers, sygnal, martigale, sorogale, winloss, stoploss, protectWhite, valor);

Promise.all([
  Robot.routine()
]).then();


