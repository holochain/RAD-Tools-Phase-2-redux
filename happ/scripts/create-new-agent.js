const util = require('util');
const exec = util.promisify(require('child_process').exec)

const agentName = process.argv[2] || "agent-1"

async function checkIfKeystoresDirExists() {
  try {
      const { stderr } = await exec(`[ ! -d 'keystores' ] && mkdir keystores; [ -d 'keystores' ]`)
      if (stderr) console.log('stderr:', stderr)
      } catch (err) {
     console.error(err)
  }
}

async function checkIfAgentDirExists() {
  try {
      const { stderr } = await exec(`[ ! -d 'keystores/${agentName}' ] && mkdir keystores/${agentName}; [ -d 'keystores/${agentName}' ]`)
      if (stderr) console.log('stderr:', stderr)
  } catch (err) {
     console.error(err)
  }
}

async function createNewAgentKeystore() {
  try {
      const { stdout, stderr } = await exec(`hc keygen -n --path ./keystores/${agentName}/AGENT_1_PUB_KEY.keystore | sed -ne 's/^Public address: //p'`)
      if (stderr) console.log('stderr:', stderr)
      let agentPubKey = stdout.trim()
      console.log(`Succesfully created new agent keystore. \n`)
      console.log(`Created Public Address: ${agentPubKey}  \n`)
      const FILE_RENAME_SUCCESS_MESSAGE = `Keystore written to: ./keystores/${agentName}/${agentPubKey}.keystore. \n`
      await exec(`mv ./keystores/${agentName}/AGENT_1_PUB_KEY.keystore ./keystores/${agentName}/${agentPubKey}.keystore`)
        .then(_ => console.log(FILE_RENAME_SUCCESS_MESSAGE))
  } catch (err) {
     console.error(err)
  }
}

checkIfKeystoresDirExists()
  .then(_ => checkIfAgentDirExists())
  .then(_ => createNewAgentKeystore())
