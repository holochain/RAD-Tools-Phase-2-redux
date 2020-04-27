// see https://developer.holochain.org/api/0.0.42-alpha5/hdk/ for info on using the hdk library

// #![feature(proc_macro_hygiene)]
use hdk_proc_macros::zome;
use serde_derive::{Deserialize, Serialize};
use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
    holochain_persistence_api::cas::content::Address
};

use crate::comment::CommentEntry;
use crate::comment::Comment;
pub mod comment;
  
use crate::lisa::LisaEntry;
use crate::lisa::Lisa;
pub mod lisa;
  
use crate::note::NoteEntry;
use crate::note::Note;
pub mod note;
  
use crate::jack::JackEntry;
use crate::jack::Jack;
pub mod jack;
  

#[zome]
mod notes {

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
    fn comment_def() -> ValidatingEntryType {
      comment::definition()
    }
  
    #[entry_def]
    fn lisa_def() -> ValidatingEntryType {
      lisa::definition()
    }
  
    #[entry_def]
    fn note_def() -> ValidatingEntryType {
      note::definition()
    }
  
    #[entry_def]
    fn jack_def() -> ValidatingEntryType {
      jack::definition()
    }
  
    
    #[zome_fn("hc_public")]
    fn create_comment(comment_input: CommentEntry) -> ZomeApiResult<Comment> {
        comment::handlers::create_comment(comment_input)
    }
  
    #[zome_fn("hc_public")]
    fn get_comment(id: Address) -> ZomeApiResult<Comment> {
        comment::handlers::get_comment(comment_input)
    }
  
    #[zome_fn("hc_public")]
    fn list_comment() -> ZomeApiResult<Comment> {
        comment::handlers::list_comment(comment_input)
    }
  
    #[zome_fn("hc_public")]
    fn remove_comment{id: Address} -> ZomeApiResult<Comment> {
        comment::handlers::remove_comment(comment_input)
    }
  
    #[zome_fn("hc_public")]
    fn update_comment(id: Address, comment_input: CommentEntry) -> ZomeApiResult<Comment> {
        comment::handlers::update_comment(comment_input)
    }
  
    #[zome_fn("hc_public")]
    fn create_lisa(lisa_input: LisaEntry) -> ZomeApiResult<Lisa> {
        lisa::handlers::create_lisa(lisa_input)
    }
  
    #[zome_fn("hc_public")]
    fn get_lisa(id: Address) -> ZomeApiResult<Lisa> {
        lisa::handlers::get_lisa(lisa_input)
    }
  
    #[zome_fn("hc_public")]
    fn list_lisa() -> ZomeApiResult<Lisa> {
        lisa::handlers::list_lisa(lisa_input)
    }
  
    #[zome_fn("hc_public")]
    fn remove_lisa{id: Address} -> ZomeApiResult<Lisa> {
        lisa::handlers::remove_lisa(lisa_input)
    }
  
    #[zome_fn("hc_public")]
    fn update_lisa(id: Address, lisa_input: LisaEntry) -> ZomeApiResult<Lisa> {
        lisa::handlers::update_lisa(lisa_input)
    }
  
    #[zome_fn("hc_public")]
    fn create_note(note_input: NoteEntry) -> ZomeApiResult<Note> {
        note::handlers::create_note(note_input)
    }
  
    #[zome_fn("hc_public")]
    fn get_note(id: Address) -> ZomeApiResult<Note> {
        note::handlers::get_note(note_input)
    }
  
    #[zome_fn("hc_public")]
    fn list_note() -> ZomeApiResult<Note> {
        note::handlers::list_note(note_input)
    }
  
    #[zome_fn("hc_public")]
    fn remove_note{id: Address} -> ZomeApiResult<Note> {
        note::handlers::remove_note(note_input)
    }
  
    #[zome_fn("hc_public")]
    fn update_note(id: Address, note_input: NoteEntry) -> ZomeApiResult<Note> {
        note::handlers::update_note(note_input)
    }
  
    #[zome_fn("hc_public")]
    fn create_jack(jack_input: JackEntry) -> ZomeApiResult<Jack> {
        jack::handlers::create_jack(jack_input)
    }
  
    #[zome_fn("hc_public")]
    fn get_jack(id: Address) -> ZomeApiResult<Jack> {
        jack::handlers::get_jack(jack_input)
    }
  
    #[zome_fn("hc_public")]
    fn list_jack() -> ZomeApiResult<Jack> {
        jack::handlers::list_jack(jack_input)
    }
  
    #[zome_fn("hc_public")]
    fn remove_jack{id: Address} -> ZomeApiResult<Jack> {
        jack::handlers::remove_jack(jack_input)
    }
  
    #[zome_fn("hc_public")]
    fn update_jack(id: Address, jack_input: JackEntry) -> ZomeApiResult<Jack> {
        jack::handlers::update_jack(jack_input)
    }
  
}
