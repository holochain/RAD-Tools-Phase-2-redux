const fs = require('fs')
const path = require('path')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapFnOverObject,
  toSnakeCase
} = require('../../utils.js')
const { ENTRY_TEST_IMPORTS, DNA_NAME } = require('../variables.js')

const testIndexTemplatePath = path.resolve("src/dna-setup/test-template", "index.js");
const testIndexTemplate = fs.readFileSync(testIndexTemplatePath, 'utf8')
let testImports = ''

function renderTestIndex (dnaName, zomeEntryNames, testDir) {
  const entryTestImports = mapFnOverObject(zomeEntryNames, renderTestEntryContent, testImports)
  const completedTestIndex = renderTestEntryFile(testIndexTemplate, dnaName, entryTestImports)
  fs.writeFileSync(`${testDir}/index.js`, completedTestIndex)
  return console.log(`\n========== Created Testing root index.js ===========\n\n`)
}
  
const renderTestEntryContent = zomeEntryName => {
  const entryImport = `
require('./${toSnakeCase(zomeEntryName.toLowerCase())}')(orchestrator.registerScenario, conductorConfig)
  `
  testImports = testImports + entryImport
  return testImports
}
  
const renderTestEntryFile = (templateFile, dnaName, entryTestImports) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, DNA_NAME, dnaName)
  newFile = replaceContentPlaceHolders(newFile, ENTRY_TEST_IMPORTS, entryTestImports)
  return newFile
}

module.exports = renderTestIndex
