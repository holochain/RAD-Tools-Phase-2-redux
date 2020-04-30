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

const {ENTRY_NAME}_ENTRY_NAME: &str = "{entry_name}";
const {ENTRY_NAME}_LINK_TYPE: &str = "{entry_name}_link";
const {ENTRY_NAME}_ANCHOR_TYPE: &str = "{entry_name}";
const {ENTRY_NAME}_ANCHOR_TEXT: &str = "{entry_name}";

{LINK_NAME_DEFINITIONS}
{ANCHOR_NAME_DEFINITIONS}

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct {EntryName}Entry {
    {ENTRY_DEFINITION}
}

#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
#[serde(rename_all = "camelCase")]
pub struct {EntryName} {
    id: Address,
    {ENTRY_DEFINITION}
}

impl {EntryName} {
    pub fn new(id: Address, {entry_name}_entry: {EntryName}Entry) -> ZomeApiResult<{EntryName}> {
        Ok({EntryName}{
            id: Address,
            {ENTRY_DEFINITION}
        })
    }
}

pub fn definition() -> ValidatingEntryType {
    entry!(
        name: {ENTRY_NAME}_ENTRY_NAME,
        description: "{ENTRY_DESCRIPTION}",
        sharing: Sharing::{SHARING_TYPE},
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | validation_data: hdk::EntryValidationData<{EntryName}Entry}>| {
            match validation_data
            {
                {ENTRY_VALIDATION_DEFINITIONS}
            }
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: {ENTRY_NAME}_LINK_TYPE,
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