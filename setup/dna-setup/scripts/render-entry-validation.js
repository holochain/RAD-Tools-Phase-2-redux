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
const { ENTRY_NAME, CRUD_VALIDATION_DEFINITIONS } = require('../variables.js')

const entryValidationTemplatePath = path.resolve("setup/dna-setup/zome-template/entry-template", "validation.rs");
const entryValidationTemplate = fs.readFileSync(entryValidationTemplatePath, 'utf8')

function renderValidation (zomeEntryName, zomeEntry) {
  const crudValidationDefs = renderValidationContent(zomeEntry, zomeEntryName)
  const completedValidationFile = renderValidationFile(entryValidationTemplate, zomeEntryName, crudValidationDefs)
  return completedValidationFile
}

const renderValidationContent = (zomeEntry, zomeEntryName) => {
  let { functions } = zomeEntry
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
  crudValidationDefs = mapFnOverObject(functions, renderCrudDefinition, zomeEntryName).join('')
  return crudValidationDefs
}

const renderValidationFile = (templateFile, zomeEntryName, crudValidationDefs) => {  
  let newFile = templateFile
  newFile = replaceNamePlaceHolders(newFile, ENTRY_NAME, zomeEntryName)
  newFile = replaceContentPlaceHolders(newFile, CRUD_VALIDATION_DEFINITIONS, crudValidationDefs)
  return newFile
}

const renderCrudDefinition = (crudFn, shouldFnRender, zomeEntryName) => {
  if (!shouldFnRender) return
  else if (crudFn === "get" || crudFn === "list") return

  let crudValidationDef = ''
  switch (crudFn) {
    case 'create': {
      const create = `
      pub fn validate_entry_${toSnakeCase(crudFn).toLowerCase()}(entry: ${capitalize(toCamelCase(zomeEntryName))}Entry, validation_data: hdk::ValidationData) -> Result<(), String> {
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_entry: {:?}", entry)).ok();
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_validation_data: {:?}", validation_data)).ok();
          Ok(())
      }
      `
      crudValidationDef = crudValidationDef + create
      break
    }
    case 'update': {
      const update = `
      pub fn validate_entry_${toSnakeCase(crudFn).toLowerCase()}(new_entry: ${capitalize(toCamelCase(zomeEntryName))}Entry, old_entry: ${capitalize(toCamelCase(zomeEntryName))}Entry, old_entry_header: ChainHeader, validation_data: hdk::ValidationData) -> Result<(), String> {
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_new_entry: {:?}", new_entry)).ok();
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_old_entry: {:?}", old_entry)).ok();
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_old_entry_header: {:?}", old_entry_header)).ok();
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_validation_data: {:?}", validation_data)).ok();
      
          if let (Some(o), Some(p)) = (old_entry_header.provenances().get(0), validation_data.package.chain_header.provenances().get(0)) {
              if o.source() == p.source() {
                Ok(())
              }
              else {
                Err("Agent who did not author is trying to ${toSnakeCase(crudFn).toLowerCase()}".to_string())
              }
          }
          else {
            Err("No provenance on this validation_data".to_string())
          }
      }
      `
      crudValidationDef = crudValidationDef + update
      break
    }
    case 'remove': {
      const remove = `
      pub fn validate_entry_${toSnakeCase(crudFn).toLowerCase()}(old_entry: ${capitalize(toCamelCase(zomeEntryName))}Entry, old_entry_header: ChainHeader, validation_data: hdk::ValidationData) -> Result<(), String> {
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_old_entry: {:?}", old_entry)).ok();
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_old_entry_header: {:?}", old_entry_header)).ok();
          hdk::debug(format!("validate_entry_${toSnakeCase(crudFn).toLowerCase()}_validation_data: {:?}", validation_data)).ok();

          if let (Some(o), Some(p)) = (old_entry_header.provenances().get(0), validation_data.package.chain_header.provenances().get(0)) {
              if o.source() == p.source() {
                Ok(())
              }
              else {
                Err("Agent who did not author is trying to ${toSnakeCase(crudFn).toLowerCase()}".to_string())
              }
          }
          else {
            Err("No provenance on this validation_data".to_string())
          }
      }
      `
      crudValidationDef = crudValidationDef + remove
      break
    }

    default: return new Error(`Error: Found invalid CRUD function for validation. CRUD fn received : ${crudFn}.`)
  }

  return crudValidationDef
}

module.exports = renderValidation
