const mapObject = require('./render-utils').mapObject
const { toCamelCase } = require('../../setup/utils.js')

function renderTypePage (typeName, { definition: fields }) {
  const name = typeName
  const namePlural = name + 's'
  const capsName = typeName.toUpperCase()
  const capsNamePlural = capsName + 'S'
  const lowerName = toCamelCase(typeName.toLowerCase())

  const fieldsForGQL = `      id
${mapObject(fields, fieldName => {
    const formattedFieldName = toCamelCase(fieldName)
    return `      ${formattedFieldName}`
  }).join('\n')}`
  const fieldsForArray = mapObject(fields, fieldName => `'${toCamelCase(fieldName)}'`).join(', ')
  const fieldsForObject = mapObject(fields, fieldName => `${toCamelCase(fieldName)}`).join(', ')
  const fieldsForObjectWithDefaults = mapObject(fields, fieldName => `${toCamelCase(fieldName)}: ''`).join(', ')

  return `import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import gql from 'graphql-tag'
import { pick } from 'lodash/fp'
import { useQuery, useMutation } from '@apollo/react-hooks'
import './type-page.css'

export const LIST_${capsNamePlural}_QUERY = gql\`
  query List${namePlural} {
    list${namePlural} {
${fieldsForGQL}
    }
  }
\`

export const CREATE_${capsName}_MUTATION = gql\`
  mutation Create${name}($${lowerName}Input: ${name}Input) {
    create${name} (${lowerName}Input: $${lowerName}Input) {
${fieldsForGQL}
    }
  }
\`

export const UPDATE_${capsName}_MUTATION = gql\`
  mutation Update${name}($id: String, $${lowerName}Input: ${name}Input) {
    update${name} (id: $id, ${lowerName}Input: $${lowerName}Input) {
${fieldsForGQL}
    }
  }
\`

export const DELETE_${capsName}_MUTATION = gql\`
  mutation Delete${name}($id: String) {
    delete${name} (id: $id) {
${fieldsForGQL}
    }
  }
\`

function ${namePlural}Page () {
  const { data } = useQuery(LIST_${capsNamePlural}_QUERY)

  const list${namePlural} = (data && data.list${namePlural}) || []

  const [create${name}] = useMutation(CREATE_${capsName}_MUTATION, { refetchQueries: [{ query: LIST_${capsNamePlural}_QUERY }] })
  const [update${name}] = useMutation(UPDATE_${capsName}_MUTATION, { refetchQueries: [{ query: LIST_${capsNamePlural}_QUERY }] })
  const [delete${name}] = useMutation(DELETE_${capsName}_MUTATION, { refetchQueries: [{ query: LIST_${capsNamePlural}_QUERY }] })

  // the id of the ${lowerName} currently being edited
  const [editingId, setEditingId] = useState()
  
  const { push } = useHistory()

  return <div className='type-page'>
  <div className='background-block'/>
  <button className='button' onClick={() => push('/')}>Home Page</button>
  <br/>
    <h1>${name} Entry</h1>
    <h2>Endpoint Testing</h2>
    <${name}Form
      formAction={({ ${lowerName}Input }) => create${name}({ variables: { ${lowerName}Input } })}
      formTitle='Create ${name}' />

    <div className='type-list'>
      {list${namePlural}.map(${lowerName} =>
        <${name}Row
          key={${lowerName}.id}
          ${lowerName}={${lowerName}}
          editingId={editingId}
          setEditingId={setEditingId}
          delete${name}={delete${name}}
          update${name}={update${name}} />)}
    </div>
  </div>
}

function ${name}Row ({ ${lowerName}, editingId, setEditingId, update${name}, delete${name} }) {
  const { id } = ${lowerName}

  if (id === editingId) {
    return <${name}Form
      ${lowerName}={${lowerName}}
      formTitle='Update ${name}'
      setEditingId={setEditingId}
      formAction={({ ${lowerName}Input }) => update${name}({ variables: { id, ${lowerName}Input } })} />
  }

  return <${name}Card ${lowerName}={${lowerName}} setEditingId={setEditingId} delete${name}={delete${name}} />
}

function ${name}Card ({ ${lowerName}: { id, ${fieldsForObject} }, setEditingId, delete${name} }) {
  return <div className='type-card' data-testid='${lowerName}-card'>
${mapObject(fields, fieldName => `
    <div className='entry-field'><span className='field-label'>${toCamelCase(fieldName)}: </span><span className='field-content'>{${toCamelCase(fieldName)}}</span></div>`).join('')}
    <br/>
    <button className='button' onClick={() => setEditingId(id)}>Edit</button>
    <button onClick={() => delete${name}({ variables: { id } })}>Remove</button>
  </div>
}

function ${name}Form ({ ${lowerName} = { ${fieldsForObjectWithDefaults} }, formTitle, formAction, setEditingId = () => {} }) {
  const [formState, setFormState] = useState(pick([${fieldsForArray}], ${lowerName}))
  const { ${fieldsForObject} } = formState

  const setField = field => ({ target: { value } }) => setFormState(formState => ({
    ...formState,
    [field]: value
  }))

  const clearForm = () => {
    setFormState({
${mapObject(fields, fieldName => `      ${toCamelCase(fieldName)}: ''`).join(',\n')}
    })
  }

  const onSubmit = () => {
    formAction({
      ${lowerName}Input: {
        ...formState
      }
    })
    setEditingId(null)
    clearForm()
  }

  const onCancel = () => {
    setEditingId(null)
    clearForm()
  }

  return <div className='type-form'>
    <h3>{formTitle}</h3>
${mapObject(fields, fieldName => `    <div className='form-row'>
      <label htmlFor='${toCamelCase(fieldName)}'>${toCamelCase(fieldName)}</label>
      <input id='${toCamelCase(fieldName)}' name='${toCamelCase(fieldName)}' value={${toCamelCase(fieldName)}} onChange={setField('${toCamelCase(fieldName)}')} />
    </div>
`).join('')}
    <div>
      <button onClick={onSubmit}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  </div>
}

export default ${namePlural}Page
`
}

module.exports = renderTypePage
