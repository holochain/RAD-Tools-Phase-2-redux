 // import json file
 const typeSpec = require('../type-spec.json')

 /////
     // const mapFnOverObject = (object, fn) => Object.keys(object).sort().map(key => fn(key, object[key]))
     // const renderField = (key, value) => {
     //     console.log(`${key}: ${value}`)
     // }
     // mapFnOverObject(object, renderField).join('\n')
     // // vs:
     // for (let [key, value] of Object.entries(object)) {
     //     console.log(`${key}: ${value}`).concat('\n')
     // }
 /////
 
 // read length of Zomes array from json file
     // iter over each Zome entry and read key (name of Zome)
     // create Zome folder structure for each Zome according to name, ie: run `cd dna-src && hc generate zomes/<ZOME_NAME> rust-proc`
 
     // read length of Entries array inside of Zome
         // 1. ITERATE over each ENTRY object and read key (ie; ENTRY NAME)
             // A. Create entry folder structure for each entry according to name: 
                 // ie: run `cd dna-src/zomes/<ZOME_NAME>/code/src && mkdir <ENTRY_NAME>` 
             // B. update template draft with boilerplate code as fresh start: 
                 // ie: run `rm -rf /entry-template/template-draft/ && cd /entry-template/boilerplate && cp -p -R * /entry-template/template-draft` 
 
                 // ### ###   NB: Run this when ready to copy over the template draft into the entry zome itself: 
                     // ie: run `cd /dna-src/zomes/<ZOME_NAME>/code/src && mkdir <ENTRY_NAME> && cd /entry-template/template-draft && cp -p -R * /dna-src/zomes/<ZOME_NAME>/code/src/<ENTRY_NAME>` ### ###  
 
             // B. Create entry definition using template:  ( =>> ALSO use this to inform the graphQL protion of the automation...)
                 // 1. update definitions.rs boilerplate with var names and types
                 // 2. add ENTRY Defintion to <ENTRY_NAME>/mod.rs
                 // 3. add ENTRY Definition Reference to `entries` array i n lib.rs, as shown below:
                         // eg:  entries: [
                                     // // (NB: Public Entries)
                                     // authorizor::definitions(),
                                     // device_authorization::definitions(),
                                     // key_anchor::definitions(),
 
                                     // // (NB: Private Entries)
                                     // key_registration::meta_definitions(),
                                     // authorizor::auth_path_definitions(),
                         //      ]
 
             // C. ITERATE over each LINK object:
                 // 1. update anchors.rs with var names for link_type_name and link_tag_name
                 // 2. determine linked_entry_type (ie: entry/anchor/AGENT_ID)
                     // -> if anchor, 
                         // i.) locate anchor by id (ie: path to anchor)
                         // ii.) run ANCHOR EVENT SEQUENCE
                     // -> else if AGENT_ID,
                         // i.) reference STRING CONSTANT >> CONVENTIONALIZE with Joel 
                 // 3. determine DIRECTION of link & define create LINK Handler fn
                     // -> if bidirectional, 
                         // 1.) run `link_entries` twice, interchanging the base_entry and target_entry
                     // -> else if `to`,
                         // 1.) run `link_entries` with current ENTRY as base_entry and "linked_entry_type" as target_entry
                     // -> else if `from`,
                         // 1.) run `link_entries` with current ENTRY as target_entry and "linked_entry_type" as base_entry
                 //  4. define LINK Handler fn(s) for get/update/remove LINK
                 //  5. Add Link definitions and Link Handler fn definitions to mod.rs 
                 //  6. Add reference to Link Handler fns in handlers.rs 
 ///////////////////////////////////////////////////////////////////////////////////////////
 // ** ANCHOR EVENT SEQUENCE: **
 // 1. Determine if `holochain_anchors` crate has already been added for this ZOME
     // i.) if not (yet added), add the current version (>>tracking the master branch<<) of `holochain-anchors` as a crate to the zome's cargo.toml dependency list as shown below: 
         // holochain_anchors = { git = "https://github.com/holochain/holochain-anchors" , branch = "master" }
 
     // ii.) update anchors.rs with var names for anchor_type_name and anchor_tag_name
             
 // !!  if not referenced, skip this step...  !!
 ///////////////////////////////////////////////////////////////////////////////////////////
             
         // D. Define PUBLIC Functions for ENTRY
 
 
 // List of Placeholder Consts / Names:
 {ENTRY_NAME}
 {ENTRY_DEFINITION}
 {SLIM_ENTRY_DEFINITION} // (ie: entry_def - id + timestamps)
 
 {LINK_TYPE_NAME}
 {LINK_TAG_NAME}
 
 {ANCHOR_TYPE_NAME}
 {ANCHOR_TAG_NAME}
 
 // Helper Functions
 function replaceNamePlaceHolders (file, placeHolderName, replacementName) {
     const placeHolderAllCaps = `{${placeHolderName.toUpperCase()}}`
     const placeHolderCapitalized = `{${placeHolderName.charAt(0).toUpperCase() + placeHolderName.substring(1)}}`
     // todo : snake_case
     const replacementAllCaps = replacementName.toUpperCase()
     const replacementCapitalized = replacementName.charAt(0).toUpperCase() + replacementName.substring(1)
     return file.replace(new RegExp(placeHolderName, 'g'), replacementName).replace(new RegExp(placeHolderAllCaps, 'g'), replacementAllCaps).replace(new RegExp(placeHolderCapitalized, 'g'), replacementCapitalized)
 }
 
 
 function replaceContentPlaceHolders (file, placeHolderContent, replacementContent) {
     const placeHolderContentAllCaps = `let {${placeHolderContent.toUpperCase()}}`
     return file.replace(new RegExp(placeHolderContentAllCaps, 'g'), replacementContent)
 }