const { dnaHappInstance } = require('../index.js')

module.exports = (scenario, conductorConfig) => {
  
      scenario("create_book", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        // Make a call to a Zome function
        // indicating the function, and passing it an input
        const create_book_result = await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        // Wait for all network activity to settle
        await s.consistency()
        const get_book_result = await bob.call('app', 'zome', "get_book", {"id": create_book_result.Ok.id})
        t.deepEqual(create_book_result, get_book_result)
      })
      
      scenario("delete_book", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_book_result = await alice.call('app', 'zome', "create_book", {"book_input":  {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        await s.consistency()
        const list_books_result = await bob.call('app', 'zome', "list_books", {})
        t.deepEqual(list_books_result.Ok.length, 1)
        await alice.call('app', 'zome', "delete_book", { "id": create_book_result.Ok.id })
        const list_books_result_2 = await bob.call('app', 'zome', "list_books", {})
        t.deepEqual(list_books_result_2.Ok.length, 0)
      })
      
      scenario("validate_entry_delete", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_book_result = await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        await s.consistency()

        const delete_book_result = await bob.call('app', 'zome', "delete_book", {"id": create_book_result.Ok.id })
        let err = JSON.parse(delete_book_result.Err.Internal)
        t.deepEqual(err.kind, {"ValidationFailed":"Agent who did not author is trying to delete"})
      })
  
      scenario("list_books", async (s, t) => {
        const {alice} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #2 content for the author field in entry definition.","title":"Book test entry #2 content for the title field in entry definition.","topic":"Book test entry #2 content for the topic field in entry definition."}})
        await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #3 content for the author field in entry definition.","title":"Book test entry #3 content for the title field in entry definition.","topic":"Book test entry #3 content for the topic field in entry definition."}})
        await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #4 content for the author field in entry definition.","title":"Book test entry #4 content for the title field in entry definition.","topic":"Book test entry #4 content for the topic field in entry definition."}})
        await s.consistency()
        const result = await alice.call('app', 'zome', "list_books", {})
        t.deepEqual(result.Ok.length, 4)
      })
      
      scenario("update_book", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_book_result = await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        const update_book_result = await alice.call('app', 'zome', "update_book", {"id": create_book_result.Ok.id, "book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        await s.consistency()
        const get_book_result = await alice.call('app', 'zome', "get_book", {"id": create_book_result.Ok.id})
        t.deepEqual(update_book_result, get_book_result)

        const update_book_result_2 = await alice.call('app', 'zome', "update_book", {"id": create_book_result.Ok.id, "book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        await s.consistency()
        const get_book_result_2 = await bob.call('app', 'zome', "get_book", {"id": create_book_result.Ok.id})
        t.deepEqual(update_book_result_2, get_book_result_2)
      })
      
      scenario("validate_entry_update", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_book_result = await alice.call('app', 'zome', "create_book", {"book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        await s.consistency()

        const update_book_result = await bob.call('app', 'zome', "update_book", {"id": create_book_result.Ok.id, "book_input": {"author":"Book test entry #1 content for the author field in entry definition.","title":"Book test entry #1 content for the title field in entry definition.","topic":"Book test entry #1 content for the topic field in entry definition."}})
        let err = JSON.parse(update_book_result.Err.Internal)
        t.deepEqual(err.kind, {"ValidationFailed":"Agent who did not author is trying to update"})
      })
  
}
