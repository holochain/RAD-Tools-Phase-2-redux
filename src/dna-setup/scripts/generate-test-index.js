const fs = require('fs')
const path = require('path')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  toSnakeCase,
  toCamelCase
} = require('../../utils.js')
const { ENTRY_TEST_IMPORTS, DNA_NAME } = require('../variables.js')

function generateTestIndex (dnaName, zomeEntryNames, testDir, DNA_SETUP_DIR) {
  const testIndexTemplatePath = path.resolve(`${DNA_SETUP_DIR}/test-template`, 'index.js');
  const testIndexTemplate = fs.readFileSync(testIndexTemplatePath, 'utf8')

  const dnaTitle = toCamelCase(dnaName)
  const entryTestImports = zomeEntryNames.map(zomeEntryName => renderTestEntryContent(zomeEntryName)).join('')  
  const completedTestIndex = generateTestIndexFile(testIndexTemplate, dnaTitle, entryTestImports)
  const writeTestIndex = fs.writeFileSync(`${testDir}/index.js`, completedTestIndex)
  return writeTestIndex
}
  
const renderTestEntryContent = zomeEntryName => `
require('./${toSnakeCase(zomeEntryName.toLowerCase())}')(orchestrator.registerScenario, conductorConfig)
  `
  
const generateTestIndexFile = (templateFile, dnaTitle, entryTestImports) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, DNA_NAME, dnaTitle)
  newFile = replaceContentPlaceHolders(newFile, ENTRY_TEST_IMPORTS, entryTestImports)
  return newFile
}

module.exports = generateTestIndex
