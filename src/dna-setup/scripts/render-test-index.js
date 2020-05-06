const fs = require('fs')
const path = require('path')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapFnOverObject,
  toSnakeCase,
  toCamelCase
} = require('../../utils.js')
const { ENTRY_TEST_IMPORTS, DNA_NAME } = require('../variables.js')

const testIndexTemplatePath = path.resolve("src/dna-setup/test-template", "index.js");
const testIndexTemplate = fs.readFileSync(testIndexTemplatePath, 'utf8')
let testImports = ''

function renderTestIndex (dnaName, zomeEntryNames, testDir) {
  const dnaTitle = toCamelCase(dnaName)
  const entryTestImports = mapFnOverObject(zomeEntryNames, renderTestEntryContent, testImports)
  const completedTestIndex = renderTestEntryFile(testIndexTemplate, dnaTitle, entryTestImports)
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
  
const renderTestEntryFile = (templateFile, dnaTitle, entryTestImports) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, DNA_NAME, dnaTitle)
  newFile = replaceContentPlaceHolders(newFile, ENTRY_TEST_IMPORTS, entryTestImports)
  return newFile
}

module.exports = renderTestIndex
