use hdk::{
    holochain_core_types::{
        chain_header::ChainHeader,
        link::link_data::LinkData
    }
};
use crate::{entry_name}::{EntryName}Entry;


{CRUD_VALIDATION_DEFINITIONS}

pub fn validate_link_add(link: LinkData, validation_data: hdk::ValidationData) -> Result<(), String> {
    hdk::debug(format!("validate_link_add_link: {:?}", link)).ok();
    hdk::debug(format!("validate_link_add_validation_data: {:?}", validation_data)).ok();
    Ok(())
}

pub fn validate_link_remove(link: LinkData, validation_data: hdk::ValidationData) -> Result<(), String> {
    hdk::debug(format!("validate_link_remove_link: {:?}", link)).ok();
    hdk::debug(format!("validate_link_remove_validation_data: {:?}", validation_data)).ok();
    Ok(())
}
