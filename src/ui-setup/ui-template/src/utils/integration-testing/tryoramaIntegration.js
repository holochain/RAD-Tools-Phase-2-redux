const { Orchestrator, Config, combine, callSync, singleConductor, localOnly, tapeExecutor } = require('@holochain/tryorama')
const path = require('path')
const dnaPath = path.join(__dirname, "../../../../dna-src/dist/dna-src.dna.json")
const { reactTestingExecutor } = require('./reactTestingMiddleware')


// process.on('unhandledRejection', error => {
//   // Will print "unhandledRejection err is not defined".
//   console.error('got unhandledRejection:', error)
// });

export const orchestrator = new Orchestrator({
  middleware: combine(
    // Use the tape harness to run the tests, injects the tape API into each scenario
    // as the second argument.
    // tapeExecutor(require('tape')),

    // reactTestingExecutor(
    //   require('@testing-library/jest-dom'),
    //   require('@testing-library/react'),
    //   require('@testing-library/user-event')
    // ),

    localOnly,
    singleConductor,
    callSync,
  ),
})

const dna = Config.dna(dnaPath, 'test-instance')
export const conductorConfig = Config.gen({'test-instance': dna})
const integrationTestPath = '../../__integration_tests__'

// require(`${integrationTestPath}/Demo.integration.test.js`)(orchestrator.registerScenario, conductorConfig)
// require(`${integrationTestPath}/Book.integration.test.js`)(orchestrator.registerScenario, conductorConfig)
// require(`${integrationTestPath}/User.integration.test.js`)(orchestrator.registerScenario, conductorConfig)

// orchestrator.run().then(_ => {
//   console.log('Testing Complete.')
// })
