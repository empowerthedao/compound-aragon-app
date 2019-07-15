"use strict";

const WalletProvider = require("truffle-hdwallet-provider");
const fs = require('fs');
const path = require('path');

const networks = ["rinkeby", "kovan", "ropsten", "mainnet"];

const infuraNetworks = networks.reduce((networks, network) => {
  const envVarName = `${network.toUpperCase()}_PRIVATE_KEY`
  let privateKeyHex = process.env[envVarName];
  const networksHome = process.env['ETHEREUM_NETWORKS_HOME'];
  let networkProviderUrl = process.env['PROVIDER_URL'];

  if (networksHome && !privateKeyHex) {
    try {
      // Try to read from file
      const networkPathResolved = path.join(fs.realpathSync(networksHome), network);
      privateKeyHex = fs.readFileSync(networkPathResolved, 'UTF8').trim();
    } catch (e) {
      // File does not exist or is inaccessible
    }
  }

  if (networksHome && !networkProviderUrl) {
    try {
      // Try to read from file
      const networkPathResolved = path.join(fs.realpathSync(networksHome), `${network}-url`);
      networkProviderUrl = fs.readFileSync(networkPathResolved, 'UTF8').trim();
    } catch (e) {
      // File does not exist or is inaccessible
    }
  }

  if (!networkProviderUrl) { // Not found from env nor from file, default to infura
    networkProviderUrl = `https://${network}.infura.io/`;
  }

  if (privateKeyHex) {
    const provider = new WalletProvider(privateKeyHex, networkProviderUrl);
    const gas = 6600000;
    const gasPrice = 15000000000; // 15 gwei
    provider.opts = {gas, gasPrice};
    process.env[`${network}_opts`] = JSON.stringify(provider.opts);

    return {
      ...networks,
      [network]: {
        host: "localhost",
        port: 8545,
        network_id: "*",
        gas: gas,
        gasPrice: gasPrice,
        provider,
      }
    };
  } else {
    return networks;
  }
}, {});

let mochaOptions = {
  reporter: "mocha-multi-reporters",
  reporterOptions: {
    configFile: "reporterConfig.json"
  }
};

if (process.env.NETWORK === 'coverage') {
  mochaOptions = {
    enableTimeouts: false,
    grep: /@gas/,
    invert: true
  };
}

const development = {
  host: "localhost",
  port: 8545,
  network_id: "*",
  gas: 6700000,
  gasPrice: 20000,
}

const coverage = { // See example coverage settings at https://github.com/sc-forks/solidity-coverage
  host: "localhost",
  network_id: "*",
  gas: 0xfffffffffff,
  gasPrice: 0x01,
  port: 8555
};

const test = {
  host: "localhost",
  port: 8545,
  network_id: "*",
  gas: 20000000,
  gasPrice: 20000
};

process.env[`development_opts`] = JSON.stringify(development);
process.env[`coverage_opts`] = JSON.stringify(coverage);
process.env[`test_opts`] = JSON.stringify(test);

module.exports = {
  networks: {
    ...infuraNetworks,
    development,
    coverage,
    test
  },
  compilers: {
    solc: {
      version: "0.5.8",
      settings: {
        optimizer: {
          enabled: true
        }
      }
    }
  },
  mocha: mochaOptions,
  contracts_build_directory: process.env.CONTRACTS_BUILD_DIRECTORY || undefined
};
