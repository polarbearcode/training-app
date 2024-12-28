// https://stackoverflow.com/questions/71427330/nextjs-jest-transform-transformignorepatterns-not-working-with-esm-modules
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig = {
  // You can add other jest config overrides here

  testPathIgnorePatterns: ['/node_modules/'],

  preset: 'ts-jest',

  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // DON'T SET THIS HERE - it's overridden below
  transformIgnorePatterns: [],
}

module.exports = async function() {
  const makeConfig = await createJestConfig(customJestConfig)
  const finalJestConfig = await makeConfig()

  // This replaces the default of '/node_modules/'
  finalJestConfig.transformIgnorePatterns[0] =
    '/node_modules/(?!cheerio/)'

  return finalJestConfig
}