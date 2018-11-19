module.exports = {
  extends: 'airbnb-base',
  globals: {
    /* MOCHA */
    describe: false,
    it: false,
    before: false,
    beforeEach: false,
    after: false,
    afterEach: false,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
