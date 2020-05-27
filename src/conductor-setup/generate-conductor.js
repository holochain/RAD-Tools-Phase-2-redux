const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { toCamelCase } = require('../setup/utils')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const toml = require('toml')

const ROOT_DIR = path.resolve(`./`)
const DESTINATION_PATH = `${ROOT_DIR}/happ`

async function generateConductor () {
  const { stderr, stdout } = await exec(`sh ${ROOT_DIR}/src/conductor-setup/scripts/generate-conductor.sh`)
  if (stderr) {
    throw new Error(stderr)
  } else {
    console.log(`\n${chalk.cyan(stdout)}`)
  }
}

// nb: this is currently a work around to manage warning errors that cause successfull builds to return an error
async function packageDNA () {
  console.log('building DNA...')
  const { stdout } = await exec(`cd ${DESTINATION_PATH}/dna-src && hc package`)
  let dnaHash
  const dnaPackage = /(DNA hash: )/gi
  if (dnaPackage.test(stdout)) {
    dnaHash = stdout.trim().replace(dnaPackage, 'DNA_HASH').split('DNA_HASH')[1]
    console.log(chalk.cyan('Completed DNA build with hc package'))
    updateConductorWithPackagedDna(dnaHash)
  } else {
    throw new Error('hc package error: Unable to locate compiled DNA hash.')
  }
  return console.log(chalk.cyan('DNA Hash: ' + dnaHash))
}

async function updateConductorWithPackagedDna (dnaHash) {
  const conductorConfigPath = path.resolve(DESTINATION_PATH, 'conductor-config.toml')
  const appName = toCamelCase(path.basename(path.dirname(conductorConfigPath)))
  const dnaName = appName || dnaHash

  const hcConfig = toml.parse(fs.readFileSync(conductorConfigPath, 'utf-8'))
  const port = hcConfig.interfaces[0].driver.port || 33000

  await updateUiDotEnv(`${dnaName}-instance-1`, port)

  const { stderr } = await exec(`sed -i "s/<DNA_HASH>/${dnaHash}/" ${conductorConfigPath}; sed -i "s/<DNA_NAME>/${dnaName}/" ${conductorConfigPath}`)
  if (stderr) {
    return console.error(`exec stderr: \n${chalk.red(stderr)}`)
  } else {
    return console.log(chalk.cyan('Added DNA Instance to Conductor \n\nFinished generating Conductor'))
  }
}

async function updateUiDotEnv (instanceId, wsPort) {
  const uiDotEnvPath = path.resolve(`${DESTINATION_PATH}/ui-src`, '.env')
  await exec(`sed -i "s/<INSTANCE_ID>/${instanceId}/" ${uiDotEnvPath}`)
  await exec(`sed -i "s/<WS_PORT>/${wsPort}/" ${uiDotEnvPath}`)
}

generateConductor()
  .then(() => packageDNA())
  .then(() => updateConductorWithPackagedDna())
  .catch(e => {
    if (e.stderr === '/bin/sh: 1: hc: not found\n') {
      console.error(`  ${chalk.red(e.stderr)} \n${chalk.yellow('> Hint: You are probably not running this command in nix-shell. \n  Be sure to enter into nix-shell prior to running any Holochain command.')}`)
    } else if (e.stderr) {
      console.error(`${chalk.red(e.stderr)}`)
    } else {
      console.error(`${chalk.red(e)}`)
    }
  })

module.exports = generateConductor
