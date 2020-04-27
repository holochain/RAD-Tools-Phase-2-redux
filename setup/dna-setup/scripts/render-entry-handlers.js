function renderHandlers (zomeName, zomeEntryName, zomeEntry) {
    console.log(` >>> rendering file ${zomeName}/${zomeEntryName} handlers.rs `)
    return `// NB: ${zomeName}/${zomeEntryName} handlers.rs: \n // Entry Content: ${JSON.stringify(zomeEntry)}`
}

module.exports = renderHandlers