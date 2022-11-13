
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require("puppeteer-extra");
puppeteer.use(StealthPlugin());
// Moment timezone Sao Paulo
const moment = require('moment-timezone');
const { max } = require('moment-timezone');
/*
    * O bot é deve receber apenas os valores sem 

*/

class Blaze {
    // Initial puppeter
    constructor (getUsers, sygnal, martingale, sorogales, stopwin, maxloss, protectWhite) {
        this.browser = null;
        this.page = null;
        this.username = getUsers.password;
        this.password = getUsers.password;
        this.sygnal = sygnal;
        this.martingale = martingale;
        this.sorogale = stopwin;
        this.maxloss = maxloss;
        this.protectWhite = protectWhite; 
    }


async init() {

    this.browser = await puppeteer.launch({
        // executablePath: '/usr/bin/google-chrome',
        headless: false,
        ignoreHTTPSErrors: true,
        // Set Proxy for IP address BRAZIL
        args: [
            //'--proxy-server=187.60.166.58:8080',
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
    await this.page.goto('https://blaze.com/pt/games/double');
    await this.page.waitForTimeout(7000)
    let a = await this.page.$$('a')
        console.log(a[1], '\n', a[0], "logging in")
        await this.page.goto('https://blaze.com/pt/?modal=auth&tab=login');
        await this.page.waitForTimeout(7000)
        let body = await this.page.$$('body')
        // get body text
        let text = await body[0].getProperty('innerText')
        // get body text
        let text2 = await text.jsonValue()
        console.log(text2)
        let input =  await this.page.$$('input')
        await this.page.waitForTimeout(7000)
        console.log(input[0], '\n', input[1], "input");
        
        try {
            // Send Key to input
            await this.page.waitForTimeout(7000)
            await input[1].type(this.username)
            await input[2].type(this.password)
            await this.page.waitForTimeout(7000)
            await this.page.keyboard.press('Enter')
            await this.page.waitForTimeout(7000)
            await this.page.goto('https://blaze.com/pt/games/double');
            this.page.reload()
        } catch (error) {
            console.log('Erro', error)
        }
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

 

}



module.exports = Blaze;
