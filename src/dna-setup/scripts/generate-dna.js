const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const typeSpecPath = process.argv[2]
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const generateDnaShell = require('./generate-dna-shell')
const generateDnaZomes = require('./generate-dna-zomes')
const defaultTypeSpecPath = path.resolve('src/setup/type-specs', 'sample-type-spec.json')
const defaultTypeSpec = require(defaultTypeSpecPath)

const ROOT_DIR = path.resolve(`./`)
const DESTINATION_PATH = `${ROOT_DIR}/happ`
const DNA_SETUP_DIR = `${ROOT_DIR}/src/dna-setup`

let typeSpec
if (!typeSpecPath) {
  console.log(chalk.blue('> No type spec JSON file provided. \n  Using default type spec JSON file located within the setup directory.\n'))
  typeSpec = defaultTypeSpec
} else {
  typeSpec = JSON.parse(fs.readFileSync(typeSpecPath))
}

async function genDNA () {
  // ensure happ directory exists and go into happ directory
  const { stderr } = await exec(`[ ! -d ${DESTINATION_PATH} ] && mkdir ${DESTINATION_PATH}; cd ${DESTINATION_PATH}`)
  if (stderr) console.error('stderr:', stderr)

  await generateDnaShell()
  await generateDnaZomes(typeSpec, DNA_SETUP_DIR)

  // go back to root level
  process.chdir('../')
}

genDNA()
  .then(() => console.log(` ${chalk.cyan.bold('DNA Generation Complete')} \n`))
  .catch(e => {
    if (e.stderr === '/bin/sh: 1: hc: not found\n') {
      console.error(`  ${chalk.red(e.stderr)} \n${chalk.yellow('> Hint: You are probably not running this command in nix-shell. \n  Be sure to enter into nix-shell prior to running any Holochain command.')}`)
    } else if (e.stderr) {
      console.error(`${chalk.red(e.stderr)}`)
    } else {
      console.error(`${chalk.red(e)}`)
    }
  })

