// see https://developer.holochain.org/api/0.0.42-alpha5/hdk/ for info on using the hdk library

#![feature(proc_macro_hygiene)]
use hdk::{
    entry_definition::ValidatingEntryType, error::ZomeApiResult,
    holochain_persistence_api::cas::content::Address,
};
use hdk_proc_macros::zome;
use serde_derive::{Deserialize, Serialize};

use crate::book::Book;
use crate::book::BookEntry;
pub mod book;

use crate::user::User;
use crate::user::UserEntry;
pub mod user;

#[zome]
mod zome {

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
    fn book_def() -> ValidatingEntryType {
        book::definition()
    }

    #[entry_def]
    fn user_def() -> ValidatingEntryType {
        user::definition()
    }

    #[zome_fn("hc_public")]
    fn create_book(book_input: BookEntry) -> ZomeApiResult<Book> {
        book::handlers::create_book(book_input)
    }

    #[zome_fn("hc_public")]
    fn delete_book(id: Address) -> ZomeApiResult<Address> {
        book::handlers::delete_book(id)
    }

    #[zome_fn("hc_public")]
    fn get_book(id: Address) -> ZomeApiResult<Book> {
        book::handlers::get_book(id)
    }

    #[zome_fn("hc_public")]
    fn list_books() -> ZomeApiResult<Vec<Book>> {
        book::handlers::list_books()
    }

    #[zome_fn("hc_public")]
    fn update_book(id: Address, book_input: BookEntry) -> ZomeApiResult<Book> {
        book::handlers::update_book(id, book_input)
    }

    #[zome_fn("hc_public")]
    fn create_user(user_input: UserEntry) -> ZomeApiResult<User> {
        user::handlers::create_user(user_input)
    }

    #[zome_fn("hc_public")]
    fn delete_user(id: Address) -> ZomeApiResult<Address> {
        user::handlers::delete_user(id)
    }

    #[zome_fn("hc_public")]
    fn get_user(id: Address) -> ZomeApiResult<User> {
        user::handlers::get_user(id)
    }

    #[zome_fn("hc_public")]
    fn list_users() -> ZomeApiResult<Vec<User>> {
        user::handlers::list_users()
    }

    #[zome_fn("hc_public")]
    fn update_user(id: Address, user_input: UserEntry) -> ZomeApiResult<User> {
        user::handlers::update_user(id, user_input)
    }
}
