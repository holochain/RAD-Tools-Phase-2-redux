// gratitude to https://flaviocopes.com/react-electron/ for this approach
const net = require('net')
const { exec } = require('child_process')
const fs = require('fs')
const toml = require('toml')

const hcConfig = toml.parse(fs.readFileSync('../conductor-config.toml', 'utf-8'))
const port = hcConfig.interfaces[0].driver.port || 3400

function waitForConductor (onStarted = () => {}) {
  const client = new net.Socket()

  let startedConductor = false
  const tryConnection = () => {
    console.log('hcConfig port:', port)
    client.connect(
      { port },
      () => {
        client.end()
        if (!startedConductor) {
          startedConductor = true
          console.log('Holochain Conductor is up')
          onStarted()
        }
      }
    )
  }

  tryConnection()

  client.on('error', () => {
    console.log('Waiting for Holochain Conductor to configure and boot')
    setTimeout(tryConnection, 5000)
  })
}

function waitForConductorAndStartUi () {
  const startUi = () => {
    console.log('Starting UI, connecting to port :', port)
    exec('npm run start-agent', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      } else if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
    })
  }
  return waitForConductor(startUi)
}

if (process.argv[2] === 'start-ui') {
  waitForConductorAndStartUi()
} else {
  waitForConductor()
}
