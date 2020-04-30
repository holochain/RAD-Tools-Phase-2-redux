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
use crate::user::{
    UserEntry,
    User,
    USER_ENTRY_NAME,
    USER_LINK_TYPE,
    
    USER_ANCHOR_TYPE,
    USER_ANCHOR_TEXT,
    
};

fn user_anchor() -> ZomeApiResult<Address> {
    anchor(USER_ANCHOR_TYPE.to_string(), USER_ANCHOR_TEXT.to_string())
}



      pub fn create_user(user_entry: User) -> ZomeApiResult<User> {
          let entry = Entry::App(USER_ENTRY_NAME.into(), user_entry.clone().into());
          let address = hdk::commit_entry(&entry)?;
          hdk::link_entries(&user_anchor()?, &address, USER_LINK_TYPE, "")?;
          User::new(address, user_entry)
      }
      
      pub fn get_user(id: Address) -> ZomeApiResult<User> {
          let user: User = hdk::utils::get_as_type(id.clone())?;
          User::new(id, user)
      }
      
      pub fn list_users() -> ZomeApiResult<Vec<User>> {
          hdk::get_links_and_load(&user_anchor()?, LinkMatch::Exactly(USER_LINK_TYPE), LinkMatch::Any)
              .map(|user_list|{
                  user_list.into_iter()
                      .filter_map(Result::ok)
                      .flat_map(|entry| {
                          let id = entry.address();
                          hdk::debug(format!("list_entry{:?}", entry)).ok();
                          get_user(id)
                      }).collect()
              })
      }
      
      pub fn remove_user(id: Address) -> ZomeApiResult<Address> {
          hdk::remove_link(&user_anchor()?, &id, User_LINK_TYPE, "")?;
          hdk::remove_entry(&id)
      }
      
      pub fn update_user(id: Address, user_input: User) -> ZomeApiResult<User> {
          let address = match hdk::get_entry(&id.clone())? {
              None => id.clone(),
              Some(entry) => entry.address()
          };
          hdk::update_entry(Entry::App(USER_ENTRY_NAME.into(), user_input.clone().into()), &address)?;
          User::new(id, user_input)
      }
      