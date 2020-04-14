const typeSpecPath = process.argv[2]
const fs = require('fs')
const renderSchema = require('./renderSchema')
const renderResolvers = require('./renderResolvers')
const renderGeneratedHapp = require('./renderGeneratedHapp')
const renderTypePage = require('./renderTypePage')
const ncp = require('ncp')
const mapObject = require('./render-utils').mapObject

const SOURCE_PATH = './ui/ui_template'
const DESTINATION_PATH = './ui/generated_ui'

const SCHEMA_PATH = './ui/generated_ui/src/schema.js'
const RESOLVERS_PATH = './ui/generated_ui/src/resolvers.js'
const GENERATED_HAPP_PATH = './ui/generated_ui/src/GeneratedHapp.js'
const PAGES_PATH = './ui/generated_ui/src/pages/'

const renderers = [
  [renderSchema, SCHEMA_PATH],
  [renderResolvers, RESOLVERS_PATH],
  [renderGeneratedHapp, GENERATED_HAPP_PATH]
]

const typeSpec = JSON.parse(fs.readFileSync(typeSpecPath))

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
