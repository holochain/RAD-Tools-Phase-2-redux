const mapObject = require('./render-utils').mapObject

function renderResolvers ({ types }) {
  return `import { createZomeCall } from './holochainClient'

  const dnaPath = zomeFunc => \`\${process.env.REACT_APP_INSTANCE_ID}/zome/\${zomeFunc}\`
  
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
      createZomeCall(dnaPath('get_${lowerTypeName}'))({ id }),

    list${typeName}s: () =>
      createZomeCall(dnaPath('list_${lowerTypeName}s'))(),`
}

function renderMutationResolvers (types) {
  return mapObject(types, renderMutationResolversForType).join('\n\n')
}

function renderMutationResolversForType (typeName) {
  const lowerTypeName = typeName.toLowerCase()
  const inputVariableName = `${lowerTypeName}Input`
  const inputParamName = `${lowerTypeName}_input`

  return `    create${typeName}: (_, { ${inputVariableName} }) =>
      createZomeCall(dnaPath('create_${lowerTypeName}'))({ ${inputParamName}: ${inputVariableName} }),

    update${typeName}: (_, { id, ${inputVariableName} }) =>
      createZomeCall(dnaPath('update_${lowerTypeName}'))({ id, ${inputParamName}: ${inputVariableName} }),

    delete${typeName}: (_, { id }) =>
      createZomeCall(dnaPath('delete_${lowerTypeName}'))({ id }),`
}

module.exports = renderResolvers
