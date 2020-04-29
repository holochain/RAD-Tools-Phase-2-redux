// lib.rs file
// content only
const ENTRY_IMPORTS = 'entryImports'
const ENTRY_DEFINITIONS = 'entryDefinitions'
const ENTRY_FUNCTION_DEFINITIONS = 'entryFunctionDefinitions'

// ================================================================
// mod.rs file
// var name replacements
const ZOME_NAME = 'zomeName'
const ENTRY_NAME = 'entryName'

// // content:
const ENTRY_DEFINITION = 'entryDefinition'
const ENTRY_DESCRIPTION = 'entryDescription'
const SHARING_TYPE = 'sharingType'
const CRUD_VALIDATION_DEFINITION = 'crudValidationDefinition'
const LINK_DEFINITION = 'linkDefinition'
// ie: 
// AGENT ID EXAMPLE:            ,
// to!(
//   "%agent_id",
//   link_type: "agent_link_tag",

//   validation_package: || {
//       hdk::ValidationPackageDefinition::Entry
//   },

//   validation: | _validation_data: hdk::LinkValidationData | {
//       Ok(())
//   }
// ),

// ENTRY EXAMPLE:
// to!(
//   "rules",
//   link_type: "rules_link_tag",

//   validation_package: || {
//       hdk::ValidationPackageDefinition::Entry
//   },

//   validation: | _validation_data: hdk::LinkValidationData | {
//       Ok(())
//   }
// )

const LINK_NAME_DEFINITIONS = 'linkNameDefinitions'
// ie: 
// const {LINK_TYPE_NAME}_LINK_TYPE: &str = "{link_type_name}_link";
// const {LINK_TAG_NAME}_LINK_TAG: &str = "{link_tag_name}";
const ANCHOR_NAME_DEFINITIONS = 'anchorNameDefinitions'
// ie: 
// const {ANCHOR_TYPE_NAME}_ANCHOR_TYPE: &str = "{anchor_type_name};
// const {ANCHOR_TAG_NAME}_ANCHOR_TEXT: &str = "{anchor_tag_name};

// ================================================================
// handlers.rs file

module.exports = {
  // index.rs
  ENTRY_IMPORTS,
  ENTRY_DEFINITIONS,
  ENTRY_FUNCTION_DEFINITIONS,
  // mod.rs
  ZOME_NAME,
  ENTRY_NAME,
  ENTRY_DEFINITION,
  ENTRY_DESCRIPTION,
  SHARING_TYPE,
  CRUD_VALIDATION_DEFINITION,
  LINK_DEFINITION,
  LINK_NAME_DEFINITIONS,
  ANCHOR_NAME_DEFINITIONS
}
