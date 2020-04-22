const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec);
const toml = require('toml')
require('toml-require').install({ toml })
// const concat = require('concat-stream')

// nb: will need to update path to: ('../../conductor-config.toml')
const conductorConfigPath = require('../../conductor-config.example.toml')
// const conductorConfig = toml.parse(fs.readFileSync(conductorConfigPath, 'utf-8'))

// const streamConfig = () => fs.createReadStream(conductorConfigPath, 'utf8').pipe(concat(data => {
//   try {
//     console.log('>>>>>>>>>>>> parsed toml: \n', toml.parse(data))
//   } catch (e) {
//     console.error("Parsing error on line " + e.line + ", column " + e.column +
//       ": " + e.message);
//   }
// }))


const agentName = process.argv[2]
const pathToConfig = '../../conductor-config.example.toml'

const generateAgentConfig = (agentName, agentPubKey) => `
  [[agents]]
  id = "${agentName}"
  keystore_file = "keystores/${agentName}/${agentPubKey}>.keystore"
  name = "${agentName}"
  public_address = "${agentPubKey}"
`

const addAgentToConfig = (agentConfigTemplate, pathToConfig) => fs.appendFileSync(pathToConfig, agentConfigTemplate)

if(agentName) {
  locateAgentPubKey()
    .catch(e => console.log(e))
    .then(agentPubKey => {
      console.log('agentPubKey >>>> in then block: ', agentPubKey)
      // if (conductorConfig.agents.find(agent.public_address === agentPubKey)) return console.log('Agent already exists in Conductor Config')
      addAgentToConfig(generateAgentConfig(agentName, agentPubKey), pathToConfig)
    })
}
else {
  console.log(`Error: Agent Name required as argument.`)
} 

async function locateAgentPubKey() {
  try {
      const { stderr } = await exec(`find ./keystores/${agentName} -name *.keystore  | sed -ne 's/^.*\.keystore//p'`)
      if (stderr) console.log('stderr:', stderr)
  } catch (err) {
     console.error(err)

     if (stderr) console.log(`stderr: ${stderr}`)
     console.log('stdout : AGENT PUB KEY >> ', stdout)
 
     // const agentKey = new RegExp('(?<=_)(.*)(?=.keystore)').exec(stdout)
     // console.log(agentKey)
     const agentPubKey = stdout.trim()
     return agentPubKey
  }
}
