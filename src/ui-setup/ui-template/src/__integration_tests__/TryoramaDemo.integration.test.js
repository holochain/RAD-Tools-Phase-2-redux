const React = require('react')
const waait = require('waait')
const { fireEvent, within, act, wait } = require('@testing-library/react')
const { renderAndWait } = require('../utils')
const { runConductorWithFixtures } = require('../utils/integration-testing/runConductorWithFixtures')
const { orchestrator, conductorConfig } = require('../utils/integration-testing/tryoramaIntegration')
const { HApp } = require('../index.js')


module.exports = (scenario, conductorConfig) => {
  scenario('Book Endpoints', async (scenario, jest) => {
    await scenario.players({alice: conductorConfig}, true)
    const { getByText } = await renderAndWait(<HApp />)
    fireEvent.click(getByText('Book'))
    await scenario.consistency()
    await waait(0)
    jest.expect(getByText('Book Entry')).toBeInTheDocument()
  })
}
