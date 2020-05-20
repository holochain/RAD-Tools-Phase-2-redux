const fs = require('fs')
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)
const toml = require('toml')
const { insertSpacesInString, toSnakeCase, capitalize, toKebabCase } = require('./utils.js')

const agentName = process.argv[2]
const formattedName = insertSpacesInString(capitalize(toSnakeCase(agentName)), 'underscore')
const conductorConfigPath = path.resolve('./', 'conductor-config.toml')
const conductorConfig = toml.parse(fs.readFileSync(conductorConfigPath, 'utf-8'))

const generateAgentConfig = (agentName, agentPubKey) => `
[[agents]]
id = "${toKebabCase(agentName)}"
keystore_file = "keystores/${agentName}/${agentPubKey}.keystore"
name = "${formattedName}"
public_address = "${agentPubKey}"
`

async function locateAgentPubKey () {
  try {
    const { stderr, stdout } = await exec(`find ./keystores/${agentName} -name *.keystore | xargs -I {} basename {}`)
    if (stderr) console.log('stderr:', stderr)
    else {
      const agentPubKey = stdout.trim().split('.')[0]
      console.log(`Agent ${formattedName}'s public key:`, agentPubKey)	
      return agentPubKey
    }
  } catch (err) {
    return console.error(err)
  }
}

if (agentName) {
  locateAgentPubKey()
    .catch(e => console.log(e))
    .then(agentPubKey => {
      if (conductorConfig.agents.find(agent => agent.public_address === agentPubKey)) return console.log('Agent already exists in Conductor Config : ', conductorConfig.agents.find(agent => agent.public_address === agentPubKey))
      try {
        fs.appendFileSync(conductorConfigPath, generateAgentConfig(agentName, agentPubKey))
        console.log('New agent appended to conductor-config.toml!');
      } catch (err) {
        console.error('Error: Error appending new agent to the file')
      }
      return agentPubKey
    })
}
else {
  console.log(`Error: Agent Name required as argument.`)
}
