const mapObject = require('./render-utils').mapObject

function renderSchema ({ types }) {
  return `import gql from 'graphql-tag'

export default gql\`
${mapObject(types, renderTypeDef).join('\n')}
${renderQueryDef(types)}
${renderMutationDef(types)}\`
`
}

function renderTypeDef (typeName, type) {
  return `type ${typeName} {
  id: ID
${mapObject(type, renderField).join('\n')}
}

input ${typeName}Input {
  id: ID
${mapObject(type, renderField).join('\n')}      
}
`
}

function renderField (name, type) {
  const rustToGraphqlType = {
    string: 'String'
  }
  const graphqlType = rustToGraphqlType[type]
  return `  ${name}: ${graphqlType}`
}

function renderQueryDef (types) {
  return `type Query {
${mapObject(types, renderTypeQueries).join('')}}
`
}

function renderTypeQueries (typeName) {
  return `  get${typeName}(id: ID): ${typeName}
  list${typeName}s: [${typeName}]
`
}

function renderMutationDef (types) {
  return `type Mutation {
${mapObject(types, renderTypeMutations).join('')}}
`
}

function renderTypeMutations (typeName) {
  return `  create${typeName}(input: ${typeName}Input): ${typeName}
  update${typeName}(input: ${typeName}Input): ${typeName}
  delete${typeName}(id: ID): ${typeName}
`
}

module.exports = renderSchema
