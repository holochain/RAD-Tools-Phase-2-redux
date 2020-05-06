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
  LINK_NAME_CONSTANTS,
  ANCHOR_DEFINITIONS,
  ANCHOR_NAME_CONSTANTS,
  CRUD_DEFINITION
} = require('../variables.js')

const entryHandlersTemplatePath = path.resolve("src/dna-setup/zome-template/entry-template", "handlers.rs");
const entryHandlersTemplate = fs.readFileSync(entryHandlersTemplatePath, 'utf8')

let linkNameConsts, anchorNameConsts, anchorDefs
const entryContents = [
  [() => linkNameConsts, LINK_NAME_CONSTANTS],
  [() => anchorDefs, ANCHOR_DEFINITIONS],
  [() => anchorNameConsts, ANCHOR_NAME_CONSTANTS]
]

// check to see if need for multiple zomes
const cleanSlate = () => {
  linkNameConsts = ['']
  anchorNameConsts = ['']      
  anchorDefs = ['']
  return entryContents
}

function renderHandlers (zomeEntryName, zomeEntry) {
  // cleanSlate()
  const { crudDefs } = renderHandlersContent(zomeEntryName, zomeEntry)
  const completedHandlersFile = renderHandlersFile(entryHandlersTemplate, zomeEntryName, crudDefs, entryContents)
  return completedHandlersFile
}

const renderHandlersContent = (zomeEntryName, zomeEntry) => {
  const { links, anchors } = zomeEntry
  let { functions } = zomeEntry
  
  if(!isEmpty(links)) {
    const entryLinks = Object.values(links)
    linkNameConsts = entryLinks.map(entryLink => mapFnOverObject(entryLink, renderLinkNameConstants).join('')[0])
  } else {
    // clear placeholders in template
    linkNameConsts = ['']
  }

  if(!isEmpty(anchors)) {
    const entryAnchors = Object.values(anchors)
    const { anchorNameConstants, anchorDefinitions} = entryAnchors.map(entryAnchor => mapFnOverObject(entryAnchor, renderEntryAnchor, zomeEntryName).join('')[0])
    anchorNameConsts = anchorNameConstants
    anchorDefs = anchorDefinitions
  } else {
    // clear placeholder in template
    anchorNameConsts = ['']
    anchorDefs = ['']
  }
  
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
  crudDefs = mapFnOverObject(functions, renderCrudDefinition, zomeEntryName).join('')
  // console.log(' >>> linkNameConsts', linkNameConsts)
  // console.log(' >>> anchorNameConsts', anchorNameConsts)
  // console.log(' >>> anchorDefs', anchorDefs)
  return { entryContents, crudDefs }
}

const renderHandlersFile = (templateFile, zomeEntryName, crudDefs, entryContents) => {  
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)
  newFile = replaceContentPlaceHolders(newFile, CRUD_DEFINITION, crudDefs)

  for (let [zomeEntryContentArrState, placeHolderContent] of entryContents) {
    const zomeEntryContentArr = zomeEntryContentArrState()
    for (let zomeEntryContent of zomeEntryContentArr) {
      newFile = replaceContentPlaceHolders(newFile, placeHolderContent, zomeEntryContent)
    }
  }

  return newFile
}

const renderCrudDefinition = (crudFn, shouldFnRender, zomeEntryName) => {
  if (!shouldFnRender) return

  let crudDef = ''
  switch (crudFn) {
    case 'create': {
      const createFn = `
      pub fn create_${toSnakeCase(zomeEntryName).toLowerCase()}(${toSnakeCase(zomeEntryName).toLowerCase()}_entry: ${capitalize(toCamelCase(zomeEntryName))}Entry) -> ZomeApiResult<${capitalize(toCamelCase(zomeEntryName))}> {
          let entry = Entry::App(${toSnakeCase(zomeEntryName).toUpperCase()}_ENTRY_NAME.into(), ${toSnakeCase(zomeEntryName).toLowerCase()}_entry.clone().into());
          let address = hdk::commit_entry(&entry)?;
          hdk::link_entries(&${toSnakeCase(zomeEntryName).toLowerCase()}_anchor()?, &address, ${toSnakeCase(zomeEntryName).toUpperCase()}_LINK_TYPE, "")?;
          ${capitalize(toCamelCase(zomeEntryName))}::new(address, ${toSnakeCase(zomeEntryName).toLowerCase()}_entry)
      }
      `
      crudDef = crudDef + createFn
      break
    }
    case 'get': {
      const get = `
      pub fn ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}(id: Address) -> ZomeApiResult<${capitalize(toCamelCase(zomeEntryName))}> {
          let ${toSnakeCase(zomeEntryName).toLowerCase()}: ${capitalize(toCamelCase(zomeEntryName))}Entry = hdk::utils::get_as_type(id.clone())?;
          ${capitalize(toCamelCase(zomeEntryName))}::new(id, ${toSnakeCase(zomeEntryName).toLowerCase()})
      }
      `
      crudDef = crudDef + get
      break
    }
    case 'update': {
      const updateFn = `
      pub fn ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}(id: Address, ${toSnakeCase(zomeEntryName).toLowerCase()}_input: ${capitalize(toCamelCase(zomeEntryName))}Entry) -> ZomeApiResult<${capitalize(toCamelCase(zomeEntryName))}> {
          let address = match hdk::get_entry(&id.clone())? {
              None => id.clone(),
              Some(entry) => entry.address()
          };
          hdk::update_entry(Entry::App(${toSnakeCase(zomeEntryName).toUpperCase()}_ENTRY_NAME.into(), ${toSnakeCase(zomeEntryName).toLowerCase()}_input.clone().into()), &address)?;
          ${capitalize(toCamelCase(zomeEntryName))}::new(id, ${toSnakeCase(zomeEntryName).toLowerCase()}_input)
      }
      `
      crudDef = crudDef + updateFn
      break
    }
    case 'delete': {
      const deleteFn = `
      pub fn ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}(id: Address) -> ZomeApiResult<Address> {
          hdk::remove_link(&${toSnakeCase(zomeEntryName).toLowerCase()}_anchor()?, &id, ${toSnakeCase(zomeEntryName).toUpperCase()}_LINK_TYPE, "")?;
          hdk::remove_entry(&id)
      }
      `
      crudDef = crudDef + deleteFn
      break
    }
    case 'list': {
      const listFn = `
      pub fn ${toSnakeCase(crudFn).toLowerCase()}_${toSnakeCase(zomeEntryName).toLowerCase()}s() -> ZomeApiResult<Vec<${capitalize(toCamelCase(zomeEntryName))}>> {
          hdk::get_links_and_load(&${toSnakeCase(zomeEntryName).toLowerCase()}_anchor()?, LinkMatch::Exactly(${toSnakeCase(zomeEntryName).toUpperCase()}_LINK_TYPE), LinkMatch::Any)
              .map(|${toSnakeCase(zomeEntryName).toLowerCase()}_list|{
                  ${toSnakeCase(zomeEntryName).toLowerCase()}_list.into_iter()
                      .filter_map(Result::ok)
                      .flat_map(|entry| {
                          let id = entry.address();
                          hdk::debug(format!("list_entry{:?}", entry)).ok();
                          get_${toSnakeCase(zomeEntryName).toLowerCase()}(id)
                      }).collect()
              })
      }
      `
      crudDef = crudDef + listFn
      break
    }
    default: throw new Error(`Error: Found invalid CRUD function for validation. CRUD fn received : ${toSnakeCase(crudFn).toLowerCase()}.`)
  }
  return crudDef
}

const renderLinkNameConstants = (linkDetailName, linkDetailValue) => {
  let linkTypeName, linkTagName
  switch (linkDetailName) {
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
    default: return new Error(`Error: Did not receive expected entry link Detail to form link constants : ${linkDetailName}.`)
  }

  const linkNameConstants = `
  const ${toSnakeCase(linkTypeName).toUpperCase()}_LINK_TYPE,
  const ${toSnakeCase(linkTagName).toUpperCase()}_LINK_TAG,
  `
  return linkNameConstants
}

const renderAnchorNameConstants = (anchorDetailName, anchorDetailValue) => {
  let anchorType, anchorTag
  switch (anchorDetailName) {
    case 'anchor_type_name': {
      anchorType = anchorDetailValue
      break
    }
    case 'anchor_tag_name': {
      // NB: Anchor tags can be blank/null
      if (isNil(anchorDetailValue)) {
        anchorTag = ""
      } else {
        anchorTag = anchorDetailValue
      }
      break
    }
    
    default: return new Error(`Error: Received unexpected entry link Detail : ${anchorDetailName}.`)
  }
  const anchorTypeName = `${toSnakeCase(anchorType).toUpperCase()}_ANCHOR_TYPE`
  const anchorTagName = `${toSnakeCase(anchorTag).toUpperCase()}_ANCHOR_TEXT`
  const anchorNameConstants = anchorTagName + ',\n' + anchorTypeName + ','
  return {
    anchorNameConstants,
    anchorTypeName,
    anchorTagName
  }
}

const renderAnchorDefinition = (zomeEntryName, anchorTypeName, anchorTagName) => {
   const anchorDefinition = `
  fn ${zomeEntryName}_anchor() -> ZomeApiResult<Address> {
      anchor(${anchorTypeName}.to_string(), ${anchorTagName}.to_string())
  }
  `
  return anchorDefinition
}

renderEntryAnchor = (anchorDetailName, anchorDetailValue, zomeEntryName) => {
  const { anchorTypeName, anchorTagName, anchorNameConstants} = renderAnchorNameConstants(anchorDetailName, anchorDetailValue)
  const anchorDefinitions = renderAnchorDefinition(zomeEntryName, anchorTypeName, anchorTagName)
  return { anchorDefinitions, anchorNameConstants }
}

module.exports = renderHandlers
