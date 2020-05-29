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
const { capitalize } = require('../../setup/utils.js')

let typeSpec
if (!typeSpecPath) {
  console.log(chalk.blue('> No type spec JSON file provided. \n  Using default type spec JSON file located within the setup directory.\n'))
  typeSpec = defaultTypeSpec
} else {
  typeSpec = JSON.parse(fs.readFileSync(typeSpecPath))
}

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
  //if cannot find happ dir, create one and signal error
  if (err && err[0].errno === -2) {
    exec('[ ! -d ./happ ] && mkdir ./happ', (error, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
      } else if (stderr) {
        console.error(`stderr: ${stderr}`)
      } else {
        console.error("Error: Missing happ directory.\n\nNote: A new happ directory has now been pre-populated for you.  Please run 'ui:generate' once again to generate the ui.")
      }
    })
    return
  } else if (err) {
    console.error(err)
    return
  }

  renderers.forEach(([renderFunction, path]) =>
    fs.writeFileSync(path, renderFunction(typeSpec)))

  mapObject(typeSpec.types, generateTypePage)
  mapObject(typeSpec.types, generateTypePageTest)
  mapObject(typeSpec.types, generateTypePageIntegrationTest)
  console.log(`\n ${chalk.cyan.bold(' UI Generation Complete')} \n`)
})


function generateTypePage (typeName, type) {
  const path = PAGES_PATH + capitalize(typeName) + 'Page.js'
  fs.writeFileSync(path, renderTypePage(typeName, type))
}

function generateTypePageTest (typeName, type) {
  const path = PAGES_PATH + capitalize(typeName) + 'Page.test.js'
  fs.writeFileSync(path, renderTypePageTest(typeName, type))
}

function generateTypePageIntegrationTest (typeName, type) {
  const path = INTEGRATION_PATH + capitalize(typeName) + 'Page.integration.test.js'
  fs.writeFileSync(path, renderTypePageIntegrationTest(typeName, type))
}
