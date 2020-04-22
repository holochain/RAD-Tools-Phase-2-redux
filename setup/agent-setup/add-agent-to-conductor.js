const { exec } = require('child_process');

let agentKeys = []

exec("find ./keystores -name *.keystore  | sed -ne 's/\(?<=_\)\(.*\)\(?=.keystore\)$/\2/p'", (err, stdout, stderr) => {
  if (err) return console.error(err)
  else {
    if (stderr) console.log(`stderr: ${stderr}`)
    console.log('stdout : ', stdout)

    const agentKeys = new RegExp('(?<=_)(.*)(?=.keystore)').exec(stdout)
    console.log(agentKeys);
    
  //  const agentKeystores = Array.of(stdout)
  //  agentKeys =agentKeystores.map(agentKeystore => agentKeystore.split('.')[0])
  //  console.log('agentKeys : ', agentKeys)
  }
})