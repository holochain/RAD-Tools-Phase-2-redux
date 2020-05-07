const ncp = require('ncp')
const fs = require('fs')
const chalk = require('chalk')
const renderSchema = require('./renderSchema')
const renderResolvers = require('./renderResolvers')
const renderHomePage = require('./renderHomePage')
const renderTypePage = require('./renderTypePage')
const renderIndex = require('./renderIndex')
const mapObject = require('./render-utils').mapObject
const typeSpecPath = process.argv[2]
const defaultTypeSpec = require('../../setup/type-specs/sample-type-spec.json')

let typeSpec
if (!typeSpecPath) {
  console.log(chalk.blue('> No type spec JSON file provided. \n  Using default type spec JSON file located within the setup directory.\n'))
  typeSpec = defaultTypeSpec
}
else {
  typespec = JSON.parse(fs.readFileSync(typeSpecPath))
}

const SOURCE_PATH = './src/ui-setup/ui-template'
const DESTINATION_PATH = './ui-src'

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

ncp(SOURCE_PATH, DESTINATION_PATH, err => {
  if (err) {
    console.error(err)
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
