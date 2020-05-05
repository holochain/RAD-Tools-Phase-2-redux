// gratitude to https://flaviocopes.com/react-electron/ for this approach
const net = require('net')
const childProcess = require('child_process')
const fs = require('fs')
const toml = require('toml')

const hcConfig1 = toml.parse(fs.readFileSync('../../../conductor-config.toml', 'utf-8'))
const hcConfig1Port = hcConfig1.interfaces[0].driver.port || 3400
client = new net.Socket()

let startedConductor = false
const tryConnection = () => {
  client.connect(
    { hcConfig1Port },
    () => {
      client.end()
      if (!startedConductor) {
        console.log('Starting UI, connecting to port :' + hcConfig1Port)
        startedConductor = true
        const exec = childProcess.exec
        exec('npm run ui:start-live')
      }
    }
  )
}

tryConnection()

client.on('error', () => {
  console.log('Waiting for Holochain to configure and boot')
  setTimeout(tryConnection, 5000)
})
