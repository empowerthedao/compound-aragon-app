module.exports = {
  port: 8555,
  norpc: true,
  testCommand: process.env['TEST_COMMAND'] || 'NETWORK=coverage scripts/test',
  skipFiles: ['FormalMoneyMarket.sol', 'test_contracts'].concat(
    process.env['SKIP_UNITROLLER'] ? ['Unitroller.sol'] : []),
  deepSkip: true
};
