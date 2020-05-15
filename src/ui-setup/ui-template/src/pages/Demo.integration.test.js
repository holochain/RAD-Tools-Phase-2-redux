import React from 'react'
import waait from 'waait'
import { fireEvent, within, act, wait } from '@testing-library/react'
import { renderAndWait } from 'utils'
import runConductor from 'utils/integration-testing/runConductorWithFixtures'

describe('demo', () => {
  it('fires up the conductor', runConductor(async () => {
    console.log('running test with conductor')
  })
})