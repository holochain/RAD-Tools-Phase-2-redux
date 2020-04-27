const fs = require('fs')
const path = require('path')
const { replaceContentPlaceHolders, mapFnOverObject, capitalize } = require('../../utils.js')
const { ENTRY_IMPORTS, ENTRY_DEFINITIONS, ENTRY_FUNCTION_DEFINITIONS } = require('../variables/index')
const entryModTemplatePath = path.resolve("setup/dna-setup/zome-template/entry-template", "mod.rs");
const entryModTemplate = fs.readFileSync(entryModTemplatePath, 'utf8')


function renderMod (zomeName, zomeEntryName, zomeEntry) {
    console.log(` >>> rendering file ${zomeName}/${zomeEntryName} mod.rs `)
    
    // mapFnOverObject(zomeEntry, renderEntryDef)
    // renderQueryDef(zomeEntry)
    // renderMutationDef(zomeEntry)

    return `// NB: ${zomeName}/${zomeEntryName} mod.rs: \n // Entry Content: ${JSON.stringify(zomeEntry)}`
}

module.exports = renderMod
  