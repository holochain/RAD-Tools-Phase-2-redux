const create_entry = 
    pub fn create_note(note_entry: NoteEntry) -> ZomeApiResult<Note> {
        let entry = Entry::App(NOTE_ENTRY_NAME.into(), note_entry.clone().into());
        let address = hdk::commit_entry(&entry)?;
        hdk::link_entries(&notes_anchor()?, &address, NOTE_LINK_TYPE, "")?;
        Note::new(address, note_entry)
    }

const get_all_entries = 
pub fn get_all_notes() -> ZomeApiResult<Vec<Note>> {
    hdk::get_links_and_load(&notes_anchor()?, LinkMatch::Exactly(NOTE_LINK_TYPE), LinkMatch::Any)
        .map(|note_list|{
            note_list.into_iter()
                .filter_map(Result::ok)
                .flat_map(|entry| {
                    let id = entry.address();
                    hdk::debug(format!("list_entry{:?}", entry)).ok();
                    get_note(id)
                }).collect()
        })
}

const get_entry = 
    pub fn get_note(id: Address) -> ZomeApiResult<Note> {
        let note: NoteEntry = hdk::utils::get_as_type(id.clone())?;
        Note::new(id, note)
    }

const update_entry = 
    pub fn update_note(id: Address, note_input: NoteEntry) -> ZomeApiResult<Note> {
        let address = match hdk::get_entry(&id.clone())? {
            None => id.clone(),
            Some(entry) => entry.address()
        };
        hdk::update_entry(Entry::App(NOTE_ENTRY_NAME.into(), note_input.clone().into()), &address)?;
        Note::new(id, note_input)
    }

const remove_entry = 
    pub fn remove_note(id: Address) -> ZomeApiResult<Address> {
        hdk::remove_link(&notes_anchor()?, &id, NOTE_LINK_TYPE, "")?;
        hdk::remove_entry(&id)
    }