const Telegraf = require('telegraf')
const commandParts = require('telegraf-command-parts')

// Const
const botName = 'TorchPingBot'
const bot = new Telegraf(process.env.BOT_TOKEN)
//ctx.state.command
bot.use(commandParts())


const template = require('./template/index')
const req = require('./request')
const servers = require('./serverList')

const lsServer = (ctx) => {
    template.lsAll().then((res) => {
        ctx.telegram.sendMessage(ctx.message.chat.id, res, {
            reply_to_message_id: ctx.message.message_id,
            parse_mode: 'markdown'
        })
    })
}

const vaildServerRequest = (ctx, { location, port }) => {
    if (port < 0 || port > 65535) {
        ctx.telegram.sendMessage(ctx.message.chat.id, 
            `端口号错误！`, 
            {
            reply_to_message_id: ctx.message.message_id,
        })

        return false
    } else {
        return true
    }
    // Location: vaild address or ip address
}

const ping = (ctx) => {
    const args = ctx.state.command.splitArgs
    if (args.length === 3) {
        const index = parseInt(args[2])
        const server = req.selectServer(index)
        if (server) {
            const location = args[0]
            const port = parseInt(args[1])
            if (vaildServerRequest(ctx, {location, port})) {
                pingOne(ctx, {server, index, location, port})
            }
        } else {
            ctx.telegram.sendMessage(ctx.message.chat.id, 
                `所选节点不存在！`, 
                {
                reply_to_message_id: ctx.message.message_id,
            })
        }
    } else if (args.length === 2) {
        const location = args[0]
        const port = parseInt(args[1])
        if (vaildServerRequest(ctx, {location, port})) {
            pingMultiple(ctx, {location, port})
        }
    } else {
        ctx.telegram.sendMessage(ctx.message.chat.id, 
            `使用方式: /ping 地址 端口 [节点序列]`, 
            {
            reply_to_message_id: ctx.message.message_id,
        })
    }
}

const pingOne = (ctx, {server, index, location, port}) => {
    // Send PlaceHolder
    template.testOne({server, index, location, port}).then(res => {
        ctx.telegram.sendMessage(ctx.message.chat.id, res, {
            reply_to_message_id: ctx.message.message_id,
            parse_mode: 'markdown'
        }).then(tg_res => {
            // send request
            req.getResult(server, location, port).then(res => {
                const { legancy , status } = res
                template.testOne({server, index, status, legancy, location, port}).then(result => {
                    ctx.telegram.editMessageText(tg_res.chat.id, tg_res.message_id, '', result, {
                        parse_mode: 'markdown'
                    })
                })
            })
        })
    })
}

const pingMultiple = (ctx, {location, port}) => {
     // Send PlaceHolder
     template.testMultiple({ servers, location, port }).then(res => {
        ctx.telegram.sendMessage(ctx.message.chat.id, res, {
            reply_to_message_id: ctx.message.message_id,
            parse_mode: 'markdown'
        }).then(tg_res => {
            // send requests
            let serverRes = servers
            serverRes.forEach((e, i) => {
                req.getResult(e, location, port).then(res => {
                    const { legancy , status } = res
                    serverRes[i].status = status
                    serverRes[i].legancy = legancy
                    template.testMultiple({ servers, location, port }).then(result => {
                        ctx.telegram.editMessageText(tg_res.chat.id, tg_res.message_id, '', result, {
                            parse_mode: 'markdown'
                        })
                    })
                })
            })
        })
    })
}

bot.start((ctx) => ctx.reply('Torch-Bot: https://github.com/TorchPing/Torch-Bot'))
bot.command('ls', lsServer)
bot.command(`ls@${botName}`, lsServer)
bot.command('ping', ping)
bot.command(`ping@${botName}`, ping)

/* AWS Lambda handler function */
exports.handler = (event, context, callback) => {
  const tmp = JSON.parse(event.body); // get data passed to us
  bot.handleUpdate(tmp); // make Telegraf process that data
  return callback(null, { // return something for webhook, so it doesn't try to send same stuff again
    statusCode: 200,
    body: '',
  });
};