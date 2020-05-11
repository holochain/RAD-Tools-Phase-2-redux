const util = require('util');
const exec = util.promisify(require('child_process').exec)
const chalk = require('chalk')

async function generateDnaShell () {
  const { stderr }  = await exec(`([ ! -f .cargo/config ] && touch .cargo/config) && echo "paths = ["../../futures-util-0.3.4/futures-rs"]" >> .cargo/config`)
  if (stderr) return stderr
  else return console.log(`\n ${chalk.cyan('Generated futures crate override...')} \n`)
}

module.exports = generateDnaShell
