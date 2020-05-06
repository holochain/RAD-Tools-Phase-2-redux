const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceNamePlaceHolders, replaceContentPlaceHolders, mapFnOverObject, capitalize } = require('../../utils.js')
const { ZOME_NAME, ENTRY_IMPORTS, ENTRY_DEFINITIONS, ENTRY_FUNCTION_DEFINITIONS } = require('../variables.js')
const zomeIndexTemplatePath = path.resolve("src/dna-setup/zome-template", "index.rs");
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
}

function renderZomeIndex (zomeName, zomeEntryTypes, zomeDir) {
  cleanSlate()
  mapFnOverObject(zomeEntryTypes, renderIndexContent)
  const completedZomeIndex = renderIndexFile(zomeIndexTemplate, zomeIndexContents, zomeName)
  fs.writeFileSync(`${zomeDir}/lib.rs`, completedZomeIndex)
  return console.log(`\n========== Created ${zomeName}/lib.rs  ===========\n\n`)
}

const renderIndexContent = (zomeEntryType, zomeEntry) => {
  zomeEntryImports = zomeEntryImports.concat(renderZomeEntryImports(zomeEntryType))
  zomeEntryDefs = zomeEntryDefs.concat(renderZomeEntryDefs(zomeEntryType))
  zomeEntryFns = zomeEntryFns.concat(renderZomeEntryFns(zomeEntryType, zomeEntry))
  return zomeIndexContents
}

const renderIndexFile = (templateFile, zomeIndexContents, zomeName) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ZOME_NAME, zomeName)
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
      "delete": true,
      "list": true
    }
  }
  return mapFnOverObject(functions, renderFnDef, zomeEntryType).join('')
}


const renderFnDef = (crudFn, shouldFnRender, zomeEntryType) => {
  if (!shouldFnRender) return
  let args, returnType
  switch (crudFn) {
    case 'create': {
      args = `(${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry)`
      returnType = `${capitalize(zomeEntryType)}`
      zomeEntryFnName = `${crudFn}_${zomeEntryType.toLowerCase()}`
      zomeEntryFnParams = `${zomeEntryType.toLowerCase()}_input`
      break
    }
    case 'get': {
      args = `(id: Address)`
      returnType = `${capitalize(zomeEntryType)}`
      zomeEntryFnName = `${crudFn}_${zomeEntryType.toLowerCase()}`
      zomeEntryFnParams = `id`
      break
    }
    case 'update': {
      args = `(id: Address, ${zomeEntryType.toLowerCase()}_input: ${capitalize(zomeEntryType)}Entry)`
      returnType = `${capitalize(zomeEntryType)}`
      zomeEntryFnName = `${crudFn}_${zomeEntryType.toLowerCase()}`
      zomeEntryFnParams = `id, ${zomeEntryType.toLowerCase()}_input`
      break
    }
    case 'delete': {
      args =  `(id: Address)`
      returnType = 'Address'
      zomeEntryFnName = `${crudFn}_${zomeEntryType.toLowerCase()}`
      zomeEntryFnParams = `id`
      break    
    }
    case 'list': {
      args = '()'
      returnType = `Vec<${capitalize(zomeEntryType)}>`
      zomeEntryFnName = `${crudFn}_${zomeEntryType.toLowerCase()}s`
      zomeEntryFnParams = ``
      break
    }
    default: return new Error(`Error: No CRUD function matched. CRUD fn received : ${crudFn}.`)
  }

  return `
    #[zome_fn("hc_public")]
    fn ${zomeEntryFnName}${args} -> ZomeApiResult<${returnType}> {
        ${zomeEntryType.toLowerCase()}::handlers::${zomeEntryFnName}(${zomeEntryFnParams})
    }
  `
}

module.exports = renderZomeIndex
