use hdk::{
    self, entry,
    entry_definition::ValidatingEntryType,
    from,
    holochain_core_types::dna::entry_types::Sharing,
    holochain_json_api::{error::JsonError, json::JsonString},
    holochain_persistence_api::cas::content::Address,
    link,
    prelude::*,
};
use holochain_json_derive::DefaultJson;
use serde_derive::{Deserialize, Serialize};

pub mod handlers;
pub mod validation;

const USER_ENTRY_NAME: &str = "user";
const USER_LINK_TYPE: &str = "user_link";
const USER_ANCHOR_TYPE: &str = "user";
const USER_ANCHOR_TEXT: &str = "user";

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserEntry {
    avatar_url: String,

    name: String,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    id: Address,

    avatar_url: String,

    name: String,
}

impl User {
    pub fn new(id: Address, user_entry: UserEntry) -> ZomeApiResult<User> {
        Ok(User {
            id: id.clone(),

            avatar_url: user_entry.avatar_url,

            name: user_entry.name,
        })
    }
}

pub fn definition() -> ValidatingEntryType {
    entry!(
        name: USER_ENTRY_NAME,
        description: "Create and manage users.",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | validation_data: hdk::EntryValidationData<UserEntry>| {
            match validation_data
            {

              hdk::EntryValidationData::Create{entry, validation_data} =>
              {
                  validation::validate_entry_create(entry, validation_data)
              }

              hdk::EntryValidationData::Delete{old_entry, old_entry_header, validation_data} =>
              {
                  validation::validate_entry_delete(old_entry, old_entry_header, validation_data)
              }

              hdk::EntryValidationData::Modify{new_entry, old_entry, old_entry_header, validation_data} =>
              {
                  validation::validate_entry_update(new_entry, old_entry, old_entry_header, validation_data)
              }

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
        ]
    )
}
