import { render, act } from '@testing-library/react'
import wait from 'waait'

export const closeTestConductor = (alice, testName) => {
  try {
    alice.kill()
  }
  catch(err){
    throw new Error(`Error when killing conductor for the ${testName} test : ${err}`);
  }
}

export async function renderAndWait (ui, ms = 0, options = {}) {
  let queries
  await act(async () => {
    queries = render(ui, options)
    await wait(ms)
  })
  return queries
}
