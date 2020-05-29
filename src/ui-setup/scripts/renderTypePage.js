const mapObject = require('./render-utils').mapObject
const { toCamelCase, capitalize } = require('../../setup/utils.js')

function renderTypePage (typeName, { definition: fields }) {
  const capsName = typeName.toUpperCase()
  const capsNamePlural = capsName + 'S'
  const lowerName = toCamelCase(typeName.toLowerCase())
  const capitalizedLowerName = capitalize(lowerName)
  const capitalizedLowerNamePlural = capitalize(lowerName + 's')

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
import './@type-page.css'

export const LIST_${capsNamePlural}_QUERY = gql\`
  query List${capitalizedLowerNamePlural} {
    list${capitalizedLowerNamePlural} {
${fieldsForGQL}
    }
  }
\`

export const CREATE_${capsName}_MUTATION = gql\`
  mutation Create${capitalizedLowerName}($${lowerName}Input: ${capitalizedLowerName}Input) {
    create${capitalizedLowerName} (${lowerName}Input: $${lowerName}Input) {
${fieldsForGQL}
    }
  }
\`

export const UPDATE_${capsName}_MUTATION = gql\`
  mutation Update${capitalizedLowerName}($id: String, $${lowerName}Input: ${capitalizedLowerName}Input) {
    update${capitalizedLowerName} (id: $id, ${lowerName}Input: $${lowerName}Input) {
${fieldsForGQL}
    }
  }
\`

export const DELETE_${capsName}_MUTATION = gql\`
  mutation Delete${capitalizedLowerName}($id: String) {
    delete${capitalizedLowerName} (id: $id) {
${fieldsForGQL}
    }
  }
\`

function ${capitalizedLowerNamePlural}Page () {
  const { data, refetch } = useQuery(LIST_${capsNamePlural}_QUERY)

  const list${capitalizedLowerNamePlural} = (data && data.list${capitalizedLowerNamePlural}) || []

  const [create${capitalizedLowerName}] = useMutation(CREATE_${capsName}_MUTATION, { refetchQueries: [{ query: LIST_${capsNamePlural}_QUERY }] })
  const [update${capitalizedLowerName}] = useMutation(UPDATE_${capsName}_MUTATION, { refetchQueries: [{ query: LIST_${capsNamePlural}_QUERY }] })
  const [delete${capitalizedLowerName}] = useMutation(DELETE_${capsName}_MUTATION, { refetchQueries: [{ query: LIST_${capsNamePlural}_QUERY }] })

  // the id of the ${capitalizedLowerName} currently being edited
  const [editingId, setEditingId] = useState()
  
  const { push } = useHistory()

  return <div className='type-page'>
  <div className='background-block'/>
  <button className='button home-btn' onClick={() => push('/')}>Home Page</button>
  <br/>
    <h1 className='title'>${capitalizedLowerName} Entry</h1>
    <h2 className='subtitle'>Endpoint Testing</h2>
    <button className='button' onClick={() => refetch()}>Refetch ${capitalizedLowerName} List</button>

    <${capitalizedLowerName}Form
      formAction={({ ${lowerName}Input }) => create${capitalizedLowerName}({ variables: { ${lowerName}Input } })}
      formTitle='Create ${capitalizedLowerName}' />

    <div className='type-list'>
      {list${capitalizedLowerNamePlural}.map(${lowerName} =>
        <${capitalizedLowerName}Row
          key={${lowerName}.id}
          ${lowerName}={${lowerName}}
          editingId={editingId}
          setEditingId={setEditingId}
          delete${capitalizedLowerName}={delete${capitalizedLowerName}}
          update${capitalizedLowerName}={update${capitalizedLowerName}} />)}
    </div>
  </div>
}

function ${capitalizedLowerName}Row ({ ${lowerName}, editingId, setEditingId, update${capitalizedLowerName}, delete${capitalizedLowerName} }) {
  const { id } = ${lowerName}

  if (id === editingId) {
    return <${capitalizedLowerName}Form
      ${lowerName}={${lowerName}}
      formTitle='Update ${capitalizedLowerName}'
      setEditingId={setEditingId}
      formAction={({ ${lowerName}Input }) => update${capitalizedLowerName}({ variables: { id, ${lowerName}Input } })} />
  }

  return <${capitalizedLowerName}Card ${lowerName}={${lowerName}} setEditingId={setEditingId} delete${capitalizedLowerName}={delete${capitalizedLowerName}} />
}

function ${capitalizedLowerName}Card ({ ${lowerName}: { id, ${fieldsForObject} }, setEditingId, delete${capitalizedLowerName} }) {
  return <div className='type-card' data-testid='${lowerName}-card'>
${mapObject(fields, fieldName => `
    <div className='entry-field'><span className='field-label'>${toCamelCase(fieldName)}: </span><span className='field-content'>{${toCamelCase(fieldName)}}</span></div>`).join('')}
    <br/>
    <button className='button' onClick={() => setEditingId(id)}>Edit</button>
    <button onClick={() => delete${capitalizedLowerName}({ variables: { id } })}>Remove</button>
  </div>
}

function ${capitalizedLowerName}Form ({ ${lowerName} = { ${fieldsForObjectWithDefaults} }, formTitle, formAction, setEditingId = () => {} }) {
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

export default ${capitalizedLowerNamePlural}Page
`
}

module.exports = renderTypePage
