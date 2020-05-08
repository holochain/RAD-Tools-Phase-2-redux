const generateDnaShell = require('./generate-dna-shell')
const generateDnaZomes = require('./generate-dna-zomes')
const fs = require('fs')
const chalk = require('chalk')
const typeSpecPath = process.argv[2]
const defaultTypeSpec = require('../../setup/type-specs/sample-type-spec.json')
// const defaultTypeSpec = require('../../setup/type-specs/sample-type-spec-multiple-zomes.json')

let typeSpec
if (!typeSpecPath) {
  console.log(chalk.blue('> No type spec JSON file provided. \n  Using default type spec JSON file located within the setup directory.\n'))
  typeSpec = defaultTypeSpec
}
else {
  typeSpec = JSON.parse(fs.readFileSync(typeSpecPath))
}

async function genDNA() {
  await generateDnaShell()
  await generateDnaZomes(typeSpec)
}

genDNA()
  .then(() => console.log(` ${chalk.cyan.bold('DNA Generation Complete')} \n`))
  .catch(e => {
    if (e.stderr === '/bin/sh: 1: hc: not found\n'){
      console.error(`  ${chalk.red(e.stderr)} \n${chalk.yellow('> Hint: You are probably not running this command in nix-shell. \n  Be sure to enter into nix-shell prior to running any Holochain command.')}`)
    } else if (e.stderr) {
      console.error(e.stderr)
    } 
    else {
      console.error(e)
    }
  })
  