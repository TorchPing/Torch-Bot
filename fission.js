const bot = require('./index')()

console.log(bot)
bot.then(res => {
    res.startPolling ()
})

module.exports = async function(context) {
    const tmp = context.request.body; // get data passed to us
    const b = await bot
    b.handleUpdate(tmp); // make Telegraf process that data

    return {
        status: 200,
        body: ""
    }
};