// const React = require('react')
// const waait = require('waait')
// const { fireEvent } = require('@testing-library/react')
// const { renderAndWait } = require('../utils')
// const { HApp } = require('../index.js')

module.exports = (scenario, conductorConfig) => {
  scenario('Book Endpoints', async (scenario, jest) => {
    console.log('here !!1')
    // await scenario.players({alice: conductorConfig}, true)
    // console.log('here !!2')

    // const { getByText } = await renderAndWait(<HApp />)
    // console.log('here !!3')

    // fireEvent.click(getByText('Book'))
    // await scenario.consistency()
    // await waait(0)
    // console.log('here !!4')

    // jest.expect(getByText('Book Entry')).toBeInTheDocument()

    const newBook = {
      author: 'ut nulla quam',
      title: 'ipsam nobis cupiditate',
      topic: 'sed dignissimos debitis'
    }
    const {alice, bob} = await scenario.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_book_result = await alice.call('test-instance', 'zome', "create_book", { "book_input": newBook })
    // Wait for all network activity to settle
    await scenario.consistency()
    const get_book_result = await bob.call('test-instance', 'zome', "get_book", {"id": create_book_result.Ok.id})
    jest.expect(create_book_result).toEqual(get_book_result)

  })
}
// module.exports = (scenario, conductorConfig) => {
//   scenario('Book Endpoints', async (scenario, jest) => {
//     await scenario.players({alice: conductorConfig}, true)
//     const { getByText } = await renderAndWait(<HApp />)
//     fireEvent.click(getByText('Book'))
//     await scenario.consistency()
//     await waait(0)
//     jest.expect(getByText('Book Entry')).toBeInTheDocument()
//   })
// }
