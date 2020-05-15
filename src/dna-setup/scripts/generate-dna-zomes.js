const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path')
const { promiseMapOverObject, replaceNamePlaceHolders, toCamelCase, toSnakeCase } = require('../../utils.js')
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

const renderZomeCargoToml = (zomeName, zomeDir) => {
  const pathAsArray = zomeDir.split('/')
  const zomeCodeDir = pathAsArray.splice(0, pathAsArray.length - 2).join('/')
  const cargoTomlTemplatePath = path.resolve('src/dna-setup/zome-template', 'Cargo.toml')
  const cargoTomlTemplate = fs.readFileSync(cargoTomlTemplatePath, 'utf8')
  const cargoToml = replaceNamePlaceHolders(cargoTomlTemplate, ZOME_NAME, zomeName)
  const writeCargoToml = fs.writeFileSync(`${zomeCodeDir}/Cargo.toml`, cargoToml)
  return writeCargoToml
}

const renderNixSetup = (dnaName, zomeDir) => {
  const happDnaName = toCamelCase(dnaName)
  const pathAsArray = zomeDir.split('/')
  const dnaSrcDir = pathAsArray.splice(0, pathAsArray.length - 5).join('/')
  const defaultNixTemplatePath = path.resolve('src/dna-setup/zome-template', 'default.nix')
  const defaultNix = fs.readFileSync(defaultNixTemplatePath, 'utf8')
  fs.writeFileSync(`${dnaSrcDir}/default.nix`, defaultNix)
  const configNixTemplatePath = path.resolve('src/dna-setup/zome-template', 'config.nix')
  const configNixTemplate = fs.readFileSync(configNixTemplatePath, 'utf8')
  const configNix = replaceNamePlaceHolders(configNixTemplate, DNA_NAME, happDnaName)
  const writeconfigNix = fs.writeFileSync(`${dnaSrcDir}/config.nix`, configNix)
  return writeconfigNix
}

async function formatZome (zomeDir) {
  const { stderr } = await exec(`cd ${zomeDir} && cargo fmt && cd ../../../..`)
  if (stderr) console.error('stderr:', stderr)
}

async function createZomeDir (zomeNameRaw, entryTypesWrapper) {
  const zomeName = toSnakeCase(zomeNameRaw).toLowerCase()
  const { stderr, stdout } = await exec(`cd ./dna-src && hc generate zomes/${zomeName} rust-proc | sed -ne 's/lib.rs\.*//p' | xargs -I {} echo $(pwd -P){} && cd ..`)
  if (stderr) {
    console.error('stderr:', stderr)
  } else {
    const zomeDir = stdout.trim().split('> ').join('/')
    const zomeEntryTypes = Object.values(entryTypesWrapper)[0]
    const testingEntries = Object.keys(zomeEntryTypes).sort()
    await generateZomeEntries(zomeName, zomeEntryTypes)
    await generateZomeLib(zomeName, zomeEntryTypes, zomeDir)
    await formatZome(zomeDir)
    renderZomeCargoToml(zomeName, zomeDir)
    console.log(`${chalk.cyan(' Finished creating ' + zomeName.toUpperCase() + ' ZOME')}\n`)

    return {
      testingEntries,
      zomeDir
    }
  }
}

const generateDnaZomes = typeSpec => {
  let { zomes } = typeSpec
  // a zomes placeholder for before type-schema format is updated:
  if (isEmpty(zomes)) {
    const { types } = typeSpec
    const zomeName = 'zome'
    zomes = { [zomeName]: { types } }
  }
  return promiseMapOverObject(zomes, createZomeDir)
    .then(async zomeDirResults => {
      if (zomeDirResults.length > 1) {
        const { zomeDir } = zomeDirResults[0]
        const testingEntries = zomeDirResults.reduce((acc, { testingEntries }) => acc.concat(testingEntries), [])
        const dnaName = await findDnaName(zomeDir)
        const testDir = await findTestDirPath(zomeDir)
        await generateTestIndex(dnaName, testingEntries, testDir)
        renderNixSetup(dnaName, zomeDir)
      }
    })
}

module.exports = generateDnaZomes
