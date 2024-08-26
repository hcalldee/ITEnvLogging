const fs = require('fs');
const path = require('path');

// Define the file contents
const envContent = `
HOST= host api / ip api
PORT= port api
DB_HOST= host db
DB_USER= db user
DB_PASSWORD= db password
DB_NAME= db name
DB_PORT= db port
`;

const babelrcContent = `
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-modules"
  ]
}
`;

const jestConfigContent = `
module.exports = {
  transform: {
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.js$': 'babel-jest', // Add if you have .js files
  },
  testMatch: ['**/unitTest/**/*.test.js'],
  moduleFileExtensions: ['js', 'mjs'],
  testEnvironment: 'node',
};
`;

// Define file paths
const envPath = path.join(__dirname, '.env');
const babelrcPath = path.join(__dirname, '.babelrc');
const jestConfigPath = path.join(__dirname, 'jest.config.js');

// Create files
fs.writeFileSync(envPath, envContent.trim(), 'utf8');
fs.writeFileSync(babelrcPath, babelrcContent.trim(), 'utf8');
fs.writeFileSync(jestConfigPath, jestConfigContent.trim(), 'utf8');

console.log('Files have been created successfully.');
