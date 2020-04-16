const mapObject = require('./render-utils').mapObject

function renderMockData ({ types }) {
  return `// data is a tree organized by instanceId > zome > function
// leaves can either be an object, or a function which is called with the zome call args.
// See mockCallZome.js

${mapObject(types, renderEntriesObject).join('\n')}

const data = {
  dna: {
    zome: {
${mapObject(types, renderZomeFunctionsForType).join('\n')}
    }
  }
}

export default data
`
}

function renderEntriesObject (typeName) {
  return `const ${typeName.toLowerCase()}Entries = {}`
}

function renderZomeFunctionsForType (typeName, fields) {
  const name = typeName
  const lowerName = name.toLowerCase()
  const lowerNamePlural = name.toLowerCase() + 's'

  return `      create_${lowerName}: ({ ${lowerName}_input: ${lowerName}Input }) => {
        const ${lowerName}Index = Object.keys(${lowerName}Entries).length + 1
        const id = 'Id' + ${lowerName}Index
        const createdAt = String(Date.now())
        ${lowerName}Entries[id] = { id, ...${lowerName}Input, created_at: createdAt }
        return {
          id,
          created_at: createdAt,
          ...${lowerName}Input
        }
      },

      get_${lowerName}: ({ id }) => {
        const ${lowerName}Entry = ${lowerName}Entries[id]
        if (!${lowerName}Entry) throw new Error(\`Can't find ${lowerName} with id \${id}\`)
        return {
          id,
          ...${lowerName}Entry
        }
      },

      update_${lowerName}: ({ id, ${lowerName}_input: ${lowerName}Input }) => {
        const ${lowerName}OriginalResult = data.dna.zome.get_${lowerName}({ id })
        ${lowerName}Entries[id] = { ...${lowerName}OriginalResult, ...${lowerName}Input }
        return {
          ...${lowerName}OriginalResult,
          ...${lowerName}Input
        }
      },

      delete_${lowerName}: ({ id }) => {
        const removed${name} = data.dna.zome.get_${lowerName}({ id })
        delete ${lowerName}Entries[id]
        return removed${name}
      },

      list_${lowerNamePlural}: () => Object.keys(${lowerName}Entries)
        .map(key => ({
          id: key,
          ...${lowerName}Entries[key]
        }))
        .sort((a, b) => a.created_at > b.created_at ? -1 : 1),
`
}

module.exports = renderMockData
