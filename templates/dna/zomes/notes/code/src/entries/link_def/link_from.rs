from!(
    NOTE_ENTRY_NAME,
    link_type: NOTE_ENTRY_LINK_TYPE,
    validation_package: || {
        hdk::ValidationPackageDefinition::Entry
    },
    validation: |validation_data: hdk::LinkValidationData| {
        match validation_data
        {
            hdk::LinkValidationData::LinkAdd{link, validation_data} =>
            {
                permissions::validate_permissions_link_add(link, validation_data)
            },
            hdk::LinkValidationData::LinkRemove{link, validation_data} =>
            {
                permissions::validate_permissions_link_remove(link, validation_data)
            }
        }
    }
)
