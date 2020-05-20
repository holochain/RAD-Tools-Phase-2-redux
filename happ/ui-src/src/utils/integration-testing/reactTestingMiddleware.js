const jestExecutor = jest => (run, scenarioFn) => new Promise((resolve, reject) => {
    if (scenarioFn.length !== 2) {
      reject("jestExecutor middleware requires scenario functions to take 2 arguments, please check your scenario definitions.")
      return
    }
    run(scenario => {
      describe(scenario.description, jest => {
        scenario.fail = jest.fail
        const promise = async () => await scenarioFn(scenario, jest)
        const { done } = jest
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

  module.exports = { jestExecutor }
