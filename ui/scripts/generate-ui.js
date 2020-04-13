const typeSpecPath = process.argv[2]
const fs = require('fs')
const renderSchema = require('./renderSchema')
const renderResolvers = require('./renderResolvers')
const ncp = require('ncp')

const SOURCE_PATH = './ui/ui_scaffold'
const DESTINATION_PATH = './ui/generated_ui'
const SCHEMA_PATH = './ui/generated_ui/src/schema.js'
const RESOLVERS_PATH = './ui/generated_ui/src/resolvers.js'

const typeSpec = JSON.parse(fs.readFileSync(typeSpecPath))

ncp(SOURCE_PATH, DESTINATION_PATH, err => {
  if (err) {
    console.err(err)
    return
  }

  fs.writeFileSync(SCHEMA_PATH, renderSchema(typeSpec))
  fs.writeFileSync(RESOLVERS_PATH, renderResolvers(typeSpec))
})
