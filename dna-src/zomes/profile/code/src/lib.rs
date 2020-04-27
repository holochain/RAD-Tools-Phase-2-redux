// see https://developer.holochain.org/api/0.0.42-alpha5/hdk/ for info on using the hdk library

// #![feature(proc_macro_hygiene)]
use hdk_proc_macros::zome;
use serde_derive::{Deserialize, Serialize};
use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
    holochain_persistence_api::cas::content::Address
};

use crate::user::UserEntry;
use crate::user::User;
pub mod user;
  

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

    
    #[entry_def]
    fn user_def() -> ValidatingEntryType {
      user::definition()
    }
  
    
    #[zome_fn("hc_public")]
    fn create_user(user_input: UserEntry) -> ZomeApiResult<User> {
        user::handlers::create_user(user_input)
    }
  
    #[zome_fn("hc_public")]
    fn get_user(id: Address) -> ZomeApiResult<User> {
        user::handlers::get_user(user_input)
    }
  
    #[zome_fn("hc_public")]
    fn list_user() -> ZomeApiResult<User> {
        user::handlers::list_user(user_input)
    }
  
    #[zome_fn("hc_public")]
    fn remove_user{id: Address} -> ZomeApiResult<User> {
        user::handlers::remove_user(user_input)
    }
  
    #[zome_fn("hc_public")]
    fn update_user(id: Address, user_input: UserEntry) -> ZomeApiResult<User> {
        user::handlers::update_user(user_input)
    }
  
}
