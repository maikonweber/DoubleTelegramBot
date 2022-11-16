
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require("puppeteer-extra");
const {
    getOnline, setUserOnline, getSenderInformationToken
} = require('../../redisFuction');

const {
    getToken
} = require('../../database');

const {
    sendNotificationMessage
} = require('../../telegramBot');

puppeteer.use(StealthPlugin());
// Moment timezone Sao Paulo
/*
    * O bot é deve receber apenas os valores sem 

*/

class Blaze {
    // Initial puppeter
    constructor(aposta, protectWhite, getUser) {
        this.browser = null;
        this.page = null;
        this.entryMoment = true;
        this.getUser = getUser;
        this.entryTime;
        this.worked = true;
        this.entryCount = 1;
        this.protectWhite = protectWhite;
        this.bankValue;
        this.aposta = aposta
        this.martigale;
        this.sorogale;
        this.winstop;
        this.user;
        this.win = 'waiting';
        this.stoploss;
    }


    async routine() {
        console.log('Routine of Bot');

        // Get All Information And Update then;
        // Set State and Execute;
        console.log(this.aposta, this.getUser)
        const user = await getOnline(this.getUser.users_id);
        await this.init().then(async (el) => {
            const result = await this.login(this.getUser['getUser'][0].username_, this.getUser['getUser'][0].password_);
            console.log('Initialize a routine!!!')
            if (result) {
                if(this.Entry) {    
                console.log('Waiting next Entry');
                await this.waitingForNextEntry()
                } else {
                console.log('No Have Bank to Play');
                }
            }
        })
    }

    async updateUsersId(user_id, string) {
        console.log(this.user);
        const caseObject = {
            "Loss": async () => {
                this.user = this.stoploss - 1;
                console.log('Usuário', user_id, 'Teve uma partida perdida')
                await setUserOnline(user_id, this.getUser);
            },
            'Win': async () => {
                if (this.sorogale != 0) {
                    this.user_id.valor = this.sorogale != 0? this.sorogale * winpot / 100 :  this.user_id.valor;
                }
                console.log('Usuário', user_id, 'Teve uma partida ganha')
                await setUserOnline(user_id, this.getUser);
            }
        }


        return await caseObject[string]()
    }


    async sendWorkedTag() {
        console.log(`Entry in', ${this.aposta}, ${this.protectWhite}`, this.getUser['valor']);
        const result = await this.Entry()
        if (result) {
            console.log('You Win This Round');
            await this.updateUsersId(this.getUser.users_id, 'Win');
            await this.sendNotifcation(this.getUser.users_id, 'win')
            this.page.waitForTimeout(2000);
            this.browser.close()
        } else {
            console.log('You lose This Round')
            this.updateUsersId(this.getUser.users_id, 'Loss');
            await this.sendNotifcation(this.getUser.users_id, 'loss')
        }
    }

    async resultPrint(result) {
        const caseObjectString = {
            'red': () => {
                return this.valor * 2;
            },
            'black': () => {
                return this.valor * 2;
            },
            'white': () => {
                return this.valor * 14;
            }
        }

        return caseObjectString(result);
    }

    async sendNotifcation(users_id, sendTag) {
        const token = await getToken(users_id);
        let objSender = await getSenderInformationToken(token)
        objSender = JSON.parse(objSender);
        console.log(objSender, token);

        const sendString = {
            "bet": () => {
                return `Uma Aposta foi feita no valor ${this.valor} , Na aposta ${this.aposta}, 
                 Com Proteção no Branco ${this.protectWhite}
                `},
            "win": (result) => {
                return `Vocẽ apostou: ${this.valor}, no ${this.aposta}, com Proteção White ${this.protectWhite}
                    Resultado : ${this.lastResult}, 
                    ${this.resultPrint(this.lastResult)}`
            },
            "loss": (result) => {
                return `Vocẽ apostou: ${this.valor}, no ${this.aposta}, com Proteção White ${this.protectWhite}
                    Resultado : ${this.lastResult}, 
                    ${this.resultPrint(this.lastResult)} `
            }
        }
        return await sendNotificationMessage(objSender.id, sendString[sendTag])
    }


    async waitingForNextEntry() {
        if (this.entryCount > 0) {
            this.entryCount = this.getUser['martingale'] === 0 ? '1' : this.getUser['martingale'];
            const interval = setInterval(async () => {
                const element = await this.page.evaluate(() => {
                    return document.querySelectorAll('.progress-bar')[0].innerText;
                })
                console.log(this.entryCount);
                let split = element.split(' ');
                split = split[2].split(':');
                this.entryTime = split[0] > 0 ? true : false;
                console.log(this.entryTime);
                if (this.entryTime) {
                    if (this.entryCount >= 1 && this.entryMoment) {
                        this.entryMoment = false
                        await this.sendWorkedTag()
                    }
                }
            }, 5000);
        }
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
        await this.page.setDefaultNavigationTimeout(300000)
    }   

    async login(username, password) {
        const offset = {x: 213 + 5, y: 11 + 5};
        await this.page.goto('https://blaze.com/pt/?modal=auth&tab=login', { waitUtil : 'networkidle0'});
        await this.page.mouse.click(1 + offset.x, 2 + offset.y);
        let input = await this.page.$$('input')
        await this.page.waitForTimeout(500)
        console.log(username, password);
        console.log(input[0], '\n', input[1], "input");
        try {
            // Send Key to input
            await input[1].type(username)
            await input[2].type(password)
            await this.page.waitForTimeout(5000)
            const buttons = await this.page.$('.input-footer')
            const nesw = await buttons.$('button')
            await nesw.click()
            await this.page.waitForTimeout(5000)
            let bankValue = await this.page.evaluate(() => {
                const amout = document.querySelectorAll('.amount')[0].innerText
                console.log(amout);
                return amout
            })
            console.log(bankValue)
            this.bankValue = bankValue.match(/([0-9][0-9].[0-9]*)\w/g);
            this.getUser['bankValue'] = this.bankValue[0]
            console.log(this.getUser, 'newGetUser')
            await this.page.waitForTimeout(8000)
            await this.page.goto('https://blaze.com/en/games/double');
            if (this.getUser['bankValue'] > this.getUser['valor']) {
                return true
            }
        } catch (error) {
            console.log('Erro', error)
        }
    }

    async Entry() {
        console.log('Entry in this')
        let input = await this.page.$$('input');
        let buttons = await this.page.$$('button');
        await input[0].type(`${this.getUser['valor']}`);
        this.page.waitForTimeout(9000);
        // await this.page.waitForTimeout(50)
        console.log('Entry this Shit', this.getUser['valor']);
        try {
            await this.page.waitForTimeout(500);
            if (this.aposta === 'white') {
                await this.page.evaluate((el => {
                    return document.querySelectorAll('.input-wrapper')[0].querySelectorAll('div')[3].click()
                }))
            } else if (this.aposta === 'red') {
                await this.page.evaluate((el => {
                    document.querySelectorAll('.input-wrapper')[0].querySelectorAll('div')[1].click()
                }))
            } else {
                await this.page.evaluate((el => {
                    document.querySelectorAll('.input-wrapper')[0].querySelectorAll('div')[4].click()
                }))

            }
            await this.page.waitForTimeout(500);
            await buttons[7].click();

            if (this.protectWhite) {
                await this.page.waitForTimeout(500);
                await this.page.evaluate((el => {
                    return document.querySelectorAll('.input-wrapper')[0].querySelectorAll('div')[3].click()
                }))
                await this.page.waitForTimeout(500);
                await buttons[7].click();
            }

            this.entryCount - 1;
            if(this.entryCount >= 1) {
                this.entryMoment = true
            }

            await this.sendNotifcation(this.getUser.users_id, 'bet');
       
            
            return await this.getLastResult()
        } catch (e) {
            console.log(e);
        }
    }

    async getLastResult() {
        this.lastResult = await this.page.evaluate((el => {
            return document.querySelectorAll('.entry')[0].innerText;
        }))
        console.log(this.lastResult);
        
        const caseColor = {
            'red': async (result) => {
                return ['1', '2', '3', '4', '5', '6', '7'].includes(result);
            },
            'black': async (result) => {
                return [''].includes(result);
            },
            'white': async (result) => {
                return ['8', '9', '10', '11', '12', '13', '14'].includes(result);
            }
        }
        console.log(caseColor[`${this.aposta}`](this.lastResult));
        return await caseColor[`${this.aposta}`](this.lastResult);
    }
}
module.exports = Blaze;
