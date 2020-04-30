const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec);
const toml = require('toml')
require('toml-require').install({ toml })
// nb: will need to update path to: ('../../conductor-config.toml')
const conductorConfigPath = require('../../conductor-config.example.toml')

// const conductorConfig = toml.parse(fs.readFileSync(conductorConfigPath, 'utf-8'))

const agentName = process.argv[2]
const pathToConfig = '../../conductor-config.example.toml'

const generateAgentConfig = (agentName, agentPubKey) => `
  [[agents]]
  id = "${agentName}"
  keystore_file = "keystores/${agentName}/${agentPubKey}.keystore"
  name = "${agentName}"
  public_address = "${agentPubKey}"
`

const addAgentToConfig = (agentConfigTemplate, pathToConfig) => fs.appendFileSync(pathToConfig, agentConfigTemplate)

if(agentName) {
  locateAgentPubKey()
    .catch(e => console.log(e))
    .then(agentPubKey => {
      // console.log('agentPubKey >>>> in then block: ', agentPubKey)
      // if (conductorConfig.agents.find(agent.public_address === agentPubKey)) return console.log('Agent already exists in Conductor Config')
      addAgentToConfig(generateAgentConfig(agentName, agentPubKey), pathToConfig)
      let g = generateAgentConfig(agentName, agentPubKey)
    })
}
else {
  console.log(`Error: Agent Name required as argument.`)
}

async function locateAgentPubKey() {
  const { stdout, stderr } = await exec(`sh ./setup/agent-setup/script/read-file.sh`)
  if (stderr) console.log('stderr:', stderr)
  return stdout.trim()
}
