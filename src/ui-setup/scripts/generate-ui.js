const fs = require('fs')
const fse = require('fs-extra')
const chalk = require('chalk')
const path = require('path')
const { exec } = require('child_process')
const renderSchema = require('./renderSchema')
const renderResolvers = require('./renderResolvers')
const renderHomePage = require('./renderHomePage')
const renderTypePage = require('./renderTypePage')
const renderTypePageTest = require('./renderTypePageTest')
const renderTypePageIntegrationTest = require('./renderTypePageIntegrationTest')
const renderIndex = require('./renderIndex')
const mapObject = require('./render-utils').mapObject
const typeSpecPath = process.argv[2]
const defaultTypeSpecPath = path.resolve('src/setup/type-specs', 'sample-type-spec.json')
const defaultTypeSpec = require(defaultTypeSpecPath)
const { capitalize, toCamelCase } = require('../../setup/utils.js')

// map over type spec to ensure the types are all capitalized before feeding the name to the UI generation
const capitalizeTypeNames = typeSpec => {
  const capitalizedTypeArray = mapObject(typeSpec.types, (typeName, type) => [capitalize(toCamelCase(typeName)), type])
  const rawTypeSpec = { types: Object.fromEntries(capitalizedTypeArray) }
  return rawTypeSpec
}

if (!typeSpecPath) {
  console.log(chalk.blue('> No type spec JSON file provided. \n Using default type spec JSON file located within the setup directory.\n'))
}

const rawTypeSpec = !typeSpecPath
  ? defaultTypeSpec
  :  JSON.parse(fs.readFileSync(typeSpecPath))
const typeSpec = capitalizeTypeNames(rawTypeSpec)

const SOURCE_PATH = './src/ui-setup/ui-template'
const DESTINATION_PATH = './happ/ui-src'

const SCHEMA_PATH = `${DESTINATION_PATH}/src/schema.js`
const RESOLVERS_PATH = `${DESTINATION_PATH}/src/resolvers.js`
const HOME_PAGE_PATH = `${DESTINATION_PATH}/src/HomePage.js`
const INDEX_PATH = `${DESTINATION_PATH}/src/index.js`
const PAGES_PATH = `${DESTINATION_PATH}/src/pages/`
const INTEGRATION_PATH = `${DESTINATION_PATH}/src/__integration_tests__/`

const renderers = [
  [renderSchema, SCHEMA_PATH],
  [renderResolvers, RESOLVERS_PATH],
  [renderHomePage, HOME_PAGE_PATH],
  [renderIndex, INDEX_PATH]
]

fse.copy(SOURCE_PATH, DESTINATION_PATH, err => {
  // if cannot find happ dir, throw specific error
  if (err && err[0].errno === -2) {
    throw new Error("Error: Missing happ directory.")
  } else if (err) {
    throw new Error(err)
  }

  renderers.forEach(([renderFunction, path]) =>
    fs.writeFileSync(path, renderFunction(typeSpec)))

  mapObject(typeSpec.types, generateTypePage)
  mapObject(typeSpec.types, generateTypePageTest)
  mapObject(typeSpec.types, generateTypePageIntegrationTest)
  console.log(`\n ${chalk.cyan.bold(' UI Generation Complete')} \n`)
})


function generateTypePage (typeName, type) {
  const path = PAGES_PATH + typeName + 'Page.js'
  fs.writeFileSync(path, renderTypePage(typeName, type))
}

function generateTypePageTest (typeName, type) {
  const path = PAGES_PATH + typeName + 'Page.test.js'
  fs.writeFileSync(path, renderTypePageTest(typeName, type))
}

function generateTypePageIntegrationTest (typeName, type) {
  const path = INTEGRATION_PATH + typeName + 'Page.integration.test.js'
  fs.writeFileSync(path, renderTypePageIntegrationTest(typeName, type))
}
