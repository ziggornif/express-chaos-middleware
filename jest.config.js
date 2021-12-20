/**
 * @type {import('@jest/types').Config.GlobalConfig}
 */
module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  reporters: ['default'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],
  coverageDirectory: '<rootDir>/coverage/',
  testPathIgnorePatterns: ['node_modules'],
};
