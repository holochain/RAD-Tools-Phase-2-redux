const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders, mapFnOverObject, capitalize } = require('../../utils.js')
const { ENTRY_IMPORTS, ENTRY_DEFINITIONS, ENTRY_FUNCTION_DEFINITIONS } = require('../variables.js')
const zomeIndexTemplatePath = path.resolve("setup/dna-setup/zome-template", "index.rs");
const zomeIndexTemplate = fs.readFileSync(zomeIndexTemplatePath, 'utf8')


let zomeEntryImports, zomeEntryDefs, zomeEntryFns
const zomeIndexContents = [
  [() => zomeEntryImports, ENTRY_IMPORTS],
  [() => zomeEntryDefs, ENTRY_DEFINITIONS],
  [() => zomeEntryFns, ENTRY_FUNCTION_DEFINITIONS]
]

const cleanSlate = () => {
  zomeEntryImports = ''
  zomeEntryDefs = ''
  zomeEntryFns = ''
  return true
}

function renderZomeIndex (zomeName, zomeEntryTypes, zomeDir) {
  cleanSlate()
  mapFnOverObject(zomeEntryTypes, renderIndexContent)
  const completedZomeIndex = renderIndexFile(zomeIndexTemplate, zomeIndexContents)
  fs.writeFileSync(`${zomeDir}/lib.rs`, completedZomeIndex)
  return console.log(`\n========== Created ${zomeName}/lib.rs  ===========\n\n`)
}

const renderIndexContent = (zomeEntryType, zomeEntry) => {
  zomeEntryImports = zomeEntryImports.concat(renderZomeEntryImports(zomeEntryType))
  zomeEntryDefs = zomeEntryDefs.concat(renderZomeEntryDefs(zomeEntryType))
  zomeEntryFns = zomeEntryFns.concat(renderZomeEntryFns(zomeEntryType, zomeEntry))
  return zomeIndexContents
}

const renderIndexFile = (templateFile, zomeIndexContents) => {
  let newFile = templateFile
  zomeIndexContents.forEach(([zomeEntryContent, placeHolderContent]) => {
    newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })
  return newFile
}

const renderZomeEntryImports = zomeEntryType => {
  return `
use crate::${zomeEntryType.toLowerCase()}::${capitalize(zomeEntryType)}Entry;
use crate::${zomeEntryType.toLowerCase()}::${capitalize(zomeEntryType)};
pub mod ${zomeEntryType.toLowerCase()};
  `
}

const renderZomeEntryDefs = zomeEntryType => {
  return `
    #[entry_def]
    fn ${zomeEntryType.toLowerCase()}_def() -> ValidatingEntryType {
      ${zomeEntryType.toLowerCase()}::definition()
    }
  `
}

const renderZomeEntryFns = (zomeEntryType, { functions }) => {
  // { functions } placeholder for before type-schema format is updated :
  if(isEmpty(functions)) {
    functions = {
      "create": true,
      "get": true,
      "update": true,
      "remove": true,
      "list": true
    }
  }
  return mapFnOverObject(functions, renderFnDef, zomeEntryType).join('')
}


const renderFnDef = (crudFn, shouldFnRender, zomeEntryType) => {
  if (!shouldFnRender) return
  let args
  switch (crudFn) {
    case 'create': {
      args = `(${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry)`
      break
    }
    case 'get': {
      args = `(id: Address)`
      break
    }
    case 'update': {
      args = `(id: Address, ${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry)`
      break
    }
    case 'remove': {
      args =  `(id: Address)`
      break    
    }
    case 'list': {
      args = '()'
      break
    }
    default: return new Error(`Error: No CRUD function matched. CRUD fn received : ${crudFn}.`)
  }

  return `
    #[zome_fn("hc_public")]
    fn ${crudFn}_${zomeEntryType.toLowerCase()}${args} -> ZomeApiResult<${capitalize(zomeEntryType)}> {
        ${zomeEntryType.toLowerCase()}::handlers::${crudFn}_${zomeEntryType.toLowerCase()}(${zomeEntryType.toLowerCase()}_input)
    }
  `
}

module.exports = renderZomeIndex
