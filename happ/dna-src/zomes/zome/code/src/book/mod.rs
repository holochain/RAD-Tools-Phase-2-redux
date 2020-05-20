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

const BOOK_ENTRY_NAME: &str = "book";
const BOOK_LINK_TYPE: &str = "book_link";
const BOOK_ANCHOR_TYPE: &str = "book";
const BOOK_ANCHOR_TEXT: &str = "book";

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BookEntry {
    author: String,

    title: String,

    topic: String,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Book {
    id: Address,

    author: String,

    title: String,

    topic: String,
}

impl Book {
    pub fn new(id: Address, book_entry: BookEntry) -> ZomeApiResult<Book> {
        Ok(Book {
            id: id.clone(),

            author: book_entry.author,

            title: book_entry.title,

            topic: book_entry.topic,
        })
    }
}

pub fn definition() -> ValidatingEntryType {
    entry!(
        name: BOOK_ENTRY_NAME,
        description: "Create and manage books.",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | validation_data: hdk::EntryValidationData<BookEntry>| {
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
                link_type: BOOK_LINK_TYPE,
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
