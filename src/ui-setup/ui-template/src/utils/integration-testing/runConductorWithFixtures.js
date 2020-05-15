const util = require('util')
const exec = util.promisify(require('child_process').exec)
const rimraf = require('rimraf')
const wait = require('waait')

export const DEFAULT_HOLOCHAIN_STORAGE = './.holochain/holo/storage'

export default function runConductorWithFixtures (testFn) {
  return async function () {
    console.log('Creating Testing Environment...')
    await exec('npm run hc:stop')
      .catch(e => {
        // If e.code === 1, error results from no holochain processes being found
        if (e.code === 1) return null
        else console.error('hc:stop error: ', e.stderr)
      })

    await wait(5000)

    const manageStorageFiles = async () => rimraf(DEFAULT_HOLOCHAIN_STORAGE, async (e) => {
      if (e) console.log("Couldn't find holochain storage to remove at", DEFAULT_HOLOCHAIN_STORAGE)
    })

    await manageStorageFiles()

    // hc:start
    exec('npm run hc:start')

    const waitConductor = async () => {
      // eslint-disable-next-line no-unused-vars
      const { _, stderr } = await exec('npm run test:wait-for-conductor')
      if (stderr) console.error('wait-for-conductor error:', stderr)
    }

    return waitConductor()
      .then(() => {
        console.log('Conductor is up...')
        return testFn()
          .catch(async (e) => {
            console.log('Jest Test Error: ', e)
            await exec('npm run hc:stop')
              .then(() => console.log('Conductor Shut Down...'))
              .catch(e => null)
            throw new Error('End of Test: Scenario Test Failed')
          })
      })
      .then(async () => {
        console.log('End of Test: Scenario Test Successful')
        await exec('npm run hc:stop')
          .then(() => console.log('Conductor Successfully Closed.'))
          .catch(e => null)
      })
  }
}
