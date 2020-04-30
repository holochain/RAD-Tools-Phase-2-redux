// // In test/index :
// Create single instance >> populate..
//   const dna = Config.dna(dnaPath, '<DNA_NAME>-test')
//   const conductorConfig = Config.gen({<DNA_INSTANCE_NAME>: dna})

// For every entry ouput the following line..
//   require('./<ENTRY_NAME>')(orchestrator.registerScenario, conductorConfig)
// // 

function renderEntryTest (zomeEntryName, zomeEntry) {
    console.log(` >>> rendering file ${zomeEntryName} index.rs `)

    return `// NB: ${zomeEntryName} index.rs: \n // Entry Test Content: ${JSON.stringify(zomeEntry)}`
}

module.exports = renderEntryTest