// const util = require('util');
// const child_process = util.promisify(require('child_process'))
const { exec } = require('child_process')
const chalk = require('chalk')
const path = require('path')

// todo: this is currently a work around due to .cargo/config override option throwing an error at build time.
// combine this command with generateConductor script after futures-util crate is corrected and runs with hc
function updateConductorWithPackagedDNA (dnaHash) {
  const conductorConfigPath = path.resolve("./", "conductor-config.toml")
  exec(`sed -i "s/{DNA_HASH}/${dnaHash}/" ${conductorConfigPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: \n${chalk.red(error)}`)
      return
    }
    else if (stderr) {
      console.error(`stderr: \n${chalk.red(stderr)}`)
      return
    }
    return console.log(`Added DNA Instance to Conductor \nFinished generating Conductor`)
  })
}

// todo: this is currently a work around due to .cargo/config override option throwing an error at build time.
// combine this command with generateConductor script after futures-util crate is corrected and runs with hc
function packageDNA () {
  console.log('Completed DNA build with hc package')
  exec("cd dna-src && hc package", (error, stdout) => {
    if (error) {
      console.error(`exec error: \n${chalk.red(error)}`)
      return
    }
    let dnaHash
    const dnaPackage = /(DNA hash: )/gi
    if(dnaPackage.test(stdout)) {
      dnaHash = stdout.trim().replace(dnaPackage, 'DNA_HASH').split('DNA_HASH')[1]
      updateConductorWithPackagedDNA(dnaHash)
    } else {
      throw new Error('hc package error: Unable to locate compiled DNA hash.')
    }
    return console.log(`\n${chalk.cyan('DNA Hash: ' + dnaHash)}`)
  })
}

function generateConductor () {
  exec("sh ./src/setup/conductor-setup/scripts/generate-conductor.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: \n${chalk.red(error)}`)
      return
    }
    else if (stderr) {
      console.error(`stderr: \n${chalk.red(stderr)}`)
      return
    }
    console.log(`\n${chalk.cyan(stdout)}`)
  })

  // const { stderr, stdout }  = await child_process.exec(`sh ./src/setup/conductor-setup/scripts/generate-conductor.sh`)
  // if (stderr) return stderr
  // else return console.log(`\n${chalk.cyan(stdout)}`)
}

generateConductor()
packageDNA()
  // .catch(e => {
  //   if (e.stderr === '/bin/sh: 1: hc: not found\n'){
  //     console.error(`  ${chalk.red(e.stderr)} \n${chalk.yellow('> Hint: You are probably not running this command in nix-shell. \n  Be sure to enter into nix-shell prior to running any Holochain command.')}`)
  //   } else if (e.stderr) {
  //     console.error(`${chalk.red(e.stderr)}`)
  //   } 
  //   else {
  //     console.error(`${chalk.red(e)}`)
  //   }
  // })
  


module.exports = generateConductor
