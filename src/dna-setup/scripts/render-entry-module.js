const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapFnOverObject,
  toSnakeCase,
  toCamelCase,
  capitalize
} = require('../../utils.js')
const {
  ENTRY_NAME,
  ENTRY_DEFINITION,
  ENTRY_DEFINITION_IMPLEMENTATION,
  ENTRY_DESCRIPTION,
  SHARING_TYPE,
  ENTRY_VALIDATION_DEFINITIONS,
  LINK_DEFINITION,
  LINK_NAME_DEFINITIONS,
  ANCHOR_NAME_DEFINITIONS
} = require('../variables.js')

const entryModTemplatePath = path.resolve("src/dna-setup/zome-template/entry-template", "mod.rs");
const entryModTemplate = fs.readFileSync(entryModTemplatePath, 'utf8')

let entryDef, entryDefImpl = '', entryDescription, sharingType, entryValidationDefs
const entryContents = [
  [() => entryDef, ENTRY_DEFINITION],
  [() => entryDefImpl, ENTRY_DEFINITION_IMPLEMENTATION],
  [() => entryDescription, ENTRY_DESCRIPTION],
  [() => sharingType, SHARING_TYPE],
  [() => entryValidationDefs, ENTRY_VALIDATION_DEFINITIONS]
]

let linkDefs, linkNameDefs, anchorNameDefs
const bulkEntryContents = [
  [() => linkDefs, LINK_DEFINITION],
  [() => linkNameDefs, LINK_NAME_DEFINITIONS],
  [() => anchorNameDefs, ANCHOR_NAME_DEFINITIONS]
]

// check to see if need for multiple zomes
const cleanSlate = () => {
  linkNameDefs = ['']
  linkDefs = ['']
  anchorNameDefs = ['']
  entryDef = ''
  entryDefImpl = ''
  entryDescription = ''
  sharingType = ''
  entryValidationDefs = ''
  return entryContents
}

function renderMod (zomeEntryName, zomeEntry) {
  // cleanSlate()
  renderModContent(zomeEntryName, zomeEntry)
  const completedModFile = renderModFile(entryModTemplate, zomeEntryName, entryContents, bulkEntryContents)
  return completedModFile
}

const renderModContent = (zomeEntryName, zomeEntry) => {
  const { sharing, description, links, anchors } = zomeEntry
  let { definition, functions } = zomeEntry
  
  if(!isEmpty(links)) {
    const entryLinks = Object.values(links)
    const { linkDefinition, linkNameDefinition } = entryLinks.map(entryLink => mapFnOverObject(entryLink, renderLink).join('')[0])
    linkDefs = linkDefinition
    linkNameDefs = linkNameDefinition
  } else {
    // clear placeholders in template
    linkNameDefs = ['']
    linkDefs = ['']
  }

  if(!isEmpty(anchors)) {
    const entryAnchors = Object.values(anchors)
    const anchorNameDefinition = entryAnchors.map(entryAnchor => mapFnOverObject(entryAnchor, renderAnchorNameDefinitions).join('')[0])
    
    console.log('anchorNameDefinition : ', anchorNameDefinition)
    anchorNameDefs = anchorNameDefinition
  } else {
    // clear placeholder in template
    anchorNameDefs = ['']
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
    definition = { entryDefinitionFields }
  }

  sharingType = capitalize(sharing.toLowerCase())
  entryDescription = description
  entryValidationDefs = mapFnOverObject(functions, renderCrudValidationDefinition).join('')
  entryDef = mapFnOverObject(definition, renderEntryDefinition).join('')
  entryDefImpl = mapFnOverObject(definition, renderEntryDefinitionImplementation, zomeEntryName).join('')
  return { entryContents, bulkEntryContents }
}

const renderModFile = (templateFile, zomeEntryName, entryContents, bulkEntryContents) => {  
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)

  entryContents.forEach(([zomeEntryContent, placeHolderContent]) => {
      newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContent)
  })

  for (let [zomeEntryContentArrState, placeHolderContent] of bulkEntryContents) {
    const zomeEntryContentArray = zomeEntryContentArrState()
    for (let zomeEntryContent of zomeEntryContentArray) {
      const zomeEntryValue = zomeEntryContent
      newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryValue)     
    }
  }
  return newFile
}

const renderEntryDefinition = (entryDefName, entryDefType) => {
  return `
    ${entryDefName}: ${entryDefType},
  `
}

const renderEntryDefinitionImplementation = (entryDefName, entryDefType, zomeEntryName) => {
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
    case 'remove': {
      validationParams =  `old_entry, old_entry_header, validation_data`
      break    
    }
    default: return new Error(`Error: Found invalid CRUD function for validation. CRUD fn received : ${crudFn}.`)
  }

  return `
    hdk::EntryValidationData::${capitalize(toCamelCase(crudFn))}{${validationParams}} =>
    {
        validation::validate_entry_${toSnakeCase(crudFn).toLowerCase()}(${validationParams})
    }
  `
}

const renderLink = (linkDetailName, linkDetailValue) => {
  let linkTypeName, linkTagName, linkDirection, linkedEntryType
  switch (linkDetailName) {
    case 'linked_entry_type': {
      linkedEntryType = linkDetailValue
      // TODO: Validation/Type check the value for linked_entry_type to ensure that this is either an anchor, agentId, or entry
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
  return { linkDefinition, linkNameDefinition }
}

const renderAnchorNameDefinitions = (anchorDetailName, anchorDetailValue) => {
  let anchorTypeName, anchorTagName
  switch (anchorDetailName) {
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
  return anchorNameDefinition
}

module.exports = renderMod
