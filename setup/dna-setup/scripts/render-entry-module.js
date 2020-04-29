const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapFnOverObject,
  toSnakeCase,
  capitalize
} = require('../../utils.js')
const {
  ENTRY_NAME,
  ENTRY_DEFINITION,
  ENTRY_DESCRIPTION,
  SHARING_TYPE,
  CRUD_VALIDATION_DEFINITION,
  LINK_DEFINITION,
  LINK_NAME_DEFINITIONS,
  ANCHOR_NAME_DEFINITIONS
} = require('../variables/index')
const entryModTemplatePath = path.resolve("setup/dna-setup/zome-template/entry-template", "mod.rs");
const entryModTemplate = fs.readFileSync(entryModTemplatePath, 'utf8')

let entryDef, entryDescription, sharingType, crudValidationDefs
const entryContents = [
  [() => entryDef, ENTRY_DEFINITION],
  [() => entryDescription, ENTRY_DESCRIPTION],
  [() => sharingType, SHARING_TYPE],
  [() => crudValidationDefs, CRUD_VALIDATION_DEFINITION]
]

let linkDef, linkNameDefs, anchorNameDefs
const bulkEntryContents = [
  [() => anchorNameDefs, ANCHOR_NAME_DEFINITIONS],
  [() => linkDef, LINK_DEFINITION],
  [() => linkNameDefs, LINK_NAME_DEFINITIONS]
]

function renderMod (zomeEntryName, zomeEntry) {
  renderModContent(zomeEntry, zomeEntryName)
  const completedModFile = renderModFile(entryModTemplate, zomeEntryName, entryContents, bulkEntryContents)
  return completedModFile
}

const renderEntryDef = (entryDefName, entryDefType) => `  ${entryDefName}: ${entryDefType},`

const renderCrudValDefs = (crudFn, shouldFnRender) => {
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
    case 'remove': {
      validationParams =  `old_entry, old_entry_header, validation_data`
      break    
    }
    default: return new Error(`Error: Found invalid CRUD function for validation. CRUD fn received : ${crudFn}.`)
  }
  
  return `
          hdk::EntryValidationData::${capitalize(crudFn)}{${validationParams}} =>
          {
              validation::validate_entry_${toSnakeCase(crudFn).toLowerCase()}(${validationParams})
          }
  `
}

const renderEntryLink = (linkDetailName, linkDetailValue) => {
  let linkTypeName, linkTagName, linkDirection, linkedEntryType
  switch (linkDetailName) {
    case 'linked_entry_type': {
      linkedEntryType = linkDetailValue
      // TODO: Type check the value for linked_entry_type to ensure that this is either an anchor, agentId, or entry
      // ie: anchor (import crate): `holochain_anchors::ANCHOR_TYPE,`
      //     agentId (constant): "%agent_id"
      // or  entry(declared as module in Zome): eg: "notes_entry"
      //
      // NB: If type is agentId or entry, the value MUST be a string...
      break
    }
    case 'link_type_name': {
      linkTypeName = linkDetailValue
      break
    }
    case 'link_tag_name': {
      // NB: Link tags can be blank/null
      if (isNil(linkDetailValue)) {
        linkTagName = ""
      } else {
        linkTagName = linkDetailValue
      }
      break
    }
    case 'direction': {
      linkDirection = linkDetailValue
      break    
    }

    default: return new Error(`Error: Received unexpected entry link Detail : ${linkDetailName}.`)
  }
  const linkNameDefinition = `
  const ${toSnakeCase(linkTypeName).toUpperCase()}_LINK_TYPE: &str = "${toSnakeCase(linkTypeName).toLowerCase}_link";
  const ${toSnakeCase(linkTagName).toUpperCase()}_LINK_TAG: &str = "${toSnakeCase(linkTagName).toLowerCase}";
  `
  const linkDefinition = `,
  ${linkDirection}!(
    ${linkedEntryType},
    link_type: ${toSnakeCase(linkTypeName).toUpperCase()}}_LINK_TYPE,
  
    validation_package: || {
        hdk::ValidationPackageDefinition::Entry
    },
  
    validation: | _validation_data: hdk::LinkValidationData | {
        Ok(())
    }
  )
  `
    console.log(' >>> linkNameDefinition', linkNameDefinition)
    console.log(' <<<<<< linkDefinition', linkDefinition)

  // linkDef = linkDefinition
  // linkNameDefs = linkNameDefinition
  return [linkDefinition, linkNameDefinition]
}

const renderEntryAnchor = (anchorDetailName, anchorDetailValue) => {
  let anchorId, anchorTypeName, anchorTagName
  switch (anchorDetailName) {
    case 'anchor_id': {
      anchorId = anchorDetailValue
      break
    }
    case 'anchor_type_name': {
      anchorTypeName = anchorDetailValue
      break
    }
    case 'anchor_tag_name': {
      // NB: Anchor tags can be blank/null
      if (isNil(anchorDetailValue)) {
        anchorTagName = ""
      } else {
        anchorTagName = anchorDetailValue
      }
      break
    }
    
    default: return new Error(`Error: Received unexpected entry link Detail : ${anchorDetailName}.`)
  }
  const anchorNameDefinition = `
  const ${toSnakeCase(anchorTypeName).toUpperCase()}_ANCHOR_TYPE: &str = "${toSnakeCase(anchorTypeName).toLowerCase}_anchor";
  const ${toSnakeCase(anchorTagName).toUpperCase()}_ANCHOR_TEXT: &str = "${toSnakeCase(anchorTagName).toLowerCase}";
  `
  // anchorNameDefs = anchorNameDefinition
  return anchorNameDefinition
}

const renderModContent = (zomeEntry, zomeEntryName) => {
  const { sharing, description, links, anchors } = zomeEntry
  let { definition, functions } = zomeEntry
  
  if(!isEmpty(links)) {
    const entryLinks = Object.values(links)
    const [linkDefinition, linkNameDefinition] = entryLinks.map(entryLink => mapFnOverObject(entryLink, renderEntryLink).join(''))
    
    console.log(' >>> linkNameDefinition', linkNameDefinition)
    console.log(' <<<<<< linkDefinition', linkDefinition)

    linkDef = linkDefinition
    linkNameDefs = linkNameDefinition
  } else {
    // clear placeholders in template
    linkNameDefs = [['']]
    linkDef = [['']]
  }

  if(!isEmpty(anchors)) {
    const entryAnchors = Object.values(anchors)
    const anchorNameDefinition = entryAnchors.map(entryAnchor => mapFnOverObject(entryAnchor, renderEntryAnchor).join(''))
    console.log('anchorNameDefinition : ', anchorNameDefinition)
    anchorNameDefs = anchorNameDefinition
  } else {
    // clear placeholder in template
    anchorNameDefs = [['']]
  }
  
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
  // { definition } placeholder for before type-schema format is updated :
  if(isEmpty(definition)) {
    const entryDefinitionFields =  { ...zomeEntry, description, sharing }
    console.log('entryDefinitionFields : ', entryDefinitionFields)
    definition = { entryDefinitionFields }
  }

  entryName = zomeEntryName
  sharingType = capitalize(sharing.toLowerCase())
  entryDescription = description
  crudValidationDefs = mapFnOverObject(functions, renderCrudValDefs).join('')
  entryDef = mapFnOverObject(definition, renderEntryDef).join('\n')

  return entryContents
}


const renderModFile = (templateFile, zomeEntryName, entryContents, bulkEntryContents) => {  
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)

  entryContents.forEach(([zomeEntryContent, placeHolderContent]) => {
      newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })

  bulkEntryContents.forEach(([zomeEntryContentArrayFn, placeHolderContent]) => {
    const zomeEntryContentArray = zomeEntryContentArrayFn()
    zomeEntryContentArray.forEach(zomeEntryContent => {
      const zomeEntryValue = zomeEntryContent[0]
      newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryValue)
      // refresh placeholders in template
      linkNameDefs = [['']]
      linkDef = [['']]
      anchorNameDefs = [['']]
    })
  })
  return newFile
}

module.exports = renderMod
  