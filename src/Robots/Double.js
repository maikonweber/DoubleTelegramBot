
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const puppeteer = require("puppeteer-extra");
const {
    getOnline, setUserOnline, getSenderInformationToken, getChannelQueue, deleteUsersIdQueue, setUserToQueue
} = require('../../redisFuction');


// async resultPrint(result) {
//     const caseObjectString = {
//         'red': () => {
//             return this.valor * 2;
//         },
//         'black': () => {
//             return this.valor * 2;
//         },
//         'white': () => {
//             return this.valor * 14;
//         }
//     }
//     return caseObjectString(result);
// }


// async sendNotifcation(users_id, sendTag) {
//     const token = await getToken(users_id);
//     let objSender = await getSenderInformationToken(token);
//     objSender = JSON.parse(objSender);
//     console.log(objSender, token, "");
//     const sendString = {
//         "bet": () => {
//             return `Uma Aposta foi feita no valor ${this.valor} , Na aposta ${this.aposta}, 
//              Com Proteção no Branco ${this.protectWhite}
//             `},
//         "win": (result) => {
//             return `Vocẽ apostou: ${this.valor}, no ${this.aposta}, com Proteção White ${this.protectWhite}
//                 Resultado : ${this.lastResult}, 
//                 ${this.resultPrint(this.lastResult)}`
//         },
//         "loss": (result) => {
//             return `Vocẽ apostou: ${this.valor}, no ${this.aposta}, com Proteção White ${this.protectWhite}
//                 Resultado : ${this.lastResult}, 
//                 ${this.resultPrint(this.lastResult)} `
//         }
//     }

//     console.log(objSender.id, sendString[sendTag])
// }


const caseObject = {
    "Loss": async () => {
        this.getUser['stoploss'] = this.getUser['stoploss'] - 1;
        console.log('Usuário', user_id, 'Teve uma partida perdida')
        await setUserOnline(user_id, this.getUser);
    },
    'Win': async () => {
        if (this.sorogale != 0) {
            this.getUser['valor'] = this.getUser['sorosgale'] != 0 ? this.sorogale * this.winpot / 100 : this.user_id['valor'];
        }
        console.log('Usuário', user_id, 'Teve uma partida ganha')
        await setUserOnline(user_id, this.getUser);

    }
};

const {
    getToken
} = require('../../database');
const { sanitizeParseMode } = require('telegram/Utils');

puppeteer.use(StealthPlugin());
// Moment timezone Sao Paulo
/*
    * O bot é deve receber apenas os valores sem 

*/

class Blaze {
    // Initial puppeter
    constructor(aposta, protectWhite, getUser, channel) {
        this.channel = channel
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
        this.entryMoment;
        this.result;
        this.win = 'waiting';
        this.stoploss;
        this.winpot = 0
        this.arrayOutline = [];
        this.timeCountComprove = 0
    }


    async routine() {
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log(`Start Client ${this.getUser['getUser'][0].users_id} for Routine of Bot`);
        console.log(this.aposta, this.getUser['getUser'][0])
        console.log(this.getUser)
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log('Verificando as estatisticas')
        this.entryCount = this.getUser['martingale'] === 0 ? '1' : this.getUser['martingale'];
        await this.init().then(async (el) => {
            const result = await this.login(this.getUser['getUser'][0].username_, this.getUser['getUser'][0].password_);
            console.log(result, 'Login Efetuado');
            if (result) {
                console.log( `Waiting next Entry ${this.getUser['getUser'][0]}`);
                console.log('-----------------------------------');
                console.log(`Executando', ${this.entryCount}, ${this.getUser['bankValue'] - this.getUser['valor']} ` )
                await this.waitingForNextEntry()
            } else {
                console.log(`Usuário não possue ${this.getUser['getUser'][0]} Saldo removendo ele da Fila`);
                await this.browser.close();
            }
        })
    }

    async sendWorkedTag(interval) {
       
    }

    async waitingForNextEntry() {
        const interval = setInterval(async () => {
            const element = await this.page.evaluate(() => {
                return document.querySelectorAll('.progress-bar')[0].innerText;
            })

            console.log('thick entry ', this.entryCount)
            let getResult = false;
            console.log('Desejo que array', this.arrayOutline, 'esteja vazio');
            let split = element.split(' ');
            split = split[2].split(':');
            this.entryTime = split[0] > 0 ? true : false;
            console.log('O Painel está aguardando terminar a rodada');
            if(!this.entryTime) {
                console.log('Roleta está girando');
            }

            if (this.entryTime && this.entryMoment && this.entryCount >= 1) {
                console.log('È inicio da rodada')
                console.log('Marcando o primeira oportunidade');
                this.entryMoment = false
                console.log(`Entry in', ${this.aposta}, ${this.protectWhite}`, this.getUser['valor']);
                // await this.Entry();
                const p = new Promise(async (resolve, reject) => {
                    setTimeout(async () => {
                        console.log('thick', this.arrayOutline);
                        const WL = await this.comproveWin();
                        console.log(WL);
                        if (WL) {
                            console.log("Win");
                            const caseWinNumber = {
                                'white' : () => {
                                    return 14
                                }, 
                                'red' : () => {
                                    return 2
                                }, 
                                'black' : () => {
                                    return 2
                                }
                            }

                            //this.getUser['valor'] = this.winpot + this.getUser['valor'];
                            this.getUser['maxloss'] -= 1;
                            this.getUser['stopwin'] -= 1;                  
                            await deleteUsersIdQueue('teste', this.getUser['getUser'][0].users_id);
                            let arrayOfUsersInQueue = await getChannelQueue('teste');
                            arrayOfUsersInQueue = JSON.parse(arrayOfUsersInQueue);
                            arrayOfUsersInQueue.push(this.getUser);
                            await setUserToQueue('teste', arrayOfUsersInQueue);
                            this.timeCountComprove = this.timeCountComprove + 1;
                            clearInterval(interval);  
                            setTimeout(async () => {
                                await this.browser.close()
                            }, 15000)
                           
                        } else {
                            await this.getLastResult();
                            console.log("Loss");
                            this.timeCount -= 1;
                            this.timeCountComprove = this.timeCountComprove + 1;
                            this.entryMoment = true

                            console.log('Jogando Novamente');
                        }
                        resolve();
                    }, 28000)
                })

               await p
            }
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
        await this.page.setDefaultNavigationTimeout(300000)
    }

    async login(username, password) {
        const offset = { x: 213 + 5, y: 11 + 5 };
        await this.page.goto('https://blaze.com/pt/?modal=auth&tab=login', { waitUtil: 'networkidle0' });
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

            return true;

        } catch (e) {
            console.log(e);
        }
    }

    async comproveWin() {
        await this.getLastResult();

        const caseColor = {
            'red': (result) => {
                return ['1', '2', '3', '4', '5', '6', '7'].includes(result);
            },
            'white': (result) => {
                return [''].includes(result);
            },
            'black': (result) => {
                return ['8', '9', '10', '11', '12', '13', '14'].includes(result);
            }
        }

        console.log(this.arrayOutline[this.timeCountComprove], 'lastResult');
        console.log(caseColor[`${this.aposta}`](this.arrayOutline[this.timeCountComprove]), 'Resultado');
        return await caseColor[`${this.aposta}`](this.arrayOutline[this.timeCountComprove]);
    }

    async getLastResult() {
     
        const result = await this.page.evaluate((el => {
            return document.querySelectorAll('.entry')[0].innerText;
        }));
    
       return this.arrayOutline.push(result)
    }
}

module.exports = Blaze;
