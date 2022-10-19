const { Scenes } = require('telegraf')
const contactDataWizard = new Scenes.WizardScene(
            'start', (ctx) => {
                        console.log('Start this ')
                        ctx.reply('Qual jogo você quer Jogar');
                        ctx.wizard.state.contactData = {}
                        return ctx.wizard.next();
            },
            (ctx) => {
                        if (ctx.message.text.length < 2) {
                                    ctx.reply('Por Favor Digite um Email');
                                    return
                        }
                        ctx.wizard.state.contactData.fil = ctx.message.text;
                        ctx.reply('Digite sua Senha');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        ctx.wizard.contactData.password = ctx.message.text;
                        ctx.reply('Set Martingale Number');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        ctx.wizard.state.contactData.martigale = ctx.message.text;
                        ctx.reply('Set Sorogale Porcent');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        ctx.wizard.state.contactData.sorogale = ctx.message.text;
                        ctx.reply('Set Sorogale Porcent');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        ctx.wizard.state.contactData.worktime = ctx.message.text;
                        ctx.reply('Set Valor das Entradas');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        ctx.wizard.state.contactData.valor = ctx.message.text;
                        ctx.reply('Set maxloss das Entradas');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        ctx.wizard.state.contactData.maxloss = ctx.message.text;
                        ctx.reply('Set winstop das Entradas');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        ctx.wizard.state.contactData.winstop = ctx.message.text;
                        ctx.reply('Deseja iniciar a entradas');
                        return ctx.wizard.next();
            },
            async (ctx) => {
                        const body = {}
                        body.username = ctx.wizard.contactData.fio
                        body.password = ctx.wizard.contactData.password
                        body.martigale = ctx.wizard.contactData.martigale
                        body.sorogale = ctx.wizard.contactData.sorogale
                        body.maxloss = ctx.wizard.contactData.valor
                        body.winstop = ctx.wizard.contactData.maxloss
                        body.valor = ctx.wizard.contactData.winstop
                        ctx.wizard.contactData.valor = ctx.message.text;
                        await axios.post('http://localhost:3053/crash', body);
                        ctx.reply('Seu Bot foi Configurado');
                        return ctx.scene.leave();
            }
)

module.exports = contactDataWizard;