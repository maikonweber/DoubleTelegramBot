
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require("puppeteer-extra");
puppeteer.use(StealthPlugin());
// Moment timezone Sao Paulo
const moment = require('moment-timezone');
 




class Blaze {
    // Initial puppeter
    constructor (valor, username, password, horario, autoretirar) {
        this.browser = null;
        this.page = null;
        this.username = username;
        this.password = password;
        this.horario = horario;
        this.valor = valor;
        this.autoretirar = autoretirar;
    
    }


async init() {

    this.browser = await puppeteer.launch({
        product: 'firefox',
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
            await this.page.goto('https://blaze.com/pt/games/crash');
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

 async getEntry() {
    // Moment now timezone Sao Paulo
    this.init()

    setInterval(async () => {   
    let time = moment().tz('America/Sao_Paulo');
    if (this.page != null) {
    this.horario.forEach(element => {
        if(element == time.format('HH:mm')) {
            console.log('Entre agora ')
            this.horario.splice(this.horario.indexOf(element), 1);
            this.Entry()
            return
    }

    }, 7000);

 }});
 }

 

}



module.exports = Blaze;
