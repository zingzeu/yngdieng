module.exports = {
   // preset: 'jest-puppeteer-preset',
    setupFilesAfterEnv: ['./setupTests.js'],
    testMatch: ['**/*.test.js'],
    transform: {'^.+\\.jsx?$': 'babel-jest'},
    };