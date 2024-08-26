module.exports = {
    transform: {
      '^.+\\.mjs$': 'babel-jest',
      '^.+\\.js$': 'babel-jest', // Add if you have .js files
    },
    testMatch: ['**/unitTest/**/*.test.js'],
    moduleFileExtensions: ['js', 'mjs'],
    testEnvironment: 'node',
  };