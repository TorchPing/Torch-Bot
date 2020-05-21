const ejs = require('ejs')
const path = require('path')

module.exports = {
    lsServer (server, i) {
        return ejs.renderFile(path.resolve(__dirname, 'ls/server.ejs'), {
            server, 
            i
        })
    },
    lsAll (servers) {
        return ejs.renderFile(path.resolve(__dirname, 'ls/servers.ejs'),{
            servers
        })
    },
    testOne({ server, index, status = undefined, legancy = 0, location, port}) {
        return ejs.renderFile(path.resolve(__dirname, 'test/singleServer.ejs'), {
            server,
            index,
            status,
            legancy, 
            location, 
            port
        })
    },
    testMultiple({ servers, location, port }) {
        return ejs.renderFile(path.resolve(__dirname, 'test/servers.ejs'), {
            servers,
            location, 
            port
        })
    }
}