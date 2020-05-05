// const typeSpec = require('../../type-spec.json')
const typeSpec = require('../../sample-type-spec.json')
const generateDnaShell = require('./generate-dna-shell')
const generateDnaZomes = require('./generate-dna-zomes')

async function genDNA() {
  await generateDnaShell()
  await generateDnaZomes(typeSpec)
}

genDNA()
  .catch(e => {
    if (e.stderr === '/bin/sh: 1: hc: not found\n'){
      console.error(`  ${e.stderr} \n  Hint: You are probably not running this command in nix-shell.  Be sure to enter into nix-shell prior to running any Holochain command.`)
    } else if (e.stderr) {
      console.error(e.stderr)
    } 
    else {
      console.error(e)
    }
  })
  