const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { promiseMapFnOverObject, toSnakeCase } = require('../../utils.js')
const generateZomeEntries = require('./generate-zome-entries')
const renderZomeIndex = require('./render-zome-index')

const { isEmpty } = require('lodash/fp')

async function createZomeDir (currentZomeName, entryTypes) {
  const zomeName = toSnakeCase(currentZomeName).toLowerCase()
  const { stderr, stdout } = await exec(`cd ./dna-src && hc generate zomes/${zomeName} rust-proc | sed -ne 's/lib.rs\.*//p' | xargs -I {} echo $(pwd -P){} && cd ..`)
  if(stderr) console.error('stderr:', stderr)      
  else {
    const zomeDir = stdout.trim().split('> ').join('/')
    console.log(' ---------------------------')
    console.log(`Created ${zomeName.toUpperCase()} Zome Directory at ${zomeDir}`)
    console.log(`${zomeName.toUpperCase()} Zome entryTypes:`, entryTypes)
    console.log(' --------------------------- \n')
    const entryTypeWrapper = Object.values(entryTypes)
    const zomeEntryTypes = entryTypeWrapper[0]
    const zomeEntries = await generateZomeEntries(zomeName, zomeEntryTypes)
    await renderZomeIndex(zomeName, zomeEntryTypes, zomeDir)
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n Finished creating ${zomeName.toUpperCase()} ZOME \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n\n\n`)
    return zomeEntries
  }
}

const generateDnaZomes = typeSpec => {
  let { zomes } = typeSpec

  // { zomes } placeholder for before type-schema format is updated :
  if(isEmpty(zomes)) {
    const { types } = typeSpec
    const zomeEntries = Object.keys(types)    
    // todo: verify && and validate snake case && lowercase
    const zomeName = zomeEntries.length > 1 ? 'my_zome' : toSnakeCase(zomeEntries[0].concat('s')).toLowerCase()
    zomes = { [zomeName]: { types } }
  }

  return promiseMapFnOverObject(zomes, createZomeDir)
}

module.exports = generateDnaZomes