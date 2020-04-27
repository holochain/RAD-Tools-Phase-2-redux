const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { promiseMapFnOverObject } = require('../../utils.js')
const generateZomeEntries = require('./generate-zome-entries')
const renderZomeIndex = require('./render-zome-index')

async function createZomeDir (zome, entryTypes) {
  const zomeName = zome.toLowerCase()
  const { stderr, stdout } = await exec(`cd ./dna-src && hc generate zomes/${zomeName} rust-proc && echo $(pwd -P) && cd ..`)

  console.log('ZOME PATH stdout : ', stdout)
  

  if(stderr) console.error('stderr:', stderr)      
  else {
    console.log(' ---------------------------')
    console.log(`Created ${zomeName.toUpperCase()} ZOME Shell`)
    console.log(`${zomeName.toUpperCase()} Zome entryTypes:`, entryTypes)
    console.log(' --------------------------- \n')
    const entryTypeWrapper = Object.values(entryTypes)
    const zomeEntryTypes = entryTypeWrapper[0]
    const zomeEntries = await generateZomeEntries(zomeName, zomeEntryTypes)
    console.log('about to render Zome Index...')
    await renderZomeIndex(zomeName, zomeEntryTypes)
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n Finished creating ${zomeName.toUpperCase()} ZOME \n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n\n\n`)
    return zomeEntries
  }
}

const generateDnaZomes = ({ zomes }) => promiseMapFnOverObject(zomes, createZomeDir)

module.exports = generateDnaZomes