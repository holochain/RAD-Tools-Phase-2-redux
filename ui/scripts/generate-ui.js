const typeSpecPath = process.argv[2]

if (!typeSpecPath) throw new Error('Please specify a path for your type spec JSON file')

const fs = require('fs')
const renderSchema = require('./renderSchema')
const renderResolvers = require('./renderResolvers')
const renderHomePage = require('./renderHomePage')
const renderTypePage = require('./renderTypePage')
const renderTypePageTest = require('./renderTypePageTest')
const renderIndex = require('./renderIndex')
const renderMockData = require('./renderMockData')
const ncp = require('ncp')
const mapObject = require('./render-utils').mapObject

const SOURCE_PATH = './ui/ui_template'
const DESTINATION_PATH = './ui/generated_ui'

const SCHEMA_PATH = './ui/generated_ui/src/schema.js'
const RESOLVERS_PATH = './ui/generated_ui/src/resolvers.js'
const HOME_PAGE_PATH = './ui/generated_ui/src/HomePage.js'
const INDEX_PATH = './ui/generated_ui/src/index.js'
const MOCK_DATA_PATH = './ui/generated_ui/src/mock-dnas/mockData.js'
const PAGES_PATH = './ui/generated_ui/src/pages/'

const renderers = [
  [renderSchema, SCHEMA_PATH],
  [renderResolvers, RESOLVERS_PATH],
  [renderHomePage, HOME_PAGE_PATH],
  [renderIndex, INDEX_PATH],
  [renderMockData, MOCK_DATA_PATH]
]

const typeSpec = JSON.parse(fs.readFileSync(typeSpecPath))

ncp(SOURCE_PATH, DESTINATION_PATH, err => {
  if (err) {
    console.err(err)
    return
  }

  renderers.forEach(([renderFunction, path]) =>
    fs.writeFileSync(path, renderFunction(typeSpec)))

  mapObject(typeSpec.types, generateTypePageAndTests)
})

function generateTypePageAndTests (typeName, type) {
  const pagePath = PAGES_PATH + typeName + 'sPage.js'
  fs.writeFileSync(pagePath, renderTypePage(typeName, type))
  const testPath = PAGES_PATH + typeName + 'sPage.test.js'
  fs.writeFileSync(testPath, renderTypePageTest(typeName, type))
}
