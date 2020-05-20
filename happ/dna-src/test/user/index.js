const { dnaHappInstance } = require('../index.js')

module.exports = (scenario, conductorConfig) => {
  
      scenario("create_user", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        // Make a call to a Zome function
        // indicating the function, and passing it an input
        const create_user_result = await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        // Wait for all network activity to settle
        await s.consistency()
        const get_user_result = await bob.call('app', 'zome', "get_user", {"id": create_user_result.Ok.id})
        t.deepEqual(create_user_result, get_user_result)
      })
      
      scenario("delete_user", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_user_result = await alice.call('app', 'zome', "create_user", {"user_input":  {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()
        const list_users_result = await bob.call('app', 'zome', "list_users", {})
        t.deepEqual(list_users_result.Ok.length, 1)
        await alice.call('app', 'zome', "delete_user", { "id": create_user_result.Ok.id })
        const list_users_result_2 = await bob.call('app', 'zome', "list_users", {})
        t.deepEqual(list_users_result_2.Ok.length, 0)
      })
      
      scenario("validate_entry_delete", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_user_result = await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()

        const delete_user_result = await bob.call('app', 'zome', "delete_user", {"id": create_user_result.Ok.id })
        let err = JSON.parse(delete_user_result.Err.Internal)
        t.deepEqual(err.kind, {"ValidationFailed":"Agent who did not author is trying to delete"})
      })
  
      scenario("list_users", async (s, t) => {
        const {alice} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #2 content for the avatar_url field in entry definition.","name":"User test entry #2 content for the name field in entry definition."}})
        await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #3 content for the avatar_url field in entry definition.","name":"User test entry #3 content for the name field in entry definition."}})
        await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #4 content for the avatar_url field in entry definition.","name":"User test entry #4 content for the name field in entry definition."}})
        await s.consistency()
        const result = await alice.call('app', 'zome', "list_users", {})
        t.deepEqual(result.Ok.length, 4)
      })
      
      scenario("update_user", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_user_result = await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        const update_user_result = await alice.call('app', 'zome', "update_user", {"id": create_user_result.Ok.id, "user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()
        const get_user_result = await alice.call('app', 'zome', "get_user", {"id": create_user_result.Ok.id})
        t.deepEqual(update_user_result, get_user_result)

        const update_user_result_2 = await alice.call('app', 'zome', "update_user", {"id": create_user_result.Ok.id, "user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()
        const get_user_result_2 = await bob.call('app', 'zome', "get_user", {"id": create_user_result.Ok.id})
        t.deepEqual(update_user_result_2, get_user_result_2)
      })
      
      scenario("validate_entry_update", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_user_result = await alice.call('app', 'zome', "create_user", {"user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()

        const update_user_result = await bob.call('app', 'zome', "update_user", {"id": create_user_result.Ok.id, "user_input": {"avatarUrl":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        let err = JSON.parse(update_user_result.Err.Internal)
        t.deepEqual(err.kind, {"ValidationFailed":"Agent who did not author is trying to update"})
      })
  
}
