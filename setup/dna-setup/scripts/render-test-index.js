const fs = require('fs')
const path = require('path')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapFnOverObject,
  toCamelCase,
  capitalize
} = require('../../utils.js')
const { ENTRY_NAME, ENTRY_TEST_IMPORTS, DNA_NAME } = require('../variables.js')

const testIndexTemplatePath = path.resolve("setup/dna-setup/test-template", "index.js");
const testIndexTemplate = fs.readFileSync(testIndexTemplatePath, 'utf8')

let entryTestImports, entryName, dnaName
const testEntryPlaceholders = [
  [() => entryName, ENTRY_NAME],
  [() => dnaName, DNA_NAME]
]

cleanSlate = () => {
  entryTestImports = ''
  entryName = ''
}

// nb: testDir replaced zomeDir && dnaName replaced zomeName
function renderTestIndex (dna, zomeEntryNames, testDir) {
    console.log(` >>> rendering file testing root index.rs `)
    cleanSlate()
    dnaName = dna
    mapFnOverObject(zomeEntryNames, renderTestEntryContent, entryTestImports)
    const completedTestIndex = renderTestEntryFile(testIndexTemplate)

    fs.writeFileSync(`${testDir}/index.js`, completedTestIndex)
    return console.log(`>>> Created Testing root index.rs \n\n`)
  }
  
  const renderTestEntryContent = (zomeEntryName, _, entryTestImports) => {
    const entryImport = `
    require('./${capitalize(toCamelCase(zomeEntryName))}')(orchestrator.registerScenario, conductorConfig)
    `
    entryTestImports = entryTestImports.concat(entryImport) 
    entryName = zomeEntryName
    return { entryTestImports, entryName }
  }
  
  const renderTestEntryFile = templateFile => {  
  console.log('========== Test Root Index =========== \n')
  let newFile = templateFile
  testEntryPlaceholders.forEach(([zomeEntryContentFn, placeHolderContent]) => {
    const zomeEntryContent = zomeEntryContentFn()
    newFile = replaceNamePlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })

  newFile = replaceContentPlaceHolders(newFile, ENTRY_TEST_IMPORTS, entryTestImports)
  return newFile
}

module.exports = renderTestIndex
