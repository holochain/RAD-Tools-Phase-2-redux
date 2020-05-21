import { render, act } from '@testing-library/react'
import wait from 'waait'

export const runTestType = (processTestType, testType, testFn) => {
  if (testType === processTestType) return testFn()
  else return test.skip('', () => {})
}

export async function renderAndWait (ui, ms = 0, options = {}) {
  let queries
  await act(async () => {
    queries = render(ui, options)
    await wait(ms)
  })
  return queries
}
