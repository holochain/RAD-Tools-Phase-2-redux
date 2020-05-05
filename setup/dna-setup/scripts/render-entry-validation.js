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
  console.log('========== Validation =========== \n')
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
      pub fn validate_entry_${toSnakeCase(zomeEntryName).toLowerCase()}(entry: ${capitalize(toCamelCase(zomeEntryName))}, validation_data: hdk::ValidationData) -> Result<(), String> {
          hdk::debug(format!("validate_entry_create_entry: {:?}", entry)).ok();
          hdk::debug(format!("validate_entry_create_validation_data: {:?}", validation_data)).ok();
          Ok(())
      }
      `
      crudValidationDef = crudValidationDef + create
      break
    }
    case 'update': {
      const update = `
      pub fn validate_entry_${toSnakeCase(zomeEntryName).toLowerCase()}(new_entry: ${capitalize(toCamelCase(zomeEntryName))}, old_entry: NoteEntry, old_entry_header: ChainHeader, validation_data: hdk::ValidationData) -> Result<(), String> {
          hdk::debug(format!("validate_entry_modify_new_entry: {:?}", new_entry)).ok();
          hdk::debug(format!("validate_entry_modify_old_entry: {:?}", old_entry)).ok();
          hdk::debug(format!("validate_entry_modify_old_entry_header: {:?}", old_entry_header)).ok();
          hdk::debug(format!("validate_entry_modify_validation_data: {:?}", validation_data)).ok();
      
          if let (Some(o), Some(p)) = (old_entry_header.provenances().get(0), validation_data.package.chain_header.provenances().get(0)) {
              if o.source() == p.source() {
                Ok(())
              }
              else {
                Err("Agent who did not author is trying to update".to_string())
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
      pub fn validate_entry_${toSnakeCase(zomeEntryName).toLowerCase()}(old_entry: ${capitalize(toCamelCase(zomeEntryName))}, old_entry_header: ChainHeader, validation_data: hdk::ValidationData) -> Result<(), String> {
          hdk::debug(format!("validate_entry_delete_old_entry: {:?}", old_entry)).ok();
          hdk::debug(format!("validate_entry_delete_old_entry_header: {:?}", old_entry_header)).ok();
          hdk::debug(format!("validate_entry_delete_validation_data: {:?}", validation_data)).ok();

          if let (Some(o), Some(p)) = (old_entry_header.provenances().get(0), validation_data.package.chain_header.provenances().get(0)) {
              if o.source() == p.source() {
                Ok(())
              }
              else {
                Err("Agent who did not author is trying to delete".to_string())
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
