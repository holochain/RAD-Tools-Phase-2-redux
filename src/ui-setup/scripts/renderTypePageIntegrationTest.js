const faker = require('faker')
faker.seed(1)
const mapObject = require('./render-utils').mapObject
const { toCamelCase, capitalize } = require('../../setup/utils.js')

function renderTypePageIntegrationTest (typeName, { definition: fields }) {
  const name = capitalize(typeName)
  const lowerName = toCamelCase(typeName.toLowerCase())
  const capitalizedLowerName = capitalize(lowerName)

  return `import React from 'react'
import waait from 'waait'
import { fireEvent, act, wait } from '@testing-library/react'
import { renderAndWait, runTestType } from '../utils'
import { orchestrator, conductorConfig } from '../utils/integration-testing/tryoramaIntegration'
import { HApp } from '../index.js'

const testDescription = '${name} Endpoints'

orchestrator.registerScenario(\`\${testDescription} Scenario\`, async s => {
  it('Arrives at ${name} Entries Page with Display Title', async () => {
    const { alice } = await s.players({alice: conductorConfig}, true)
    const { getByText, debug } = await renderAndWait(<HApp />)
    const welcomeMsg = 'Welcome to your generated Happ UI'
    expect(getByText(welcomeMsg)).toBeInTheDocument()
  
    await act(async () => {
      fireEvent.click(getByText('${name}'))
    })
    expect(getByText('${name} Entry')).toBeInTheDocument()

    debug()
    await alice.kill()
  })
  
  it('Creates and Lists new ${name} Entries', async () => {
    const { alice } = await s.players({alice: conductorConfig}, true)
    const { getByText, getByLabelText, debug } = await renderAndWait(<HApp />)
    // await act(async () => {
    //   fireEvent.click(getByText('${name}'))
    // })
    await wait(() => getByText('${name} Entry'))

    const ${lowerName} = { ${renderPopulatedFields(fields)}
    }

    act(() => { ${mapObject(fields, fieldName =>`
      fireEvent.change(getByLabelText('${toCamelCase(fieldName)}'), { target: { value: ${lowerName}.${toCamelCase(fieldName)} } })`).join('')}
    })

    await act(async () => {
      fireEvent.click(getByText('Submit'))
      await waait(0)
    })

    await s.consistency()
    ${mapObject(fields, fieldName =>`
    expect(getByText(${lowerName}.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}

    debug()
    await alice.kill()
  })

  it('Updates and Lists ${name} Entries', async () => {
    const { alice } = await s.players({alice: conductorConfig}, true)
    const { getByText, getByLabelText, getAllByText, getByDisplayValue,  debug } = await renderAndWait(<HApp />)  
    await wait(() => getByText('${name} Entry'))

    // create ${name}
    const ${lowerName} = { ${renderPopulatedFields(fields)}
    }
    
    act(() => { ${mapObject(fields, fieldName =>`
      fireEvent.change(getByLabelText('${toCamelCase(fieldName)}'), { target: { value: ${lowerName}.${toCamelCase(fieldName)} } })`).join('')}    
    })
    await act(async () => {
      fireEvent.click(getByText('Submit'))
      await waait(0)
    })

    await s.consistency()
    ${mapObject(fields, fieldName =>`
    expect(getByText(${lowerName}.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}

    // update book
    const editButton = getAllByText('Edit')[0]
    const new${capitalizedLowerName} = { ${renderPopulatedFields(fields)}
    }

    act(() => {
      fireEvent.click(editButton)
    })

    act(() => { ${mapObject(fields, fieldName =>`
      fireEvent.change(getByDisplayValue('${lowerName}.${toCamelCase(fieldName)}'), { target: { value: new${capitalizedLowerName}.${toCamelCase(fieldName)} } })`).join('')}
    })
    const submitButton = getAllByText('Submit')[1]
    await act(async () => {
      fireEvent.click(submitButton)
      await wait(0)
    })

    await s.consistency()
    ${mapObject(fields, fieldName =>`
    expect(getByText(new${capitalizedLowerName}.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')} 

    debug()
    await alice.kill()
  })

  it('Deletes and Lists ${name} Entries', async () => {
    const { alice } = await s.players({alice: conductorConfig}, true)
    const { getByText, getByLabelText, debug } = await renderAndWait(<HApp />)
    await wait(() => getByText('${name} Entry'))

    // create ${name}
    const ${lowerName} = { ${renderPopulatedFields(fields)}
    }

    act(() => { ${mapObject(fields, fieldName =>`
      fireEvent.change(getByLabelText('${lowerName}.${toCamelCase(fieldName)}'), { target: { value: new${capitalizedLowerName}.${toCamelCase(fieldName)} } })`).join('')}
    })
    await act(async () => {
      fireEvent.click(getByText('Submit'))
      await waait(0)
    })

    await s.consistency()
    ${mapObject(fields, fieldName =>`
    expect(getByText(${lowerName}.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}

    // delete ${name}
    const removeButton = getAllByText('Remove')[0]
    await act(async () => {
      fireEvent.click(removeButton)
      await wait(0)
    })

    await s.consistency()
    ${mapObject(fields, fieldName =>`
    expect(getByText(${lowerName}.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')}

    debug()
    await alice.kill()
  })
})

runTestType(process.env.REACT_APP_TEST_TYPE, 'integration', orchestrator.run)
`
}

function renderPopulatedFields (fields) {
  return mapObject(fields, fieldName => `
      ${toCamelCase(fieldName)}: '${faker.lorem.words()}'`).join(',')
}

module.exports = renderTypePageIntegrationTest
