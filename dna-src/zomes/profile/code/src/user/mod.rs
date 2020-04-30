use serde_derive::{Deserialize, Serialize};
use holochain_json_derive::DefaultJson; 
use hdk::{
    self,
    entry,
    from,
    link,
    entry_definition::ValidatingEntryType,
    holochain_core_types::{
        dna::entry_types::Sharing,
        time::Timeout,
        time::Iso8601,
    },
    holochain_json_api::{
        json::JsonString,
        error::JsonError,
    },
    prelude::*,
    holochain_persistence_api::cas::content::Address
};

pub mod handlers;
pub mod validation;

const USER_ENTRY_NAME: &str = "user";
const USER_LINK_TYPE: &str = "user_link";
const USER_ANCHOR_TYPE: &str = "user";
const USER_ANCHOR_TEXT: &str = "user";




#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserEntry {
    
    avatar_url: string,
  
    name: string,
  
}

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    id: Address,
    
    avatar_url: string,
  
    name: string,
  
}

impl User {
    pub fn new(id: Address, user_entry: UserEntry) -> ZomeApiResult<User> {
        Ok(User{
            id: Address,
            
    avatar_url: string,
  
    name: string,
  
        })
    }
}

pub fn definition() -> ValidatingEntryType {
    entry!(
        name: USER_ENTRY_NAME,
        description: "Create and mange notes by users.",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | validation_data: hdk::EntryValidationData<UserEntry>| {
            match validation_data
            {
                {ENTRY_VALIDATION_DEFINITIONS}
            }
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: USER_LINK_TYPE,
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: |validation_data: hdk::LinkValidationData| {
                    match validation_data
                    {
                        hdk::LinkValidationData::LinkAdd{link, validation_data} =>
                        {
                            validation::validate_link_add(link, validation_data)
                        },
                        hdk::LinkValidationData::LinkRemove{link, validation_data} =>
                        {
                            validation::validate_link_remove(link, validation_data)
                        }
                    }
                }
            )
            {LINK_DEFINITION}
        ]
    )
}