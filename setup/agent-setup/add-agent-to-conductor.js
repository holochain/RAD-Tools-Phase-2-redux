const { exec } = require('child_process');

const agentKeys = []

exec("find ./keystores -name *.keystore  | sed -ne 's/_\.*//p' | xargs -I {} echo '{}'", (err, stdout, stderr) => {
  if (err) return console.error(err)
  else {
   if (stderr) console.log(`stderr: ${stderr}`)
   console.log(`stdout: ${stdout}`)

   // agentKeys.push(stdout)
   // agentKeys = stdout
  }
})