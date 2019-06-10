const servers = require('../serverList')

const ejs = require('ejs')

module.exports = {
    lsServer (server, i) {
        return ejs.renderFile('template/ls/server.ejs', {
            server, 
            i
        })
    },
    lsAll () {
        return ejs.renderFile('template/ls/servers.ejs',{
            servers
        })
    },
    testOne({ server, index, status = undefined, legancy = 0, location, port}) {
        return ejs.renderFile('template/test/singleServer.ejs', {
            server,
            index,
            status,
            legancy, 
            location, 
            port
        })
    },
    testMultiple({ servers, location, port }) {
        return ejs.renderFile('template/test/servers.ejs', {
            servers,
            location, 
            port
        })
    }
}