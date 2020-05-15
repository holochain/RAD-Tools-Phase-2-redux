const util = require('util');
const exec = util.promisify(require('child_process').exec)
const chalk = require('chalk')

async function generateDnaShell (destinationPath) {
  const { stderr } = await exec(`([ ! -d ${destinationPath} ] && hc init ${destinationPath}); [ -d ${destinationPath} ] && echo {}`)
  if (stderr) return stderr
  else return console.log(`\n ${chalk.cyan('Finished creating DNA Shell')} \n`)
}

module.exports = generateDnaShell
