function renderEntryTest (zomeEntryName, zomeEntry) {
  console.log(` >>> rendering file ${zomeEntryName} index.rs `)

  return `// NB: ${zomeEntryName} index.rs: \n // Entry Test Content: ${JSON.stringify(zomeEntry)}`
}

module.exports = renderEntryTest