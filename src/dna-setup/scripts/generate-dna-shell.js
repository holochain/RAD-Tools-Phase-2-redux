const util = require('util');
const exec = util.promisify(require('child_process').exec)

async function generateDnaShell () {
  const { stderr }  = await exec(`([ ! -d ./dna-src ] && hc init dna-src); [ -d ./dna-src ] && echo {}`)
  if (stderr) return console.error('stderr:', stderr)
  console.log('\n *** Created DNA shell *** \n')
}

module.exports = generateDnaShell
