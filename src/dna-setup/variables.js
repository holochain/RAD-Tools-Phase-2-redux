// name replacements for most/all files
const ENTRY_NAME = 'entryName'

// ================================================================
// lib.rs file
const ZOME_NAME = 'zomeName'
const ENTRY_IMPORTS = 'entryImports'
const ENTRY_DEFINITIONS = 'entryDefinitions'
const ENTRY_FUNCTION_DEFINITIONS = 'entryFunctionDefinitions'

// ================================================================
// mod.rs file
const ENTRY_DEFINITION = 'entryDefinition'
// TODO: ANYTHING REGARDING TIME SHOULD BE DEMARCATED AS A 'SPECIAL FIELD', and create the timestamp fn...
//  eg: "created_at": "string"
//  >> fn timestamp(address: Address) -> ZomeApiResult<Iso8601> {
//   let options = GetEntryOptions{status_request: StatusRequestKind::Initial, entry: false, headers: true, timeout: Timeout::new(10000)};
//   let entry_result = hdk::get_entry_result(&address, options)?;
//   match entry_result.result {
//       GetEntryResultType::Single(entry) => {
//           Ok(entry.headers[0].timestamp().clone())
//       },
//       _ => {
//           unreachable!()
//       }
//   }
// }
const ENTRY_DEFINITION_IMPLEMENTATION = 'entryDefinitionImplementation'
const ENTRY_DESCRIPTION = 'entryDescription'
const SHARING_TYPE = 'sharingType'
const ENTRY_VALIDATION_DEFINITIONS = 'entryValidationDefinitions'
const LINK_DEFINITION = 'linkDefinition'
// eg: 
// AGENT ID EXAMPLE:            ,
// to!(
//   "%agent_id",
//   link_type: "agent_link_tag",
//
//   validation_package: || {
//       hdk::ValidationPackageDefinition::Entry
//   },
//
//   validation: | _validation_data: hdk::LinkValidationData | {
//       Ok(())
//   }
// ),
//
// ENTRY EXAMPLE:
// to!(
//   "rules",
//   link_type: "rules_link_tag",
//
//   validation_package: || {
//       hdk::ValidationPackageDefinition::Entry
//   },
//
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
const ANCHOR_DEFINITIONS = 'anchorDefinitions'
const CRUD_DEFINITION = 'crudDefinition'
const LINK_NAME_CONSTANTS = 'linkNameConstants'
// reference {LINK_NAME_DEFINITIONS}
const ANCHOR_NAME_CONSTANTS = 'anchorNameConstants'
// reference {ANCHOR_NAME_DEFINITIONS}

// ================================================================
// validation.rs file
const CRUD_VALIDATION_DEFINITIONS = 'crudValidationDefinitions'
// nb: link actions to validate are add and remove;
//  as links are baked into the scaffold, 
//  these links are static input

// ================================================================
// TESTING: root index.js file
const DNA_NAME = 'dnaName'
const ENTRY_TEST_IMPORTS = 'entryTestImports'

// ================================================================
// ENTRY TESTING: entry test index.js file
const CRUD_TESTING = 'crudTesting'

module.exports = {
  // Zome Entry:
  ENTRY_NAME,
  // lib.rs
  ZOME_NAME,
  ENTRY_IMPORTS,
  ENTRY_DEFINITIONS,
  ENTRY_FUNCTION_DEFINITIONS,
  // mod.rs
  ENTRY_DEFINITION,
  ENTRY_DEFINITION_IMPLEMENTATION,
  ENTRY_DESCRIPTION,
  SHARING_TYPE,
  ENTRY_VALIDATION_DEFINITIONS,
  LINK_DEFINITION,
  LINK_NAME_DEFINITIONS,
  ANCHOR_NAME_DEFINITIONS,
  // handlers.rs
  LINK_NAME_CONSTANTS,
  ANCHOR_DEFINITIONS,
  ANCHOR_NAME_CONSTANTS,
  CRUD_DEFINITION,
  // validation.rs
  CRUD_VALIDATION_DEFINITIONS,

  // Entry Testing:
  // root index.js
  DNA_NAME,
  ENTRY_TEST_IMPORTS,
  // test index.js
  CRUD_TESTING
//
}
