const config = require('./jest.common.config')

module.exports = {
  ...config,
  testMatch: [
    '<rootDir>/ui-src/**/__integration_tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/ui-src/**/*.integration.{spec,test}.{js,jsx,ts,tsx}'
  ]
}
