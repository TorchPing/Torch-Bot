const servers = require('./serverList.json')
const axios = require('axios')
const client = axios.create({
  timeout: 10000,
});

module.exports = {
    getResult(server, location, port) {
        return client.get(`${server.address}/${location}/${port}`).then(res => {
            let {time, status} = res.data
            time = parseFloat(time).toFixed(2)
            return {
                status,
                legancy: time
            }
        }).catch(err => {
            return {
                status: null, 
                legancy: 0
            }
        })
    },
    selectServer(index) {
        if (index > -1 && index < servers.length) {
            return servers[index]
        } else {
            return null
        }
    }
}