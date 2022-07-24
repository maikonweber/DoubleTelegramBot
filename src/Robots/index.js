const Blaze = require('./crash')
const lg = (log) => {
    console.log(log, "Console.Log ->")
}
const CrashBot = new Blaze(
    2,
    'maikonweber',
    'Ma128sio4',
    [
        '11:49',
        '12:32',
        '13:21',
        '14:45',
    ],
    '2'
)


CrashBot.getEntry()