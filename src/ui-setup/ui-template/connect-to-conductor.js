// gratitude to https://flaviocopes.com/react-electron/ for this approach
const net = require('net')
// const util = require('util');
// const exec = util.promisify(require('child_process').exec)
const { exec } = require('child_process')
const fs = require('fs')
const toml = require('toml')

const hcConfig = toml.parse(fs.readFileSync('../conductor-config.toml', 'utf-8'))
const port = hcConfig.interfaces[0].driver.port || 3400

client = new net.Socket()

let startedConductor = false
const tryConnection = () => {
  console.log('hcConfig port:', port)
  client.connect(
    { port },
    () => {
      client.end()
      if (!startedConductor) {
        startedConductor = true
        console.log('Starting UI, connecting to port :', port)
        exec("npm run ui:start-agent-1", (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }
        else if (stderr) {
          console.error(`stderr: ${stderr}`)
          return
        }
        console.log(`stdout: ${stdout}`)
      })
      }
    }
  )
}

tryConnection()

client.on('error', () => {
  console.log('Waiting for Holochain to configure and boot')
  setTimeout(tryConnection, 5000)
})
