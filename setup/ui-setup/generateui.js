const typeSpec = require('../../setup/type-spec.json')
// const typeSpecPath = process.argv[2]
const fs = require('fs')
const renderSchema = require('./renderSchema')
const renderResolvers = require('./renderResolvers')
const renderHomePage = require('./renderHomePage')
const renderTypePage = require('./renderTypePage')
const renderIndex = require('./renderIndex')
const ncp = require('ncp')
const mapObject = require('./render-utils').mapObject

const SOURCE_PATH = './ui-setup/ui_template'
const DESTINATION_PATH = '../../ui-src'

const SCHEMA_PATH = `${DESTINATION_PATH}/src/schema.js`
const RESOLVERS_PATH = `${DESTINATION_PATH}/src/resolvers.js`
const HOME_PAGE_PATH = `${DESTINATION_PATH}/src/HomePage.js`
const INDEX_PATH = `${DESTINATION_PATH}/src/index.js`
const PAGES_PATH = `${DESTINATION_PATH}/src/pages/`

const renderers = [
  [renderSchema, SCHEMA_PATH],
  [renderResolvers, RESOLVERS_PATH],
  [renderHomePage, HOME_PAGE_PATH],
  [renderIndex, INDEX_PATH]
]

// const typeSpec = JSON.parse(fs.readFileSync(typeSpecPath))

ncp(SOURCE_PATH, DESTINATION_PATH, err => {
  if (err) {
    console.err(err)
    return
  }

  renderers.forEach(([renderFunction, path]) =>
    fs.writeFileSync(path, renderFunction(typeSpec)))

  mapObject(typeSpec.types, generateTypePage)
})

function generateTypePage (typeName, type) {
  const path = PAGES_PATH + typeName + 'sPage.js'
  fs.writeFileSync(path, renderTypePage(typeName, type))
}
