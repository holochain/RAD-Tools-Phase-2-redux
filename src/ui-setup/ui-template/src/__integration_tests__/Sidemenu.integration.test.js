import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import { renderAndWait } from 'utils/test-utils'
import { HPAdminApp } from 'root'
import runHposApi from 'utils/integration-testing/runHposApiWithSetup'
import HposInterface from 'data-interfaces/HposInterface'

jest.mock('react-media-hook')
jest.mock('react-identicon-variety-pack')
jest.unmock('react-router-dom')

describe.skip('HP Admin : Sidemenu', () => {
  it('Contains the host HPOS API PubKey and Name', runHposApi(async () => {
    const hposSettings = await HposInterface.os.settings()

    const { getByTestId, getByText, debug } = await renderAndWait(<HPAdminApp />)

    debug()

    const menuButton = getByTestId('menu-button')
    fireEvent.click(menuButton)

    await wait(() => getByText('HP Admin'))
    await wait(() => getByText(hposSettings.hostName))
  }), 150000)
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