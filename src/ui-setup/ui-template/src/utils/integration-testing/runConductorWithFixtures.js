const path = require('path')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const rimraf = require('rimraf')
const wait = require('waait')

const UI_DIR = path.resolve('./')
export const DEFAULT_HOLOCHAIN_TEST_STORAGE = `${UI_DIR}/../.holochain/holo/storage/agent-1/test`

export function runConductorWithFixtures (testFn) {
  return async function () {
    console.log('Creating Testing Environment')

    const manageStorageFiles = async () => rimraf(DEFAULT_HOLOCHAIN_TEST_STORAGE, async (e) => {
      if (e) console.log("Couldn't find holochain storage to remove at", DEFAULT_HOLOCHAIN_TEST_STORAGE)
    })
    const startAndAwaitConductor = async () => {
      process.chdir(`${UI_DIR}/..`)
      const { stdout, stderr } = await exec('npm run hc:start-log && npm run test:wait-for-conductor')
      if (stderr) console.error('Error starting conductor : ', stderr)
      console.log(stdout)
    }

    await manageStorageFiles()
    await wait(3000)

    return startAndAwaitConductor()
      .then(() => {
        console.log('Conductor is ready')
        return testFn()
          .catch(async (e) => {
            console.log('Jest Test Error: ', e)
            await exec('npm run hc:stop && npm run happ:refresh')
              .then(() => console.log('Conductor Shut Down'))
              .catch(e => null)
            throw new Error('End of Test: Scenario Test Failed')
          })
      })
      .then(async () => {
        console.log('End of Test: Scenario Test Successful')
        await exec('npm run hc:stop && npm run happ:refresh')
        .then(() => console.log('Conductor Successfully Closed'))
        .catch(e => {
          // If e.code === 1, error results from no holochain processes being found
          if (e.code === 1) return null
          else console.error('hc:stop error: ', e.stderr)
        })
      })
  }
}
