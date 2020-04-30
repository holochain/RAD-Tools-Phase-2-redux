use hdk::{
    error::ZomeApiResult,
    holochain_core_types::{
        entry::Entry,
    },
    holochain_persistence_api::cas::content::{
        Address,
        AddressableContent
    },
    prelude::*,
};
use holochain_anchors::anchor;
use crate::{entry_name}::{
    {EntryName}Entry,
    {EntryName},
    {ENTRY_NAME}_ENTRY_NAME,
    {ENTRY_NAME}_LINK_TYPE,
    {LINK_NAME_CONSTANTS}
    {ENTRY_NAME}_ANCHOR_TYPE,
    {ENTRY_NAME}_ANCHOR_TEXT,
    {ANCHOR_NAME_CONSTANTS}
};

fn {entry_name}_anchor() -> ZomeApiResult<Address> {
    anchor({ENTRY_NAME}_ANCHOR_TYPE.to_string(), {ENTRY_NAME}_ANCHOR_TEXT.to_string())
}
{ANCHOR_DEFINITIONS}

{CRUD_DEFINITION}