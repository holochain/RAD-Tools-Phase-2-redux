function renderValidation (zomeName, zomeEntryName, zomeEntry) {
    console.log(` >>> rendering file ${zomeName}/${zomeEntryName} validation.rs `)

    return `// NB: ${zomeName}/${zomeEntryName} validation.rs: \n // Entry Content: ${JSON.stringify(zomeEntry)}`
}

module.exports = renderValidation