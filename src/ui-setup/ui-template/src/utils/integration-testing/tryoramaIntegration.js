const path = require('path')
export const dnaPath = path.resolve('ui-src/../..', 'dna-src/dist/dna-src.dna.json')
const { Orchestrator, Config, combine, localOnly } = require('@holochain/tryorama')

export const orchestrator = new Orchestrator({
  middleware: combine(
    localOnly,
  ),
})

const dna = Config.dna(dnaPath, 'test-instance')
export const conductorConfig = Config.gen({'test-instance': dna})
