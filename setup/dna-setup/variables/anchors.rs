mod {LINK_TYPE_NAME}_LINK_TYPE_NAME
use {LINK_TYPE_NAME}_LINK_TYPE_NAME


// <ENTRY_NAME>/modules.rs

const {ANCHOR_TYPE_NAME}_ANCHOR_TYPE_NAME: &str = "{ANCHOR_TYPE_NAME}";
const {ANCHOR_TAG_NAME}_ANCHOR_TAG_NAME: &str = "{ANCHOR_TAG_NAME}";


// <ENTRY_NAME>/handlers.rs

const ANCHOR_IMPORT = use holochain_anchors::anchor;

const {LINK_TYPE_NAME}_ANCHOR_HANDLER =
    fn {LINK_TYPE_NAME}_anchor() -> ZomeApiResult<Address> {
        anchor({ANCHOR_TYPE_NAME}_ANCHOR_TYPE_NAME.to_string(), {ANCHOR_TAG_NAME}_ANCHOR_TAG_NAME.to_string())
    }

///////////////////////////////////////////////////////////////////////////////
/////
// Do the following once for each zome with any ref to anchors
////

// <ZOME_NAME>/lib.rs
// Add the following definition to Zome Mod:
// ie: #[zome]
//      mod <ENTRY_NAME> {
//        ...
//      }

const ANCHOR_DEFINITION =
#[entry_def]
fn anchor_def() -> ValidatingEntryType {
    holochain_anchors::anchor_definition()

/////
////////////////////////////////////////////////////////////////////////////////// 