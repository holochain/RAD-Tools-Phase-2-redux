// gratitude to https://flaviocopes.com/react-electron/ for this approach
const net = require('net')
const childProcess = require('child_process')
const port = 3100;
const client = new net.Socket()

let startedConductor = false
const tryConnection = () => {
  client.connect(
    { port },
    () => {
      client.end()
      if (!startedConductor) {
        console.log('Starting UI, connecting to port :' + port)
        startedConductor = true
        const exec = childProcess.exec
        exec('npm run start:live')
      }
    }
  )
}

tryConnection()

client.on('error', () => {
  console.log('Waiting for Holochain to configure and boot')
  setTimeout(tryConnection, 5000)
})
