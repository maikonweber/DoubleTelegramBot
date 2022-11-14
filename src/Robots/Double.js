
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require("puppeteer-extra");
puppeteer.use(StealthPlugin());
// Moment timezone Sao Paulo
/*
    * O bot é deve receber apenas os valores sem 

*/

class Blaze {
    // Initial puppeter
    constructor(getUsers, martingale, valor ,sorogales, stopwin, maxloss, protectWhite) {
        this.browser = null;
        this.page = null;
        this.username = getUsers.username_;
        this.password = getUsers.password_;
        this.sygnal = sygnal;
        this.martingale = martingale;
        this.sorogale = stopwin;
        this.maxloss = maxloss;
        this.sorogale = sorogales
        this.protectWhite = protectWhite;
        this.entryTime;
        this.worked = true;
        this.entryCount = 0;
        this.controller;
        this.bankValue;
        this.valor = valor;
    }

    async routine() {
        this.init().then(
            async () => {
                await this.waitingForNextEntry();
            }
        )
    }

    async sendWorkedTag() {
        console.log('Let try this Shit');
        if(this.worked){
            console.log('Worked');
            this.worked = false;
            const result = await this.Entry()
        }
    }

    async waitingForNextEntry() {
        setInterval(async () => {
            const element = await this.page.evaluate(() => {
                return document.querySelectorAll('.progress-bar')[0].innerText;
            })
            let split = element.split(' ');
            split = split[2].split(':');
            this.entryTime = split[0] > 0 ? true : false;
            if (this.entryTime) { this.sendWorkedTag() }
        }, 5000);
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
        await this.page.goto('https://blaze.com/pt/?modal=auth&tab=login');
        let input = await this.page.$$('input')
         await this.page.waitForTimeout(500)
         console.log(input[0], '\n', input[1], "input");
        try {
            // Send Key to input
            await this.page.waitForTimeout(2000)
            console.log(this.username, this.password);
            await input[1].type(this.username)
            await input[2].type(this.password)
            await this.page.waitForTimeout(5000)
            const buttons = await this.page.$('.input-footer')
            const nesw = await buttons.$('button')
            await nesw.click()
            await this.page.waitForTimeout(8000);
            let bankValue = await this.page.evaluate(() => {
                const amout = document.querySelectorAll('.amount')[0].innerText
                console.log(amout);
            return amout
            })
            console.log(bankValue)

            this.bankValue = bankValue.replace(/R$/, '');
            // const bank = await (await element.getProperty('TextContent')).jsonValue()
            // console.log(bank);
             await this.page.goto('https://blaze.com/en/games/double');
             await this.page.waitForTimeout(8000);
        } catch (error) {
            console.log('Erro', error)
        }
    }

    async Entry() {
            let input = await this.page.$$('input');
            let buttons = await this.page.$$('button');
            let getElementBlack  = await this.page.$('.black.selected')
            let getElementWhite= await this.page.$('.white');
            let getElementRed = await this.page.$('.red');
            console.log(getElementBlack);
            console.log(getElementRed);
            console.log(getElementWhite);
            // await this.page.waitForTimeout(50)
            console.log('Entry this Shit');
        try {
            if(this.sygnal === 'white') {
                await getElementWhite.click();
            } else if (this.sygnal === 'red') {
                await getElementRed.click();
            } else {
                await getElementBlack.click();
            }               
            await input[0].type(this.valor);
            await buttons[5].click();
            return 'Do it';
        } catch (error) {
            console.log('Erro', error)
        }
    }

    // async waitingGame() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             console.log('Clear Next Round')
    //             resolve(this.worked = true);
    //         }, 19000);
    //     })
    // }
}

module.exports = Blaze;
