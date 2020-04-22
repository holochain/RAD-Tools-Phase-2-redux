const util = require('util');
const exec = util.promisify(require('child_process').exec);

const agentName = process.argv[2]

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
      const { stdout, stderr } = await exec(`sh -c 'hc keygen -n --path ./keystores/${agentName}/AGENT_1_PUB_KEY.keystore | sed -ne 's/^Public address:|.*//p/''`)
      if (stderr) console.log('stderr:', stderr)

      console.log(stdout)
 
      // const findAgentPubKey = new RegExp(`sed -ne 's/^Public \.*//p'`)
      // const agentPubKey = findAgentPubKey.exec(stdout)
      // console.log('agentPubKey :', agentPubKey);
      
      // new RegExp(`mv ./keystores/${agentName}/<AGENT_PUB_KEY>.keystore ./keystores/${agentName}/${agentPubKey}.keystore`)
      
      //  | sed -ne 's/^Public address:\.*//p' | xargs -I {} mv ./keystores/${agentName}/agentkey.keystore ./keystores/${agentName}/{}.keystore
  } catch (err) {
     console.error(err)
  }
}

checkIfKeystoresDirExists()
  .then(_ => checkIfAgentDirExists())
  .then(_ => createNewAgentKeystore())