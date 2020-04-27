const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { promiseMapFnOverObject } = require('../../utils.js')
const generateZomeEntries = require('./generate-zome-entries')
const renderZomeIndex = require('./render-zome-index')

async function createZomeDir (zome, entryTypes) {
  const zomeName = zome.toLowerCase()
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
    console.log('about to render Zome Index...')
    await renderZomeIndex(zomeName, zomeEntryTypes, zomeDir)
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n Finished creating ${zomeName.toUpperCase()} ZOME \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n\n\n`)
    return zomeEntries
  }
}

const generateDnaZomes = ({ zomes }) => promiseMapFnOverObject(zomes, createZomeDir)

module.exports = generateDnaZomes