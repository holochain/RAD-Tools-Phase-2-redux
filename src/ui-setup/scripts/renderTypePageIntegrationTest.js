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
  afterEach(() => {
    exec('npm run hc:stop', (error, stderr) => {
      if (error) throw new Error(\`exec error: \${error}\`)
      else if (stderr) throw new Error(\`stderr: \${stderr}\`) 
    })
  })
  it('Arrives at ${name} Entries Page with Display Title', async () => {
    const { alice } = await s.players({alice: conductorConfig}, true)
    const { getByText, getByLabelText, getByDisplayValue, getAllByText, debug } = await renderAndWait(<HApp />)
    const welcomeMsg = 'Welcome to your generated Happ UI'
    expect(getByText(welcomeMsg)).toBeInTheDocument()
  
    await act(async () => {
      fireEvent.click(getByText('${name}'))
    })
    await wait(() => getByText('${name} Entry'))

    const ${lowerName} = { ${renderPopulatedFields(fields)}
    }

    // create ${name}
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

    const new${capitalizedLowerName} = { ${renderPopulatedFields(fields)}
    }
  
    // update ${name}
    const editButton = getByText('Edit')

    act(() => {
      fireEvent.click(editButton)
    })

    act(() => { ${mapObject(fields, fieldName =>`
      fireEvent.change(getByDisplayValue('${lowerName}.${toCamelCase(fieldName)}'), { target: { value: new${capitalizedLowerName}.${toCamelCase(fieldName)} } })`).join('')}
    })
    const submitButton = getAllByText('Submit')[1]
    await act(async () => {
      fireEvent.click(submitButton)
      await waait(0)
    })

    await s.consistency()
    ${mapObject(fields, fieldName =>`
    expect(getByText(new${capitalizedLowerName}.${toCamelCase(fieldName)})).toBeInTheDocument()`).join('')} 

    // delete ${name}
    const removeButton = getAllByText('Remove')[0]
    await act(async () => {
      fireEvent.click(removeButton)
      await waait(0)
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
