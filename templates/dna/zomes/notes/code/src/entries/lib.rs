// Need to add to zomes/lib.rs

    #[entry_def]
    fn note_id_def() -> ValidatingEntryType {
       note::id_definition()
    }

    #[entry_def]
     fn note_entry_def() -> ValidatingEntryType {
        note::entry_definition()
    }

    #[zome_fn("hc_public")]
    fn create_note(note_input: NoteEntry) -> ZomeApiResult<Note> {
        note::handlers::create_note(note_input)
    }

    #[zome_fn("hc_public")]
    fn get_note(id: Address) -> ZomeApiResult<Note> {
        note::handlers::get_note(id)
    }

    #[zome_fn("hc_public")]
    fn update_note(id: Address, address: Address, note_input: NoteEntry) -> ZomeApiResult<Note> {
        note::handlers::update_note(id, address, note_input)
    }

    #[zome_fn("hc_public")]
    fn remove_note(id: Address, address: Address) -> ZomeApiResult<Address> {
        note::handlers::remove_note(id, address)
    }

    #[zome_fn("hc_public")]
    fn list_notes() -> ZomeApiResult<Vec<Note>> {
        note::handlers::list_notes()
    }
