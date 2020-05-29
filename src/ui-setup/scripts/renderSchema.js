const mapObject = require('./render-utils').mapObject
const { toCamelCase, capitalize } = require('../../setup/utils.js')

function renderSchema ({ types }) {
  return `import gql from 'graphql-tag'

export default gql\`
${mapObject(types, renderTypeDef).join('\n')}
${renderQueryDef(types)}
${renderMutationDef(types)}\`
`
}

function renderTypeDef (typeName, { definition: type }) {
  return `type ${capitalize(typeName)} {
  id: ID
${mapObject(type, renderField).join('\n')}
}

input ${capitalize(typeName)}Input {
${mapObject(type, renderField).join('\n')}      
}
`
}

function renderField (name, type) {
  const rustToGraphqlType = {
    string: 'String'
  }
  const graphqlType = rustToGraphqlType[type]
  return `  ${toCamelCase(name)}: ${graphqlType}`
}

function renderQueryDef (types) {
  return `type Query {
${mapObject(types, renderTypeQueries).join('')}}
`
}

function renderTypeQueries (typeName) {
  return `  get${capitalize(typeName)}(id: ID): ${typeName}
  list${capitalize(typeName)}s: [${capitalize(typeName)}]
`
}

function renderMutationDef (types) {
  return `type Mutation {
${mapObject(types, renderTypeMutations).join('')}}
`
}

function renderTypeMutations (typeName) {
  return `  create${typeName}(${toCamelCase(typeName)}Input: ${capitalize(typeName)}Input): ${typeName}
  update${typeName}(id: ID, ${toCamelCase(typeName)}Input: ${capitalize(typeName)}Input): ${typeName}
  delete${typeName}(id: ID): ${typeName}
`
}

module.exports = renderSchema
