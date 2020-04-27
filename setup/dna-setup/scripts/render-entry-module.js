const { mapFnOverObject } = require('../../utils.js')

function renderMod (zomeName, zomeEntryName, zomeEntry) {
    console.log(` >>> rendering file ${zomeName}/${zomeEntryName} mod.rs `)
    
    // mapFnOverObject(zomeEntry, renderEntryDef)
    // renderQueryDef(zomeEntry)
    // renderMutationDef(zomeEntry)

    return `// NB: ${zomeName}/${zomeEntryName} mod.rs: \n // Entry Content: ${JSON.stringify(zomeEntry)}`
}

module.exports = renderMod

// {
//     "zomes": {
//       "Notes": {
//         "types": { 
//           "Note": {
//             "title": "string",
//             "text": "string",
//             "author": "string"
//           },
//           "Lisa": {
//             "text": "string",
//             "author": "string",
//             "ranking": "string"
//           },
//           "Comment": {
//             "text": "string",
//             "author": "string",
//             "ranking": "string"
//           },
//           "jack": {
//             "text": "string",
//             "author": "string",
//             "ranking": "string"
//           }
//         }
//       },
//       "Profile": {
//         "types": {
//           "User": {
//             "name": "string",
//             "avatar_url": "string"
//           }
//         }
//       }
//     }
//   }
  