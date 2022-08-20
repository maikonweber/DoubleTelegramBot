
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require("puppeteer-extra");
puppeteer.use(StealthPlugin());
// Moment timezone Sao Paulo
const moment = require('moment-timezone');
const redis = require('ioredis')
const client = new redis();
const MQ = require('../../mq');

class Crash {
    // Initial puppeter
    constructor (username, password, worktime, martingalePercent, sorogalePercent, maxlossPercent, valor) {
        this.browser = null;
        this.page = null;
        this.initialPlayerValues = valor;
        this.username = username;
        this.password = password;
        this.bankValue = 0;
        this.totalValues = 0;
        this.worktime = worktime;
        this.sorogale = 0;
        this.martingale = 0;
        this.maxloss = 0;
        this.lastRetriver = 0;
        this.lastLogging = 0;
        this.valor = valor;
        this.waitingResult = false;
        this.webSocket;
        this.clientRabbit;
        this.martingalePercent = martingalePercent;
        this.sorogalePercent = sorogalePercent;
        this.maxlossPercent = maxlossPercent;
        this.trueRelation = true;
        this.scheduled;
        // this.horario = horario;
        // this.valor = valor;
        // this.autoretirar = autoretirar;    
    }



async init() {
    console.log('Initilizing Crash Bot')
    this.browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        // Set Proxy for IP address BRAZIL
        args: [
            //'--proxy-server=187.60.166.58:8080',
            '--use-gl=egl',
            '--no-sandbox',
            '--single-process',
            '--window-size=920,850'
        ],
        defaultViewport: {
            width: 920,
            height: 850
        }
    });

    this.page = await this.browser.newPage();
    await this.page.goto('https://blaze.com/pt/games/crash');
    await this.page.waitForTimeout(8000)
    await this.page.goto('https://blaze.com/pt/?modal=auth&tab=login');
    console.log('Try Logging in')
    await this.page.waitForTimeout(3000)
    let body = await this.page.$$('body')
    // get body text
    let text = await body[0].getProperty('innerText')
    // Get input wrappers
    
    let input =  await this.page.$$('input')
    await this.page.waitForTimeout(3000)
    await input[1].type(this.username)
    await input[2].type(this.password)
    await this.page.waitForTimeout(3000)
    let button = await this.page.$$('button')
    console.log(button)

    await this.page.keyboard.press('Enter')
    await this.page.waitForTimeout(3000)
    await this.page.goto('https://blaze.com/pt/games/crash');
    await this.page.waitForTimeout(800)
    const thos = await this.page.waitForSelector('.amount')
    const jsonText = await thos.getProperty('innerText')
    const bankValuesText = await jsonText.jsonValue()
    this.bankValue = bankValuesText
    console.log(this.bankValue)
    await this.updateCurrent()
    // await this.page.waitForTimeout(7000)
        // let body = await this.page.$$('body')
        // // get body text yes
        // console.log(body)
        // let text = await body[0].getProperty('innerText')
        // // get body text
        // let text2 = await text.jsonValue()
        // console.log(text2)

        // await this.page.waitForTimeout(7000)
        // try {
        //     // Send Key to input
        //     await this.page.waitForTimeout(7000)
        //     await input[1].type(this.username)
        //     await input[2].type(this.password)
        //     await this.page.waitForTimeout(7000)
        //     await this.page.keyboard.press('Enter')
        //     await this.page.waitForTimeout(7000)
        //     await this.page.goto('https://blaze.com/pt/games/crash');
        //     this.page.reload()
        //     await client.set(`${this.username}_`, `{
        //         "lastLogging" : ${lastLogin},
        //         "totalValues" : ${this.totalValues},
        //         "worktime" : ${this.worktime}
        //         "bankValue" : ${this.totalValues * this.bankPorcent / 100},
        //         "sorogale" : ${0},
        //         "martingale" : ${0},
        //         "maxloss" : ${(this.totalValues * this.bankPorcent / 100) * this.lossPercent / 100 } 
        //         "lastRetriver" ; ${lastRetrive}   
        //     }`)
        // } catch (error) {
        //     console.log('Erro', error)
        // }
}


async Entry() {
    try {
    let inputGame = await this.page.$$('input')
    await inputGame[0].type(this.valor)
    await inputGame[1].type(this.autoretirar)
    await this.page.waitForTimeout(7000)
    let button = await this.page.$$('button')
    console.log(button)
    await button[6].click()
    await this.page.waitForTimeout(7000)
    console.log('Aposta Feita')
    await this.page.waitForTimeout(7000)
    if (this.horario.length === 0) {
        this.browser.close()
    }
    } catch (error) {
        console.log('Erro', error)
    }
}

 async updateCurrent() {
    const elementEntries = await this.page.$$('.entries')
    const jsonText = await elementEntries[0].getProperty('innerText')
    const entriesText = await jsonText.jsonValue()
    const entries = entriesText.split('/n')
    const current = entries[0]
    this.current = current
    
    setInterval(async () => {
    const elementEntries = await this.page.$$('.entries')
    const jsonText = await elementEntries[0].getProperty('innerText')
    const entriesText = await    jsonText.jsonValue()
    const entries = entriesText.split('/n')
    const trueRelation = this.current == entries[0]
    this.trueRelation = trueRelation
    console.log(this.trueRelation)    
    if (this.trueRelation) {
        console.log('Wait Crash')
    } else {
        console.log('Crash')
        this.getEntry()
    }


    this.current = this.current === entries[0] ? this.current : entries[0]
    

    },  3000)
 }
 async getKeyboard() {
    const keyboard = {}
    const input = await this.page.$$('input')
    keyboard.quantia = input[0]
    keyboard.autoretirar = input[1]
    const button = await this.page.$$('button')
    keyboard.send = button[6]
    keyboard.halft = button[5]
    keyboard.double = button[4]
    return keyboard
 }

 async schedule(msg) {
    let msg1 = JSON.parse(msg)
    this.scheduled = msg1
 }

 async getEntry() {
    console.log('Get Entry')
    setTimeout(async () => {
    if(this.schedule) {
    const keyboard = await this.getKeyboard()
    await keyboard['quantia'].type(this.schedule.valor)
    await keyboard['autoretirar'].type(this.schedule.retirar)
    await keyboard['send'].click()

    }
}, 4000)

}
}


module.exports = Crash;
