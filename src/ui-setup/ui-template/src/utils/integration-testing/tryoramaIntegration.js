const path = require('path')
export const dnaPath = path.resolve('ui-src/../..', 'dna-src/dist/dna-src.dna.json')
const { Orchestrator, Config, combine, localOnly, callSync } = require('@holochain/tryorama')

export const orchestrator = new Orchestrator({
  middleware: combine(
    localOnly,
    callSync
  ),
  waiter: {
    strict: false,
    hardTimeout: 99999999
  }
})
const dna = Config.dna(dnaPath, process.env.REACT_APP_TEST_INSTANCE_ID)

export const conductorConfig = Config.gen({[process.env.REACT_APP_TEST_INSTANCE_ID]: dna}, {
  logger: Config.logger(false)
})
