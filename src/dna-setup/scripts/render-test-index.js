const fs = require('fs')
const path = require('path')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  toSnakeCase,
  toCamelCase
} = require('../../utils.js')
const { ENTRY_TEST_IMPORTS, DNA_NAME } = require('../variables.js')

const testIndexTemplatePath = path.resolve("src/dna-setup/test-template", "index.js");
const testIndexTemplate = fs.readFileSync(testIndexTemplatePath, 'utf8')

function renderTestIndex (dnaName, zomeEntryNames, testDir) {
  const dnaTitle = toCamelCase(dnaName)
  const entryTestImports = zomeEntryNames.map(zomeEntryName => renderTestEntryContent(zomeEntryName)).join('')  
  const completedTestIndex = renderTestIndexFile(testIndexTemplate, dnaTitle, entryTestImports)
  const writeTestIndex = fs.writeFileSync(`${testDir}/index.js`, completedTestIndex)
  return writeTestIndex
}
  
const renderTestEntryContent = zomeEntryName => `
require('./${toSnakeCase(zomeEntryName.toLowerCase())}')(orchestrator.registerScenario, conductorConfig)
  `
  
const renderTestIndexFile = (templateFile, dnaTitle, entryTestImports) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, DNA_NAME, dnaTitle)
  newFile = replaceContentPlaceHolders(newFile, ENTRY_TEST_IMPORTS, entryTestImports)
  return newFile
}

module.exports = renderTestIndex
