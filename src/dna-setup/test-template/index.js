/// NB: The tryorama config patterns are still not quite stabilized.
/// See the tryorama README [https://github.com/holochain/tryorama]
/// for a potentially more accurate example.

const { Orchestrator, Config, combine, callSync, singleConductor, localOnly, tapeExecutor } = require('@holochain/tryorama')
const path = require('path')
const dnaPath = path.join(__dirname, '../dist/dna-src.dna.json')
const dnaHappInstance = 'dnaNameHappInstance'
const dnaTitle = 'dnaName'

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined".
  console.error('got unhandledRejection:', error);
});

const orchestrator = new Orchestrator({
  middleware: combine(
    // Use the tape harness to run the tests, injects the tape API into each scenario
    // as the second argument.
    tapeExecutor(require('tape')),

    // Specify that all "players" in the test are on the local machine, rather than
    // on remote machines.
    localOnly,

    // OPTIONAL:
    // Squash all instances from all conductors down into a single conductor,
    // for in-memory testing purposes.
    // Remove this middleware for other "real" network types which can actually
    // send messages across conductors:
    // singleConductor,
    //
    // Force synchronous calls:
    // callSync,
  ),
})

const logger = {
  type: 'debug',
  rules: {
    rules: [
      {
        exclude: true,
        pattern: '.*parity.*'
      },
      {
        exclude: true,
        pattern: '.*mio.*'
      },
      {
        exclude: true,
        pattern: '.*tokio.*'
      },
      {
        exclude: true,
        pattern: '.*hyper.*'
      },
      {
        exclude: true,
        pattern: '.*rusoto_core.*'
      },
      {
        exclude: true,
        pattern: '.*want.*'
      },
      {
        exclude: true,
        pattern: '.*rpc.*'
      }
    ]
  },
  state_dump: false
}

const dna = Config.dna(dnaPath, dnaHappInstance)
// To test with networking and logs:
const conductorConfig = Config.gen({dnaNameHappInstance: dna}, {
  logger,
  network: {
    type: 'sim2h',
    sim2h_url: 'ws://localhost:9000'
  }
})
// To test without networking and logs:
// const conductorConfig = Config.gen({dnaNameHappInstance: dna})

{ENTRY_TEST_IMPORTS}

orchestrator.run().then(_ => {
  console.log('Testing Complete.')
})

module.exports = { dnaHappInstance, dnaTitle }