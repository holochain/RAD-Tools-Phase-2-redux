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
// TODO: Validation File
// pub mod validation;

const {ENTRY_NAME}_ENTRY_NAME: &str = "{ENTRY_NAME}";
const {LINK_TYPE_NAME}_LINK_TYPE_NAME: &str = "{LINK_TYPE_NAME}";

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct {EntryName}Entry {
    let {SLIM_ENTRY_DEFINITION} // (ie: entry_def - id + timestamps)
}

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct {EntryName} {
    let {ENTRY_DEFINITION}
}

fn timestamp(address: Address) -> ZomeApiResult<Iso8601> {
    let options = GetEntryOptions{status_request: StatusRequestKind::Initial, entry: false, headers: true, timeout: Timeout::new(10000)};
    let entry_result = hdk::get_entry_result(&address, options)?;
    match entry_result.result {
        GetEntryResultType::Single(entry) => {
            Ok(entry.headers[0].timestamp().clone())
        },
        _ => {
            unreachable!()
        }
    }
}

impl {EntryName} {
    pub fn new(id: Address, {entry_name}: {EntryName}Entry) -> ZomeApiResult<{ENTRY_NAME}> {
        Ok({EntryName}{
            {ENTRY_DEFINITION}
        })
    }
}

pub fn definition() -> ValidatingEntryType {
    entry!(
        name: {ENTRY_NAME}_ENTRY_NAME,
        description: "{ENTRY_DESCRIPTION}",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | validation_data: hdk::EntryValidationData<{ENTRY_NAME}Entry}>| {
            match validation_data
            {
                hdk::EntryValidationData::Create{entry, validation_data} =>
                {
                    validation::validate_entry_create(entry, validation_data)
                },
                hdk::EntryValidationData::Modify{new_entry, old_entry, old_entry_header, validation_data} =>
                {
                    validation::validate_entry_modify(new_entry, old_entry, old_entry_header, validation_data)
                },
                hdk::EntryValidationData::Delete{old_entry, old_entry_header, validation_data} =>
                {
                   validation::validate_entry_delete(old_entry, old_entry_header, validation_data)
                }
            }
        },
        links: []
    )
}