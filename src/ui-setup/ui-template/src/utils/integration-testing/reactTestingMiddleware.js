const reactTestingExecutor = (jestDom, react, userEvent) => (run, scenarioFn) => new Promise((resolve, reject) => {
    if (scenarioFn.length !== 2) {
      reject("jestExecutor middleware requires scenario functions to take 2 arguments, please check your scenario definitions.")
      return
    }
    run(scenario => {
      describe(scenario.description, test => {
        scenario.fail = test.fail
        const promise = async () => await scenarioFn(scenario, test)
        promise()
          .then(() => {
            done()
            resolve()
          })
          .catch((err) => {
            // Include stack trace from actual test function, but all on one line.
            // This is the best we can do for now without messing with tape internals
            done(err.stack ? err.stack : err)
            reject(err)
          })
      })
      return Promise.resolve()
    })
  })

console.log('typeof reactTestingExecutor : ', typeof reactTestingExecutor)
console.log('reactTestingExecutor : ', reactTestingExecutor)

module.exports = {reactTestingExecutor}
