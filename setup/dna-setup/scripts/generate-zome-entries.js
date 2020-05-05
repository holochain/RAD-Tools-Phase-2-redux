const fs = require('fs')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { promiseMapFnOverObject, toSnakeCase } = require('../../utils.js')
const renderMod = require('./render-entry-module')
const renderHandlers = require('./render-entry-handlers')
const renderValidation = require('./render-entry-validation')
const renderTest = require('./render-entry-test')

async function createEntryDir(zomeName, entryName) {
  const { stdout, stderr } = await exec(`cd dna-src/zomes/${zomeName}/code/src; [ ! -d ${entryName} ] && mkdir ${entryName}; cd ${entryName} && echo $(pwd -P)`)
  if(stderr) console.error('stderr:', stderr)      
  console.log(` > Created ${entryName.toUpperCase()} Entry file at: ${stdout}`)
  return stdout.trim()
}

async function createEntryTestDir(entryName) {
  let {stdout, stderr } = await exec(`cd dna-src/test; [ ! -d ${entryName} ] && mkdir ${entryName}; cd ${entryName} && echo $(pwd -P)`)
  if (stderr) console.error('stderr:', stderr)  
  console.log(` >> Created ${entryName.toUpperCase()} Entry Test file at: ${stdout}`)
  return stdout.trim()
}

const renderers = [
  [renderMod, 'mod'],
  [renderHandlers, 'handlers'],
  [renderValidation, 'validation'],
  [renderTest, 'index']
]

const renderEntry = async (zomeEntryType, zomeEntry, zomeName) => {
  const zomeEntryName = toSnakeCase(zomeEntryType).toLowerCase()
  const ZOME_ENTRY_PATH = await createEntryDir(zomeName, zomeEntryName)
  const TEST_PATH = await createEntryTestDir(zomeEntryName)
  const resolvePath = fileName => fileName === 'index' ? `${TEST_PATH}/${fileName}.js` : `${ZOME_ENTRY_PATH}/${fileName}.rs`

  renderers.forEach(([renderFunction, filename]) => {
    fs.writeFileSync(resolvePath(filename), renderFunction(zomeEntryName, zomeEntry))
    console.log(` >>> Created file: ${zomeName.toUpperCase()}/${zomeEntryName.toUpperCase()}/${filename.toUpperCase()}.rs at : ${resolvePath(filename)} \n`)
  })
  return console.log(`------------------------------\n Created ${zomeEntryName.toUpperCase()} Entry : ${JSON.stringify(zomeEntry)}\n------------------------------\n\n`)
}

const generateZomeEntries = (zomeName, zomeEntryTypes) => promiseMapFnOverObject(zomeEntryTypes, renderEntry, zomeName)

module.exports = generateZomeEntries