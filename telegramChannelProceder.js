const { TelegramClient, Api } = require('telegram');
const { StringSession } = require("telegram/sessions");
const apiId = 17228434;
const apiHash = 'b05e1c84ad4dd7c77e9965204c016a36';
const input = require("input");
const fs = require('fs')
const stringSession = new StringSession('1AQAOMTQ5LjE1NC4xNzUuNjABu1Y7z7qsOWICbnp873p7swl/Eii6shpSApYBORgY1hyJvoMowVPjYRo2joQJydCLNAXIjEO/NCn6I/r09T979pfGKJ9wMZJ+S3B2IuA0mrJ8+o7q3o9ZBYjqD5zVpV6RipXM5OHYOS318kKOtcnY0TEOECcDydlOpMVRWTxffcby4eyjkT587ueXKpiU/pLv7cFzV5YzB2bCEQjtNtOfTftQBKqy0r+PeWuwrtbEEW4BTWexahu6hrqNmJ+FG/+KED+G8RARh31uB8BP5OxYfoOX7TPiCcbzON8pUvNBt6i5y8oackD097deRvkbc3XqRi6dit9sDPPdsp9Y+VC8oaU=');


(async () => {

            const client = new TelegramClient(stringSession, apiId, apiHash, {
                        connectionRetries: 5,
            });

            const blazeExp = new RegExp('blaze')

            await client.start({
                        phoneNumber: async () => await input.text("Please enter your number: "),
                        password: async () => await input.text("Please enter your password: "),
                        phoneCode: async () =>
                                    await input.text("Please enter the code you received: "),
                        onError: (err) => console.log(err),
            });

           console.log(client.session.save());

           const channel = '-1752577841'           

           const resultado = await client.invoke(new Api.messages.GetMessages({channel, id: [43]}))
           console.log(resultado.messages[0].message); 
           // console.log(resultado);
})();


