const util = require('util');
const exec = util.promisify(require('child_process').exec)
const chalk = require('chalk')
const path = require('path')
const { toCamelCase } = require('../../utils.js')

async function updateUiWithDnaInstance (instanceName) {
  const uiResolversPath = path.resolve("./ui-src/src", "resolvers.js")
  const { stderr }  = await exec(`sed -i "s/<DNA_INSTANCE>/${instanceName}/" ${uiResolversPath}`)
  if (stderr) return console.error(`exec stderr: \n${chalk.red(stderr)}`)
  else return
}

async function updateConductorWithPackagedDna (dnaHash) {
  const conductorConfigPath = path.resolve("./", "conductor-config.toml")  
  const appName = toCamelCase(path.basename(path.dirname(conductorConfigPath)))
  const dnaName = appName || dnaHash

  const { stderr }  = await exec(`sed -i "s/<DNA_HASH>/${dnaHash}/" ${conductorConfigPath}; sed -i "s/<DNA_NAME>/${dnaName}/" ${conductorConfigPath}`)
  if (stderr) {
    return console.error(`exec stderr: \n${chalk.red(stderr)}`)
  } else {
    updateUiWithDnaInstance(`${dnaName}-instance-1`)
    return console.log(chalk.cyan('Added DNA Instance to Conductor \n\nFinished generating Conductor'))
  }
}

// nb: this is currently a work around to manage warning errors that cause successfull builds to return an error
async function packageDNA () {
  console.log('building DNA...')
  const { stdout }  = await exec(`cd dna-src && hc package`)
  let dnaHash
  const dnaPackage = /(DNA hash: )/gi
  if(dnaPackage.test(stdout)) {
    dnaHash = stdout.trim().replace(dnaPackage, 'DNA_HASH').split('DNA_HASH')[1]
    console.log(chalk.cyan('Completed DNA build with hc package'))
    updateConductorWithPackagedDna(dnaHash)
  } else {
    throw new Error('hc package error: Unable to locate compiled DNA hash.')
  }
  return console.log(chalk.cyan('DNA Hash: ' + dnaHash))
}

async function generateConductor () {
  const { stderr, stdout }  = await exec(`sh ./src/setup/conductor-setup/scripts/generate-conductor.sh`)
  if (stderr) return stderr
  else return console.log(`\n${chalk.cyan(stdout)}`)
}

generateConductor()
  .then(() => packageDNA())
  .then(() => updateConductorWithPackagedDna())
  .catch(e => {
    if (e.stderr === '/bin/sh: 1: hc: not found\n'){
      console.error(`  ${chalk.red(e.stderr)} \n${chalk.yellow('> Hint: You are probably not running this command in nix-shell. \n  Be sure to enter into nix-shell prior to running any Holochain command.')}`)
    } else if (e.stderr) {
      console.error(`${chalk.red(e.stderr)}`)
    } 
    else {
      console.error(`${chalk.red(e)}`)
    }
  })
  


module.exports = generateConductor
