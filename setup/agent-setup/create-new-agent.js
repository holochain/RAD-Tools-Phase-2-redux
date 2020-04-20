const { exec } = require('child_process')
const prompts = require('prompts')

let agentName 

// prompt user for name of agent
(async () => {
  const response = await prompts({
    type: 'text',
    name: 'agentName',
    message: 'What is the name of this Agent?'
  });
 
  console.log(response.agentName)
  agentName = response.agentName
})();


// create keys, referencing agent name output from prompt as input var for keygen file-name/path:
exec(`hc keygen -n --path ./keystores/${agentName}_<AGENT_PUB_KEY>.keystore  | sed -ne 's/^Public address:\.*//p' | xargs -I {} mv ./keystores/${agentName}_AGENT_1_PUB_KEY.keystore ./keystores/${agentName}_{}.keystore`, (err, stdout, stderr) => {
  if (err) return console.error(err)
  else {
   if (stderr) console.log(`stderr: ${stderr}`)
   console.log(`Agent Keys - stdout : ${stdout}`)
  }
})
