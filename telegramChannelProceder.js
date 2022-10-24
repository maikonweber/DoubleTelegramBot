const { TelegramClient } = require('telegram');
const { StringSession } = require("telegram/sessions");
const apiId = 17228434;
const apiHash = 'b05e1c84ad4dd7c77e9965204c016a36';
const input = require("input"); 

const stringSession = new StringSession('');


(async () => {

            const client = new TelegramClient(stringSession, apiId, apiHash, {
                        connectionRetries: 5,
            });


            await client.start({
                        phoneNumber: async () => await input.text("Please enter your number: "),
                        password: async () => await input.text("Please enter your password: "),
                        phoneCode: async () =>
                                    await input.text("Please enter the code you received: "),
                        onError: (err) => console.log(err),
            });

})();


