const fs = require('fs')
const path = require('path')
const { isEmpty } = require('lodash/fp')
const { replaceContentPlaceHolders,
  replaceNamePlaceHolders,
  mapOverObject,
  toSnakeCase,
  toCamelCase,
  capitalize
} = require('../../utils.js')
const {
  ENTRY_NAME,
  CRUD_DEFINITION
} = require('../variables.js')

const entryHandlersTemplatePath = path.resolve("src/dna-setup/zome-template/entry-template", "handlers.rs");
const entryHandlersTemplate = fs.readFileSync(entryHandlersTemplatePath, 'utf8')

function generateHandlers (zomeEntryName, zomeEntry) {
  const { crudDefs } = renderHandlersContent(zomeEntryName, zomeEntry)
  const completedHandlersFile = generateHandlersFile(entryHandlersTemplate, zomeEntryName, crudDefs)
  return completedHandlersFile
}

const renderHandlersContent = (zomeEntryName, zomeEntry) => {
  let { functions } = zomeEntry

  if (isEmpty(functions)) {
    functions = {
      create: true,
      get: true,
      update: true,
      delete: true,
      list: true
    }
  }

  const crudDefs = mapOverObject(functions, (crudFn, shouldFnRender) =>
    renderCrudDefinition(crudFn, shouldFnRender, zomeEntryName)).join('')
  return { crudDefs }
}

const generateHandlersFile = (templateFile, zomeEntryName, crudDefs, entryContents) => {
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)
  newFile = replaceContentPlaceHolders(newFile, CRUD_DEFINITION, crudDefs)

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

module.exports = generateHandlers
