const React = require('react')
import waait from 'waait'
import { fireEvent, within, act, wait } from '@testing-library/react'
import { renderAndWait } from '../utils'
const runConductor = require('../utils/integration-testing/runConductorWithFixtures')

describe.skip('demo', () => {
  it('fires up the conductor', runConductor(async () => {
    console.log('running test with conductor')
  }))
})
