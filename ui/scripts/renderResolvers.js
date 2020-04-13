const mapObject = require('./render-utils').mapObject

function renderResolvers ({ types }) {
  return `import { createZomeCall } from './holochainClient'

export const resolvers = {
  Query: {
${renderQueryResolvers(types)}
  },

  Mutation: {
${renderMutationResolvers(types)}
  }
}

export default resolvers
`
}

function renderQueryResolvers (types) {
  return mapObject(types, renderQueryResolversForType).join('\n\n')
}

function renderQueryResolversForType (typeName) {
  const lowerTypeName = typeName.toLowerCase()
  return `    get${typeName}: (_, { id }) =>
      createZomeCall('/dna/zome/get_${lowerTypeName}')({ id }),

    list${typeName}s: () =>
      createZomeCall('/dna/zome/list_${lowerTypeName}s')(),`
}

function renderMutationResolvers (types) {
  return mapObject(types, renderMutationResolversForType).join('\n\n')
}

function renderMutationResolversForType (typeName) {
  const lowerTypeName = typeName.toLowerCase()
  const inputVariableName = `${lowerTypeName}Input`
  const inputParamName = `${lowerTypeName}_input`

  return `    create${typeName}: (_, { ${inputVariableName} }) =>
      createZomeCall('/dna/zome/create_${lowerTypeName}')({ ${inputParamName}: ${inputVariableName} }),

    update${typeName}: (_, { ${inputVariableName} }) =>
      createZomeCall('/dna/zome/update_${lowerTypeName}')({ ${inputParamName}: ${inputVariableName} }),

    delete${typeName}: (_, { id }) =>
      createZomeCall('/dna/zome/delete_${lowerTypeName}')({ id }),`
}

module.exports = renderResolvers
