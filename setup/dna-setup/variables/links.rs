
// <ENTRY_NAME>/modules.rs

mod const {LINK_TYPE_NAME}_LINK_TYPE_NAME: &str = "{LINK_TYPE_NAME}";
const {LINK_TAG_NAME}_LINK_TAG_NAME: &str = "{LINK_TAG_NAME}";

const {ENTRY_NAME}_ANCHOR_LINK_DEFINITION =
    from!(
        holochain_anchors::ANCHOR_TYPE,
        link_type: {LINK_TYPE_NAME}_LINK_TYPE_NAME,
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
    