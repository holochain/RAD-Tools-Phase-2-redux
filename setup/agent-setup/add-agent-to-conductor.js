const fs = require('fs')
const util = require('util')
const toml = require('toml')
const concat = require('concat-stream')
const exec = util.promisify(require('child_process').exec);
// nb: will need to update path to: ('../../conductor-config.toml')
const conductorConfig = require('../../conductor-config.example.toml')

const streamConfig = () => fs.createReadStream(conductorConfig, 'utf8').pipe(concat(data => {
  console.log('>>>>>>>>>>>> parsed toml: \n', toml.parse(data))
  return toml.parse(data)
}))

const agentName = process.argv[2]
const pathToConfig = '../../conductor-config/example.toml'

const generateAgentConfig = (agentName, agentPubKey) => `
  id = "${agentName}"
  keystore_file = "keystores/${agentName}/${agentPubKey}>.keystore"
  name = "${agentName}"
  public_address = "${agentPubKey}"
`

if(agentName) {
  locateAgentPubKey()
    .then(agentPubKey => addAgentToConfig(generateAgentConfig(agentName, agentPubKey), pathToConfig))
}
else {
  console.log(`Error: Agent Name required as argument.`)
} 

async function locateAgentPubKey() {
  try {
      const { stderr } = await exec(`find ./keystores/${agentName} -name *.keystore  | sed -ne 's/^(.*)(?=.keystore)//p'`)
      if (stderr) console.log('stderr:', stderr)
  } catch (err) {
     console.error(err)

     if (stderr) console.log(`stderr: ${stderr}`)
     console.log('stdout : ', stdout)
 
     // const agentKeys = new RegExp('(?<=_)(.*)(?=.keystore)').exec(stdout)
     // console.log(agentKeys)
     const agentPubKey = stdout.trim()
     return agentPubKey
  }
}

const addAgentToConfig = (agentConfigTemplate, pathToConfig) => fs.writeFileSync(pathToConfig, () => {
  streamConfig()
})