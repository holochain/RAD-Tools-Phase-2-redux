const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { promiseMapFnOverObject, toSnakeCase } = require('../../utils.js')
const generateZomeEntries = require('./generate-zome-entries')
const renderZomeIndex = require('./render-zome-index')
const renderTestIndex = require('./render-test-index')
const { isEmpty } = require('lodash/fp')


let testingEntries = []

async function findDnaName (zomeDir) {
  const { stderr, stdout } = await exec(`cd ${zomeDir}/../../../.. && dirname $(pwd) | xargs -I {} basename {} directory`)
  if(stderr) console.error('stderr:', stderr)      
  else return stdout.trim()
}

async function findTestDirPath (zomeDir) {
  const { stderr, stdout } = await exec(`cd ${zomeDir} && cd ../../../../test && echo $(pwd -P)`)
  if(stderr) console.error('stderr:', stderr)      
  else return testDirectoryPath = stdout.trim()
}

async function addHCAnchors (zomeDir) {
  const { stderr } = await exec(`cd ${zomeDir} && cargo add holochain_anchors --git https://github.com/holochain/holochain-anchors.git && cd ../../../..`)
  if(stderr) console.error('stderr:', stderr)      
  else {
    return console.log('\nSuccessfully added `holochain_anchors` module')
  }
}

const addCargoEdit = async (zomeDir) => exec(`cd ${zomeDir} && cargo install cargo-edit --force && cd ../../../..`)

async function formatZome (zomeDir) {
  const { stderr } = await exec(`cd ${zomeDir} && cargo fmt && cd ../../../..`)
  if (stderr) console.error('stderr:', stderr)      
  else {
    return console.log('\n--------------------------------------\n Successfully formated zome. +1 \n--------------------------------------  \n')
  }
}

async function createZomeDir (zomeNameRaw, entryTypesWrapper, lastZome) {
  const isLastZome = zomeNameRaw === lastZome
  const zomeName = toSnakeCase(zomeNameRaw).toLowerCase()
  const { stderr, stdout } = await exec(`cd ./dna-src && hc generate zomes/${zomeName} rust-proc | sed -ne 's/lib.rs\.*//p' | xargs -I {} echo $(pwd -P){} && cd ..`)
  if (stderr) console.error('stderr:', stderr)      
  else {
    const zomeDir = stdout.trim().split('> ').join('/')
    const zomeEntryTypes = Object.values(entryTypesWrapper)[0]
    const newTestingEntries = testingEntries.concat(Object.keys(zomeEntryTypes).sort())
    testingEntries = newTestingEntries    
    console.log(' ---------------------------')
    console.log(` Created ${zomeName.toUpperCase()} Zome Directory at ${zomeDir}`)
    console.log(`\n Starting file generation of following ${zomeName.toUpperCase()} Zome Entry Types:`, zomeEntryTypes)
    console.log(' --------------------------- \n')
    await generateZomeEntries(zomeName, zomeEntryTypes)
    console.log('\nPreparing to add Holochain Anchors to Zome ... \n (This might take a while.)')
    await addCargoEdit(zomeDir)
    await addHCAnchors(zomeDir)
    await renderZomeIndex(zomeName, zomeEntryTypes, zomeDir)
    await formatZome(zomeDir)
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n Finished creating ${zomeName.toUpperCase()} ZOME \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n\n\n`)

    if (isLastZome) {      
      const dnaName = await findDnaName(zomeDir)
      const testDir = await findTestDirPath(zomeDir)
      await renderTestIndex(dnaName, testingEntries, testDir)
    }

    return zomeDir
  }
}

const generateDnaZomes = typeSpec => {
  let { zomes } = typeSpec
  // a zomes placeholder for before type-schema format is updated:
  if(isEmpty(zomes)) {
    const { types } = typeSpec
    const zomeEntries = Object.keys(types)    
    const zomeName = toSnakeCase(zomeEntries[0].concat('s')).toLowerCase()
    zomes = { [zomeName]: { types } }
  }
  const orderedZomeNames = Object.keys(zomes).sort()
  const lastZome = orderedZomeNames[orderedZomeNames.length - 1]
  return promiseMapFnOverObject(zomes, createZomeDir, lastZome)
}

module.exports = generateDnaZomes