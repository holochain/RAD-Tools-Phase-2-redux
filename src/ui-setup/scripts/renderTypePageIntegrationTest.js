const faker = require('faker')
faker.seed(1)
const mapObject = require('./render-utils').mapObject
const { toCamelCase, capitalize } = require('../../setup/utils.js')

function renderTypePageIntegrationTest (typeName, { definition: fields }) {
  const name = typeName
  const lowerName = toCamelCase(typeName.toLowerCase())
  const capitalizedLowerName = capitalize(lowerName)

  return `import React from 'react'
import waait from 'waait'
import { fireEvent, act, wait } from '@testing-library/react'
import { renderAndWait, closeTestConductor } from '../utils'
import { orchestrator, conductorConfig } from '../utils/integration-testing/tryoramaIntegration'
import { HApp } from '../index.js'

orchestrator.registerScenario('Tryorama Runs ${name} Endpoints Scenario', async scenario => {
  let agentInstance
  beforeEach(async () => {
    const { agent } = await scenario.players({agent: conductorConfig}, true)
    agentInstance = agent
    return { agent }
  })
  afterEach(() => closeTestConductor(agentInstance, '${name}'))
  describe('${name} Page', () => {
    it('All endpoints work e2e with DNA.', async () => {
      const { getByText, getByLabelText, getByDisplayValue, getAllByText, queryByText } = await renderAndWait(<HApp />)
    
      await act(async () => {
        fireEvent.click(getByText('${name}'))
      })
      await wait(() => getByText('${name} Entry'))

      const ${lowerName}1 = { ${renderPopulatedFields(fields)}
      }

      const ${lowerName}2 = { ${renderPopulatedFields(fields)}
    }

      // create ${name} #1
      act(() => { ${mapObject(fields, fieldName =>`
        fireEvent.change(getByLabelText('${toCamelCase(fieldName)}'), { target: { value: ${lowerName}1.${toCamelCase(fieldName)} } })`).join('')}
      })

      await act(async () => {
        fireEvent.click(getByText('Submit'))
        await waait(1500)
      })

      await act(async () => await scenario.consistency())
      await act(async () => {
        fireEvent.click(getByText('Refetch ${name} List'))
        await waait(1500)
      })
      ${mapObject(fields, fieldName =>`
      expect(getByText(${lowerName}1.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}

      // create ${name} #2
      act(() => { ${mapObject(fields, fieldName =>`
        fireEvent.change(getByLabelText('${toCamelCase(fieldName)}'), { target: { value: ${lowerName}2.${toCamelCase(fieldName)} } })`).join('')}
      })

      await act(async () => {
        fireEvent.click(getByText('Submit'))
        await waait(1500)
      })

      await act(async () => await scenario.consistency())
      await act(async () => {
        fireEvent.click(getByText('Refetch ${name} List'))
        await waait(1500)
      })
      ${mapObject(fields, fieldName =>`
      expect(getByText(${lowerName}2.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}

      const new${capitalizedLowerName} = { ${renderPopulatedFields(fields)}
      }
    
      // update ${name}
      const editButton = getAllByText('Edit')[0]
      await act(async () => {
        fireEvent.click(editButton)
        await waait(1500)
      })

      act(() => { ${mapObject(fields, fieldName =>`
        fireEvent.change(getByDisplayValue(${lowerName}2.${toCamelCase(fieldName)}), { target: { value: new${capitalizedLowerName}.${toCamelCase(fieldName)} } })`).join('')}
      })
      const submitButton = getAllByText('Submit')[1]
      await act(async () => {
        fireEvent.click(submitButton)
        await waait(1500)
      })

      await act(async () => await scenario.consistency())
      await act(async () => {
        fireEvent.click(getByText('Refetch ${name} List'))
        await waait(1500)
      })
      ${mapObject(fields, fieldName =>`
      expect(getByText(new${capitalizedLowerName}.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')} 

      ${mapObject(fields, fieldName =>`
      expect(getByText(${lowerName}1.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}

      ${mapObject(fields, fieldName =>`
      expect(queryByText(${lowerName}2.${toCamelCase(fieldName)})).not.toBeInTheDocument()`).join('')} 

      // delete ${name}
      const removeButton = getAllByText('Remove')[0]
      await act(async () => {
        fireEvent.click(removeButton)
        await waait(1500)
      })

      await act(async () => await scenario.consistency())
      await act(async () => {
        fireEvent.click(getByText('Refetch ${name} List'))
        await waait(1500)
      })
      ${mapObject(fields, fieldName =>`
      expect(queryByText(new${capitalizedLowerName}.${toCamelCase(fieldName)})).not.toBeInTheDocument()`).join('')}

      ${mapObject(fields, fieldName =>`
      expect(getByText(${lowerName}1.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}
    })
  })
})

if (process.env.REACT_APP_TEST_TYPE === 'integration') {
  orchestrator.run()
} else {
  test.skip('', () => {})
}
`
}

function renderPopulatedFields (fields) {
  return mapObject(fields, fieldName => `
      ${toCamelCase(fieldName)}: '${faker.lorem.words()}'`).join(',')
}

module.exports = renderTypePageIntegrationTest
