const React = require('react')
import waait from 'waait'
import { fireEvent, within, act, wait } from '@testing-library/react'
import { renderAndWait } from '../utils'
import { runConductorWithFixtures } from '../utils/integration-testing/runConductorWithFixtures'
import { HApp } from '../index.js'


// scenario('Book Endpoints', async (scenario, jest) => {
//   await scenario.players({alice: conductorConfig}, true)
//   const { getByText } = await renderAndWait(<HApp />)
//   fireEvent.click(getByText('Book'))
//   await scenario.consistency()
//   await waait(0)
//   jest.expect(getByText('Book Entry')).toBeInTheDocument()
// })

describe('Book Endpoints', () => {
  it('Renders Book Page and List of Book Entries', runConductorWithFixtures(async () => {
    const { getByText } = await renderAndWait(<HApp />)
    fireEvent.click(getByText('Book'))
    await waait(0)
    expect(getByText('Book Entry')).toBeInTheDocument()
  }), 15000)

  it('Creates new Book Entries', runConductorWithFixtures(async () => {
    const { getByText, getByLabelText } = await renderAndWait(<HApp />)
    await wait(() => getByText('Book Entry'))

    const newBook = {
      author: 'ut nulla quam',
      title: 'ipsam nobis cupiditate',
      topic: 'sed dignissimos debitis'
    }

    act(() => {
      fireEvent.change(getByLabelText('author'), { target: { value: newBook.author } })
      fireEvent.change(getByLabelText('title'), { target: { value: newBook.title } })
      fireEvent.change(getByLabelText('topic'), { target: { value: newBook.topic } })
    })

    await act(async () => {
      fireEvent.click(getByText('Submit'))
      await waait(0)
    })

    await waait(5000)

    expect(getByText(newBook.author)).toBeInTheDocument()
    expect(getByText(newBook.title)).toBeInTheDocument()
    expect(getByText(newBook.topic)).toBeInTheDocument()
  }), 60000)
})

// scenario("delete_user", async (s, t) => {
//   const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
//   const create_user_result = await alice.call('app', 'zome', "create_user", {"user_input":  {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
//   await s.consistency()
//   const list_users_result = await bob.call('app', 'zome', "list_users", {})
//   t.deepEqual(list_users_result.Ok.length, 1)
//   await alice.call('app', 'zome', "delete_user", { "id": create_user_result.Ok.id })
//   const list_users_result_2 = await bob.call('app', 'zome', "list_users", {})
//   t.deepEqual(list_users_result_2.Ok.length, 0)
// })