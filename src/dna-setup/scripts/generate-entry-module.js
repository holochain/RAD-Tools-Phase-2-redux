const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapOverObject,
  toSnakeCase,
  toCamelCase,
  capitalize
} = require('../../setup/utils.js')
const {
  ENTRY_NAME,
  ENTRY_DEFINITION,
  ENTRY_DEFINITION_IMPLEMENTATION,
  ENTRY_DESCRIPTION,
  SHARING_TYPE,
  ENTRY_VALIDATION_DEFINITIONS
} = require('../variables.js')

const entryModTemplatePath = path.resolve("src/dna-setup/zome-template/entry-template", "mod.rs");
const entryModTemplate = fs.readFileSync(entryModTemplatePath, 'utf8')

let entryDef, entryDescription, sharingType, entryValidationDefs
let entryDefImpl = ''

const entryContents = [
  [() => entryDef, ENTRY_DEFINITION],
  [() => entryDefImpl, ENTRY_DEFINITION_IMPLEMENTATION],
  [() => entryDescription, ENTRY_DESCRIPTION],
  [() => sharingType, SHARING_TYPE],
  [() => entryValidationDefs, ENTRY_VALIDATION_DEFINITIONS]
]

function generateMod (zomeEntryName, zomeEntry) {
  renderModContent(zomeEntryName, zomeEntry)
  const completedModFile = generateModFile(entryModTemplate, zomeEntryName)
  return completedModFile
}

const renderModContent = (zomeEntryName, zomeEntry) => {
  const { sharing, description } = zomeEntry
  let { definition, functions } = zomeEntry

  // { functions } placeholder for before type-schema format is updated :
  if (isEmpty(functions)) {
    functions = {
      create: true,
      get: true,
      update: true,
      delete: true,
      list: true
    }
  }
  // { definition } placeholder for before type-schema format is updated :
  if (isEmpty(definition)) {
    const entryDefinitionFields =  { ...zomeEntry, description, sharing }
    definition = { entryDefinitionFields }
  }

  sharingType = capitalize(sharing.toLowerCase())
  entryDescription = description
  entryValidationDefs = mapOverObject(functions, renderCrudValidationDefinition).join('')
  entryDef = mapOverObject(definition, renderEntryDefinition).join('')
  entryDefImpl = mapOverObject(definition, entryDefName =>
    renderEntryDefinitionImplementation(entryDefName, zomeEntryName)).join('')
}

const generateModFile = (templateFile, zomeEntryName) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)

  entryContents.forEach(([zomeEntryContent, placeHolderContent]) => {
    newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })

  return newFile
}

const renderEntryDefinition = (entryDefName, entryDefType) => {
  return `
    ${entryDefName}: ${capitalize(entryDefType.toLowerCase())},
  `
}

const renderEntryDefinitionImplementation = (entryDefName, zomeEntryName) => {
  return `
    ${entryDefName}: ${zomeEntryName}_entry.${entryDefName},
  `
}

const renderCrudValidationDefinition = (crudFn, shouldFnRender) => {
  if (!shouldFnRender) return
  else if (crudFn === "get" || crudFn === "list") return
    
  let validationParams
  switch (crudFn) {
    case 'create': {
      validationParams = `entry, validation_data`
      break
    }
    case 'update': {
      validationParams = `new_entry, old_entry, old_entry_header, validation_data`
      break
    }
    case 'delete': {
      validationParams =  `old_entry, old_entry_header, validation_data`
      break    
    }
    default: throw new Error(`Error: Found invalid CRUD function for validation. CRUD fn received : ${crudFn}.`)
  }

  // todo: look into spacing/indentation normalization (linter doesn't handle this)
  return `
              hdk::EntryValidationData::${capitalize(toCamelCase(crudFn === 'update' ? 'modify' : crudFn))}{${validationParams}} =>
              {
                  validation::validate_entry_${toSnakeCase(crudFn).toLowerCase()}(${validationParams})
              }
  `
}

module.exports = generateMod
