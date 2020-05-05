const { DNA, DnaHappInstance } = require('../index.js')

module.exports = (scenario, conductorConfig) => {
  
      scenario("create_user", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        // Make a call to a Zome function
        // indicating the function, and passing it an input
        const create_user_result = await alice.call(DNA, DnaHappInstance, "create_user", {"user_input" : {"avatar_url":"User test entry #4 content for the avatar_url field in entry definition.","name":"User test entry #4 content for the name field in entry definition."}})
        // Wait for all network activity to settle
        await s.consistency()
        const get_user_result = await bob.call(DNA, DnaHappInstance, "get_user", {"id": create_user_result.Ok.id})
        t.deepEqual(create_note_result, get_user_result)
      })
      
      scenario("list_users", async (s, t) => {
        const {alice} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        await alice.call(DNA, DnaHappInstance, "create_user", {"user_input" : {"avatar_url":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await alice.call(DNA, DnaHappInstance, "create_user", {"user_input" : {"avatar_url":"User test entry #2 content for the avatar_url field in entry definition.","name":"User test entry #2 content for the name field in entry definition."}})
        await alice.call(DNA, DnaHappInstance, "create_user", {"user_input" : {"avatar_url":"User test entry #3 content for the avatar_url field in entry definition.","name":"User test entry #3 content for the name field in entry definition."}})
        await alice.call(DNA, DnaHappInstance, "create_user", {"user_input" : {"avatar_url":"User test entry #4 content for the avatar_url field in entry definition.","name":"User test entry #4 content for the name field in entry definition."}})
        await s.consistency()
        const result = await alice.call(DNA, DnaHappInstance, "list_users", {})
        t.deepEqual(result.Ok.length, 4)
      })
      
      scenario("remove_user", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_user_result = await alice.call(DNA, DnaHappInstance, "create_user", {"user_input" :  {"avatar_url":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()
        const list_users_result = await bob.call(DNA, DnaHappInstance, "list_users", {})
        t.deepEqual(list_users_result.Ok.length, 1)
        await alice.call(DNA, DnaHappInstance, "remove_user", { "id": create_user_result.Ok.id })
        const list_users_result_2 = await bob.call(DNA, DnaHappInstance, "list_users", {})
        t.deepEqual(list_users_result_2.Ok.length, 0)
      })  
      
      scenario("update_user", async (s, t) => {
        const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
        const create_user_result = await alice.call(DNA, DnaHappInstance, "create_user", {"user_input" : {"avatar_url":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        const update_user_result = await alice.call(DNA, DnaHappInstance, "update_user", {"id": create_user_result.Ok.id, "user_input" : {"avatar_url":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()
        const get_user_result = await alice.call(DNA, DnaHappInstance, "get_user", {"id": create_user_result.Ok.id})
        t.deepEqual(update_user_result, get_user_result)
  
        const update_user_result_2 = await alice.call(DNA, DnaHappInstance, "update_user", {"id": create_user_result.Ok.id, "user_input" : {"avatar_url":"User test entry #1 content for the avatar_url field in entry definition.","name":"User test entry #1 content for the name field in entry definition."}})
        await s.consistency()
        const get_user_result_2 = await bob.call(DNA, DnaHappInstance, "get_user", {"id": create_user_result.Ok.id})
        t.deepEqual(update_user_result_2, get_user_result_2)
      })
      
  
}
