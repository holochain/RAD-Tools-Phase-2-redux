const React = require('react')
// import waait from 'waait'
// import { fireEvent, within, act, wait } from '@testing-library/react'
// import { renderAndWait } from 'utils'
// import runConductor from 'utils/integration-testing/runConductorWithFixtures'
const runConductor = require('ui-src/src/utils/integration-testing/runConductorWithFixtures')

describe.skip('demo', () => {
  it('fires up the conductor', runConductor(async () => {
    console.log('running test with conductor')
  }))
})