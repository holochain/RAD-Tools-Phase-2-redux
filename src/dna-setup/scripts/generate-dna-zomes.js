const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path')
const { promiseMapOverObject, replaceNamePlaceHolders, toCamelCase, toSnakeCase } = require('../../setup/utils.js')
const { DNA_NAME, ZOME_NAME } = require('../variables.js')
const generateZomeEntries = require('./generate-zome-entries')
const generateZomeLib = require('./generate-zome-lib')
const generateTestIndex = require('./generate-test-index')
const { isEmpty } = require('lodash/fp')
const chalk = require('chalk')

async function findDnaName (zomeDir) {
  const { stderr, stdout } = await exec(`cd ${zomeDir}/../../../.. && dirname $(pwd) | xargs -I {} basename {} directory`)
  if (stderr) console.error('stderr:', stderr)
  else return stdout.trim()
}

async function findTestDirPath (zomeDir) {
  const { stderr, stdout } = await exec(`cd ${zomeDir} && cd ../../../../test && echo $(pwd -P)`)
  if (stderr) {
    console.error('stderr:', stderr)
  } else {
    return stdout.trim()
  }
}

const renderZomeCargoToml = (zomeName, zomeDir, DNA_SETUP_DIR) => {
  const pathAsArray = zomeDir.split('/')
  const zomeCodeDir = pathAsArray.splice(0, pathAsArray.length - 2).join('/')
  const cargoTomlTemplatePath = path.resolve(`${DNA_SETUP_DIR}/zome-template`, 'Cargo.toml')
  const cargoTomlTemplate = fs.readFileSync(cargoTomlTemplatePath, 'utf8')
  const cargoToml = replaceNamePlaceHolders(cargoTomlTemplate, ZOME_NAME, zomeName)
  const writeCargoToml = fs.writeFileSync(`${zomeCodeDir}/Cargo.toml`, cargoToml)
  return writeCargoToml
}

const renderNixSetup = async (dnaName, zomeDir, DNA_SETUP_DIR) => {
  // write nix-shell setup for dna and root - for integration testing
  const happDnaName = toCamelCase(dnaName)
  const pathAsArray = zomeDir.split('/')
  const dnaSrcDir = pathAsArray.splice(0, pathAsArray.length - 5).join('/')
  const { stderr } = await exec(`rm -rf ${dnaSrcDir}/default.nix`)
  if (stderr) console.error('stderr:', stderr)

  const configNixTemplatePath = path.resolve(`${DNA_SETUP_DIR}/../happ-template`, 'config.nix')
  const configNixTemplate = fs.readFileSync(configNixTemplatePath, 'utf8')
  const configNix = replaceNamePlaceHolders(configNixTemplate, DNA_NAME, happDnaName)  
  fs.writeFileSync(`${dnaSrcDir}/../config.nix`, configNix)
}

async function formatZome (zomeDir) {
  const { stderr } = await exec(`cd ${zomeDir} && cargo fmt && cd ../../../..`)
  if (stderr) console.error('stderr:', stderr)
}

async function createZomeDir (zomeNameRaw, entryTypesWrapper, DNA_SETUP_DIR) {
  const zomeName = toSnakeCase(zomeNameRaw).toLowerCase()
  const { stderr, stdout } = await exec(`cd ./dna-src && hc generate zomes/${zomeName} rust-proc | sed -ne 's/lib.rs\.*//p' | xargs -I {} echo $(pwd -P){}`)
  if (stderr) {
    console.error('stderr:', stderr)
  } else {
    const zomeDir = stdout.trim().split('> ').join('/')
    const zomeEntryTypes = Object.values(entryTypesWrapper)[0]
    const testingEntries = Object.keys(zomeEntryTypes).sort()
    await generateZomeEntries(zomeName, zomeEntryTypes)
    await generateZomeLib(zomeName, zomeEntryTypes, zomeDir)
    await formatZome(zomeDir)
    renderZomeCargoToml(zomeName, zomeDir, DNA_SETUP_DIR)
    console.log(`${chalk.cyan(' Finished creating ' + zomeName.toUpperCase() + ' Zome')}\n`)

    return {
      testingEntries,
      zomeDir
    }
  }
}

const generateDnaZomes = (typeSpec, DNA_SETUP_DIR) => {
  let { zomes } = typeSpec
  // a zomes placeholder for before type-schema format is updated:
  if (isEmpty(zomes)) {
    const { types } = typeSpec
    const zomeName = 'zome'
    zomes = { [zomeName]: { types } }
  }

  return promiseMapOverObject(zomes, (zomeNameRaw, entryTypesWrapper) => createZomeDir(zomeNameRaw, entryTypesWrapper, DNA_SETUP_DIR))
    .then(async zomeDirResults => {
      if (zomeDirResults.length > 0) {
        const { zomeDir } = zomeDirResults[0]
        const testingEntries = zomeDirResults.reduce((acc, { testingEntries }) => acc.concat(testingEntries), [])
        const dnaName = await findDnaName(zomeDir)
        const testDir = await findTestDirPath(zomeDir)
        await generateTestIndex(dnaName, testingEntries, testDir, DNA_SETUP_DIR)
        await renderNixSetup(dnaName, zomeDir, DNA_SETUP_DIR)
      }
    })
}

module.exports = generateDnaZomes
