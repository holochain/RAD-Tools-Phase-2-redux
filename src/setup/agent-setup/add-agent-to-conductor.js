const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec);
const toml = require('toml')
const { toSnakeCase, toKebabCase } = require('../../utils.js')

// nb: will need to update path to: ('../../conductor-config.toml')
const conductorConfigPath = '../../conductor-config.example.toml'
const conductorConfig = toml.parse(fs.readFileSync(conductorConfigPath, 'utf-8'))
const agentName = process.argv[2]

const generateAgentConfig = (agentName, agentPubKey) => `
  [[agents]]
  id = "${toKebabCase(agentName)}"
  keystore_file = "keystores/${agentName}/${agentPubKey}.keystore"
  name = "${insertSpacesInString(toSnakeCase(agentName), 'underscore')}"
  public_address = "${agentPubKey}"
`

const addAgentToConfig = (agentConfigTemplate, conductorConfigPath) => fs.appendFileSync(conductorConfigPath, agentConfigTemplate)

async function locateAgentPubKey() {
  try {
    const { stderr, stdout } = await exec(`find ./keystores/${agentName} -name *.keystore | xargs -I {} basename {}`)
    if (stderr) console.log('stderr:', stderr)
    else {
      const agentPubKey = stdout.trim()	
      console.log('stdout : AGENT PUB KEY >> ', agentPubKey)	
      return agentPubKey	
    }
  } catch (err) { 
    return console.error(err)
  }
}

if(agentName) {
  locateAgentPubKey()
    .catch(e => console.log(e))
    .then(agentPubKey => {
      console.log('agentPubKey >>>> in the .then block: ', agentPubKey)
      if (conductorConfig.agents.find(agent.public_address === agentPubKey)) return console.log('Agent already exists in Conductor Config')
      generateAgentConfig(agentName, agentPubKey)
      addAgentToConfig(generateAgentConfig(agentName, agentPubKey), conductorConfigPath)
    })
}
else {
  console.log(`Error: Agent Name required as argument.`)
}
