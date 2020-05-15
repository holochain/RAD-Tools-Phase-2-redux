const faker = require('faker')
faker.seed(1)
const mapObject = require('./render-utils').mapObject

function renderTypePageTest (typeName, fields) {
  const name = typeName
  const namePlural = name + 's'
  const capsName = typeName.toUpperCase()
  const capsNamePlural = capsName + 'S'
  const lowerName = typeName.toLowerCase()
  const lowerNamePlural = lowerName + 's'

  return `import React from 'react'
import wait from 'waait'
import { fireEvent, act } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { renderAndWait } from '../utils'
import ${namePlural}Page, { LIST_${capsNamePlural}_QUERY, CREATE_${capsName}_MUTATION, UPDATE_${capsName}_MUTATION, DELETE_${capsName}_MUTATION } from './${namePlural}Page'

const ${lowerNamePlural} = [
  {
    id: 1,
${renderPopulatedFields(fields)}
  },
  {
    id: 2,
${renderPopulatedFields(fields)}
  }
]

const ${lowerName} = {
${renderPopulatedFields(fields, '  ')}
}

it('renders "${namePlural}" title', async () => {
  const mocks = []
  const { getByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <${namePlural}Page />
  </MockedProvider>)

  const title = getByText('${namePlural}')
  expect(title).toBeInTheDocument()
})

it('renders a list of ${namePlural}', async () => {
  const listMock = {
    request: {
      query: LIST_${capsNamePlural}_QUERY
    },
    result: {
      data: {
        list${namePlural}: ${lowerNamePlural}
      }
    }
  }
  const mocks = [listMock]
  const { getAllByTestId } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <${namePlural}Page />
  </MockedProvider>)

  const ${lowerName}Cards = getAllByTestId('${lowerName}-card')
  expect(${lowerName}Cards).toHaveLength(${lowerNamePlural}.length)
})

it('calls the create mutation', async () => {
  const createMock = {
    request: {
      query: CREATE_${capsName}_MUTATION,
      variables: { ${lowerName}Input: ${lowerName} }
    },
    newData: jest.fn(() => ({
      data: {
        create${name}: {
          id: 1,
          ...${lowerName}
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_${capsNamePlural}_QUERY
    },
    result: {
      data: {
        list${namePlural}: []
      }
    }
  }

  const mocks = [createMock, listMock, listMock]
  const { getByLabelText, getByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <${namePlural}Page />
  </MockedProvider>)

  act(() => {
${mapObject(fields, fieldName =>
    `    fireEvent.change(getByLabelText('${fieldName}'), { target: { value: ${lowerName}.${fieldName} } })`).join('\n')}
  })

  await act(async () => {
    fireEvent.click(getByText('Submit'))
    await wait(0)
  })

  expect(createMock.newData).toHaveBeenCalled()
})

it('calls the update mutation', async () => {
  const new${name} = {
${renderPopulatedFields(fields)}
  }

  const updateMock = {
    request: {
      query: UPDATE_${capsName}_MUTATION,
      variables: { id: ${lowerNamePlural}[0].id, ${lowerName}Input: new${name} }
    },
    newData: jest.fn(() => ({
      data: {
        update${name}: {
          id: ${lowerNamePlural}[0].id,
          ...new${name}
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_${capsNamePlural}_QUERY
    },
    result: {
      data: {
        list${namePlural}: ${lowerNamePlural}
      }
    }
  }

  const mocks = [updateMock, listMock, listMock]
  const { getByDisplayValue, getAllByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <${namePlural}Page />
  </MockedProvider>)

  const editButton = getAllByText('Edit')[0]

  act(() => {
    fireEvent.click(editButton)
  })

  act(() => {
${mapObject(fields, fieldName =>
    `    fireEvent.change(getByDisplayValue(${lowerNamePlural}[0].${fieldName}), { target: { value: new${name}.${fieldName} } })`).join('\n')}
  })

  const submitButton = getAllByText('Submit')[1]

  await act(async () => {
    fireEvent.click(submitButton)
    await wait(0)
  })

  expect(updateMock.newData).toHaveBeenCalled()
})

it('calls the delete mutation', async () => {
  const deleteMock = {
    request: {
      query: DELETE_${capsName}_MUTATION,
      variables: { id: ${lowerNamePlural}[0].id }
    },
    newData: jest.fn(() => ({
      data: {
        delete${name}: {
          ...${lowerNamePlural}[0]
        }
      }
    }))
  }

  const listMock = {
    request: {
      query: LIST_${capsNamePlural}_QUERY
    },
    result: {
      data: {
        list${namePlural}: ${lowerNamePlural}
      }
    }
  }

  const mocks = [deleteMock, listMock, listMock]
  const { getAllByText } = await renderAndWait(<MockedProvider mocks={mocks} addTypename={false}>
    <${namePlural}Page />
  </MockedProvider>)

  const removeButton = getAllByText('Remove')[0]

  await act(async () => {
    fireEvent.click(removeButton)
    await wait(0)
  })

  expect(deleteMock.newData).toHaveBeenCalled()
})
`
}

function renderPopulatedFields (fields, indentation = '    ') {
  return mapObject(fields, fieldName => `${indentation}${fieldName}: '${faker.lorem.words()}'`).join(',\n')
}

module.exports = renderTypePageTest
