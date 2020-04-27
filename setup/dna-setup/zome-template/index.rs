// see https://developer.holochain.org/api/0.0.42-alpha5/hdk/ for info on using the hdk library

// #![feature(proc_macro_hygiene)]
use hdk_proc_macros::zome;
use serde_derive::{Deserialize, Serialize};
use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
    holochain_persistence_api::cas::content::Address
};
{ENTRY_IMPORTS}

#[zome]
mod notes {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }
    
    #[entry_def]
    fn anchor_def() -> ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }

    {ENTRY_DEFINITIONS}
    {ENTRY_FUNCTION_DEFINITIONS}
}
