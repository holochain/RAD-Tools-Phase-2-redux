use crate::book::{
    Book, BookEntry, BOOK_ANCHOR_TEXT, BOOK_ANCHOR_TYPE, BOOK_ENTRY_NAME, BOOK_LINK_TYPE,
};
use hdk::{
    error::ZomeApiResult,
    holochain_core_types::entry::Entry,
    holochain_persistence_api::cas::content::{Address, AddressableContent},
    prelude::*,
};
use holochain_anchors::anchor;

fn book_anchor() -> ZomeApiResult<Address> {
    anchor(BOOK_ANCHOR_TYPE.to_string(), BOOK_ANCHOR_TEXT.to_string())
}

pub fn create_book(book_entry: BookEntry) -> ZomeApiResult<Book> {
    let entry = Entry::App(BOOK_ENTRY_NAME.into(), book_entry.clone().into());
    let address = hdk::commit_entry(&entry)?;
    hdk::link_entries(&book_anchor()?, &address, BOOK_LINK_TYPE, "")?;
    Book::new(address, book_entry)
}

pub fn delete_book(id: Address) -> ZomeApiResult<Address> {
    hdk::remove_link(&book_anchor()?, &id, BOOK_LINK_TYPE, "")?;
    hdk::remove_entry(&id)
}

pub fn get_book(id: Address) -> ZomeApiResult<Book> {
    let book: BookEntry = hdk::utils::get_as_type(id.clone())?;
    Book::new(id, book)
}

pub fn list_books() -> ZomeApiResult<Vec<Book>> {
    hdk::get_links_and_load(
        &book_anchor()?,
        LinkMatch::Exactly(BOOK_LINK_TYPE),
        LinkMatch::Any,
    )
    .map(|book_list| {
        book_list
            .into_iter()
            .filter_map(Result::ok)
            .flat_map(|entry| {
                let id = entry.address();
                hdk::debug(format!("list_entry{:?}", entry)).ok();
                get_book(id)
            })
            .collect()
    })
}

pub fn update_book(id: Address, book_input: BookEntry) -> ZomeApiResult<Book> {
    let address = match hdk::get_entry(&id.clone())? {
        None => id.clone(),
        Some(entry) => entry.address(),
    };
    hdk::update_entry(
        Entry::App(BOOK_ENTRY_NAME.into(), book_input.clone().into()),
        &address,
    )?;
    Book::new(id, book_input)
}
