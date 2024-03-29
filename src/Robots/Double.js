
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
const { DOUBLE } = require('sequelize');
const { resolveId } = require('telegram/Utils');

puppeteer.use(StealthPlugin());
// Moment timezone Sao Paulo
/*
    * O bot é deve receber apenas os valores sem 

*/

class Blaze {
    // Initial puppeter
    constructor(aposta, protectWhite, getUser, channel, game) {
        this.game = game
        this.autoremove = getUser['autoretirar'];
        this.channel = channel
        this.browser = null;
        this.result = true
        this.page = null;
        this.entryMoment = 'betting';
        this.getUser = getUser;
        this.entryTime;
        this.worked = true;
        this.entryCount;
        this.protectWhite = protectWhite;
        this.bankValue;
        this.aposta = aposta
        this.result = false
        this.stoploss
        this.postHit = getUser['posHit'] || false;
        this.winpot = 0
        this.arrayOutline = [];
        this.timeCountComprove = 0
    }


    async routine() {
        console.log(this.game);
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log(`Start Client ${this.getUser['getUser'][0].users_id} for Routine of Bot`);
        console.log(this.getUser['getUser'])
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log('-------------------------------------------------------------------------------')
        console.log('Verificando as estatisticas')

        this.entryCount = this.getUser['martingale'] === 0 ? '1' : this.getUser['martingale'];
        console.log(this.entryCount, 'Numeros de Jogadas', Object.values(this.getUser));


        await this.init().then(async (el) => {
            await this.login(this.getUser['getUser'][0].username_, this.getUser['getUser'][0].password_);
            console.log(`Waiting next Entry ${this.getUser['getUser'][0]}`);
            console.log('-----------------------------------');
            console.log(`Executando', ${this.entryCount}`)


            const caseGame = {
                'Double': async () => {
                    await this.page.goto('https://blaze.com/en/games/double');
                },
                'Crash': async () => {
                    await this.page.goto('https://blaze.com/en/games/crash');
                    await this.page.waitForTimeout(8000)
                }
            }

            await caseGame[this.game]()
            await this.waitingForNextEntry()

        })
    }

    async waitingForNextEntry() {
        const waitingObjectCase = {
            'Double': () => {
                console.log('Iniciando o Observador de Resultado');
                const PrimeiraRodada = Math.round(Date.now().valueOf() / 1000)
                let firstResult = true;
                const interval = setInterval(async () => {
                    const timer = Math.round(Date.now().valueOf() / 1000) - PrimeiraRodada;
                    const element = await this.page.evaluate(() => {
                        const element = document.querySelectorAll('.time-left > b')[0]?.innerText;
                        return element ? element : null;
                    })
                    console.log(this)
                    if (element && firstResult) {
                        this.arrayOutline.push(element.replace(/!/g, ''))
                        console.log(this.arrayOutline);
                        firstResult = false
                        const win = await this.comproveWin()
                        if (win && this.entryCount > 0 && !this.entryMoment) {
                            console.log(win, 'win');
                            clearInterval(interval);
                            this.page.close()
                            this.entryCount -= 1;
                            await insertRegisterAction(game, valor, bankValue, win, time);
                            await setUserOnline(`${this.getUser['getUser'][0].users_id}`, userQueue)
                        } else {
                            await insertRegisterAction(game, valor, bankValue, win, time);
                            await setUserOnline(`${this.getUser['getUser'][0].users_id}`, userQueue)

                            console.log(win, 'loss');
                            if (postHit) {
                                this.Entry();
                            }
                            
                            console.log('All the start comprove')
                            this.timeCountComprove += 1;
                            this.entryCount -= 1;
                            this.entryMoment = true;
                        }
                    }

                    const elementForPlay = await this.page.evaluate(() => {
                        let element = 0;
                        element = document.querySelectorAll('.time-left')[0]?.innerText.match(/Rolling In/g)
                        return element
                    })

                    this.playTime = elementForPlay != null ? elementForPlay[0] : 'null'
                    if (this.playTime === 'Rolling In' && this.entryMoment) {
                        console.log('Entrando');
                        this.entryMoment = false
                        firstResult = true;
                        if (!this.postHit) {
                            this.Entry()
                        }
                        return
                    }
                }, 1000)
            },
            'Crash': async () => {

                console.log('Aguardando o Próximo Crash', this.entryCount, this.autoretirar < this.arrayOutline[this.timeCountComprove]);

                let element = await this.page.evaluate(() => {
                    return document.querySelectorAll('.entries')[0].querySelector('span').innerText
                })


                const interval = setInterval(async () => {
                    let newElement = await this.page.evaluate(() => {
                        return document.querySelectorAll('.entries')[0].querySelector('span').innerText
                    })
                    // A cada 1 segundo ele confere se o resultando anterios foi diferente.
                    // Sendo diferente ele envia este resultado para um array;
                    // Quando feito um entrada ele marca oo this.entryMoment
                    // Caso seja win:



                    if (element != newElement) {
                        this.arrayOutline.push(newElement.replace('X', ''));

                        if (this.entryMoment === 'STOP') {
                            clearInterval(interval)
                            await this.page.close();
                            await this.browser.close()
                        }


                        if (this.entryMoment == 'betting' && this.arrayOutline.length > 0) {
                            this.Entry();
                            this.entryMoment = 'playing';
                        }


                        if (this.entryMoment == 'playing') {
                            const win = await this.comproveWin()
                            const caseWinCrash = {
                                'Win': () => {
                                    if (this.getUser['doublewin']) {
                                        this.entryCount == 0 ? this.entryCount + 1 : this.entryCount;
                                        this.entryMoment = 'betting';
                                        return
                                    }
                                    this.entryMoment = "STOP";
                                    return setTimeout(() => {
                                        clearInterval(interval);
                                        this.page.close();
                                        this.browser.close();
                                    }, 2000)
                                },
                                'Loss': () => {
                                    if (this.entryCount > 0) {
                                        this.entryMoment = 'betting';
                                    }
                                    this.timeCountComprove += 1;
                                    this.entryCount = -1;
                                    return
                                }
                            }
                            element = newElement
                            return caseWinCrash[win]()
                        }
                    }
                }, 1000);
            }
        }
        return waitingObjectCase[this.game]()
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
            await this.page.waitForTimeout(8000)

            let bankValue = await this.page.evaluate(() => {
                const amout = document.querySelectorAll('.amount')[0].innerText
                console.log(amout);
                return amout
            })

            console.log(bankValue)

            this.bankValue = bankValue.match(/([0-9][0-9].[0-9]*)\w/g);
            this.getUser['bankValue'] = this.bankValue[0]
            console.log(this.getUser, 'newGetUser')

            if (this.getUser['bankValue'] > this.getUser['valor']) {
                return true
            }
        } catch (error) {
            console.log('Erro', error)
        }
    }

    async Entry() {
        const EntryCase = {
            'Double': async () => {
                console.log('Entry in this')
                let input = await this.page.$$('input');
                let buttons = await this.page.$$('button');
                await input[0].type(`${this.getUser['valor']}`);
                this.page.waitForTimeout(9000);
                console.log('Entry is Shit');
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
                    // await buttons[7].click();

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
            },
            'Crash': async () => {
                console.log('Just Entry in Crash')
                await this.page.waitForTimeout(1200);
                // Start This Round
                const inputs = await this.page.$$('input')
                console.log('Entry')

                console.log(this.getUser['autoretirar'])


                inputs[0].type(`${this.getUser['valor']}`);
                await this.page.waitForTimeout(300);
                inputs[1].type(`${this.getUser['autoretirar']}`);
                const button = await this.page.$$('button')

                // button[7].click();
            }
        }

        return await EntryCase[this.game]()
    }

    async comproveWin() {
        // await this.getLastResult();
        const comproveWinGame = {
            "Double": () => {
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
                const arrayPosition = this.timeCountComprove;
                return caseColor[`${this.aposta}`](this.arrayOutline[arrayPosition])

            },
            "Crash": () => {
                console.log(this.arrayOutline[this.timeCountComprove], 'result')

                console.log(this.arrayOutline[this.timeCountComprove])
                console.log(this.arrayOutline[this.timeCountComprove] >= this.getUser['autoretirar']);

                if (this.arrayOutline[this.timeCountComprove] >= this.getUser['autoretirar']) {
                    return 'Win';
                } else {
                    return "Loss";
                }
            }
        }

        return comproveWinGame[this.game]();
    }


    async getLastResult() {
        console.log('Pegando o resultado')
        const result = await this.page.evaluate((el => {
            return document.querySelectorAll('.entry')[0].innerText;
        }));
        let date = Date.now().valueOf()
        console.log(date, result);
        this.arrayOutline.push(result)
        return this.arrayOutline;
    }
}

module.exports = Blaze;
