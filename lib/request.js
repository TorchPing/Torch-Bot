const axios = require('axios')
const client = axios.create({
  timeout: 10000,
});
const serverListURL = 'https://raw.githubusercontent.com/TorchPing/Torch-Web/master/src/serverList.json'

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
    selectServer(index, servers) {
        if (index > -1 && index < servers.length) {
            return servers[index]
        } else {
            return null
        }
    },
    getServerList() {
        return client.get(serverListURL).then(res =>{
            return res.data
        })
    }
}