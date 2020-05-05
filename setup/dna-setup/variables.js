// lib.rs file
// content only
const ENTRY_IMPORTS = 'entryImports'
const ENTRY_DEFINITIONS = 'entryDefinitions'
const ENTRY_FUNCTION_DEFINITIONS = 'entryFunctionDefinitions'

// ================================================================
// mod.rs file
// var name replacements
const ENTRY_NAME = 'entryName'

// // content:
const ENTRY_DEFINITION = 'entryDefinition'
// TODO: ANYTHING REGARDING TIME SHOULD BE DEMARCATED AS A 'SPECIAL FIELD', and create the timestamp fn...
//ie: "created_at": "string"
const ENTRY_DESCRIPTION = 'entryDescription'
const SHARING_TYPE = 'sharingType'
const ENTRY_VALIDATION_DEFINITIONS = 'crudValidationDefinition'
const LINK_DEFINITIONS = 'linkDefinitions'
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
// reference {ENTRY_NAME}
const ANCHOR_DEFINITIONS = 'anchorDefinitions'
const CRUD_DEFINITION = 'crudDefinition'
const LINK_NAME_CONSTANTS = 'linkNameConstants'
// reference {LINK_NAME_DEFINITIONS}
const ANCHOR_NAME_CONSTANTS = 'anchorNameConstants'
// reference {ANCHOR_NAME_DEFINITIONS}

// ================================================================
// validation.rs file
// reference {ENTRY_NAME}
const CRUD_VALIDATION_DEFINITIONS = 'crudValidationDefinitions'

// ================================================================
// TESTING: root index.rs file
// reference {ENTRY_NAME}
const DNA_NAME = 'dnaName'
const ENTRY_TEST_IMPORTS = 'entryTestImports'

// ================================================================
// ENTRY TESTING: entry test index.rs file
// reference {ENTRY_NAME}
const CRUD_TESTING = 'crudTesting'
const VALIDATION_TESTING = 'validationTesting'

module.exports = {
  // entry content:
  // index.rs
  ENTRY_IMPORTS,
  ENTRY_DEFINITIONS,
  ENTRY_FUNCTION_DEFINITIONS,
  // mod.rs
  ENTRY_NAME,
  ENTRY_DEFINITION,
  ENTRY_DESCRIPTION,
  SHARING_TYPE,
  ENTRY_VALIDATION_DEFINITIONS,
  LINK_DEFINITIONS,
  LINK_NAME_DEFINITIONS,
  ANCHOR_NAME_DEFINITIONS,
  // handlers.rs
  LINK_NAME_CONSTANTS,
  ANCHOR_DEFINITIONS,
  ANCHOR_NAME_CONSTANTS,
  CRUD_DEFINITION,
  // validation.rs
  CRUD_VALIDATION_DEFINITIONS,

  // Testing:
  // root index.js
  DNA_NAME,
  ENTRY_TEST_IMPORTS,
  // entry testing:
  // index.rs
  CRUD_TESTING,
  VALIDATION_TESTING
//
}


///////////////////////////////////////////////////////////////////////////////////////////
// ** LINK EVENT SEQUENCE: **
  // *. ITERATE over each LINK object:
    // 1. Add Link definitions and Link Handler fn definitions to mod.rs :
      // i. update anchors.rs with var names for link_type_name and link_tag_name
      // ii. determine linked_entry_type (ie: entry/anchor/AGENT_ID)
          // -> if entry, 
              // a.) locate entry in schema (verify exists
              // b.) run ANCHOR EVENT SEQUENCE
      // iii. determine DIRECTION of link & define create LINK Handler fn
          // -> if bidirectional, 
              // a.) run `link_entries` twice, interchanging the base_entry and target_entry
          // -> else if `to`,
              // a.) run `link_entries` with current ENTRY as base_entry and "linked_entry_type" as target_entry
          // -> else if `from`,
              // a.) run `link_entries` with current ENTRY as target_entry and "linked_entry_type" as base_entry
      //  iiii. define LINK Handler fn(s) for get/update/remove LINK (render fn)
  //  2. Add reference to Link Type and Link Tag vars  in handlers.rs 

///////////////////////////////////////////////////////////////////////////////////////////
    // ** ANCHOR EVENT SEQUENCE: **
    // 1. Determine if `holochain_anchors` crate has already been added for this ZOME
        // i.) if not (yet added), add the current version (>>tracking the master branch<<) of `holochain-anchors` as a crate to the zome's cargo.toml dependency list as shown below: 
            // holochain_anchors = { git = "https://github.com/holochain/holochain-anchors" , branch = "master" }
    
  //  2.) Add Anchor definitions (type/tag)to mod.rs :
  //  3.) Add reference to ANchor Type and Link Tag vars in handlers.rs 
///////////////////////////////////////////////////////////////////////////////////////////
