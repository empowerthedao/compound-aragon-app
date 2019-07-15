[![CircleCI](https://circleci.com/gh/compound-finance/money-market-presidio/tree/master.svg?style=svg&circle-token=abe575a0b356023d18b7c6a672a8bc81688ca4bc)](https://circleci.com/gh/compound-finance/money-market-presidio/tree/master) [![codecov](https://codecov.io/gh/compound-finance/money-market-presidio/branch/master/graph/badge.svg?token=Kfp9ybWQmd)](https://codecov.io/gh/compound-finance/money-market-presidio)

Compound Money Market
=====================

The Compound Money Market holds all of the contracts used to implement the Compound protocol. Through the money market cToken contracts, users on the blockchain *supply* capital (Ether or ERC-20 tokens) to earn interest, or *borrow* capital while holding collateral in the contracts. The Compound cToken contracts track these balances and automatically set the interest rate for borrowers.

Before getting started, please read:

* The [Compound Whitepaper](https://github.com/compound-finance/money-market-presidio/tree/master/docs/CompoundWhitepaper.pdf), describing how Compound works
* The [Compound Protocol Specification](https://github.com/compound-finance/money-market-presidio/tree/master/docs/CompoundProtocol.pdf), explaining in plain English how the protocol operates

Contracts
=========

We detail a few of the core contracts in the Compound protocol.

<dl>
  <dt>cToken Contract</dt>
  <dd>A Compound cToken. Each cToken is a self-contained Money Market, and supplies balances are represented by cToken ownership.</dd>
</dl>

<dl>
  <dt>Comptroller</dt>
  <dd>A contract which validates permissible user actions. For instance, the Comptroller enforces that each borrowing user must maintain a collateral balance across all cTokens.</dd>
</dl>

<dl>
  <dt>Careful Math</dt>
  <dd>Library for safe math operations.</dd>
</dl>

<dl>
  <dt>ErrorReporter</dt>
  <dd>Library for tracking error codes and failure conditions.</dd>
</dl>

<dl>
  <dt>Exponential</dt>
  <dd>Library for handling fixed-point decimal numbers.</dd>
</dl>

<dl>
  <dt>InterestRateModel</dt>
  <dd>Contracts which define our interest rate models.</dd>
</dl>

<dl>
  <dt>SafeToken</dt>
  <dd>Library for safely handling ERC20 interaction.</dd>
</dl>

<dl>
  <dt>StandardInterestRateModel</dt>
  <dd>Initial interest rate model, as defined in the Whitepaper.</dd>
</dl>

Installation
------------
To run compound, pull the repository from GitHub and install its dependencies. You will need [yarn](https://yarnpkg.com/lang/en/docs/install/) or [npm](https://docs.npmjs.com/cli/install) installed.

    git clone https://github.com/compound-finance/money-market-presidio
    cd money-market-presidio
    yarn

You can then compile and deploy the contracts with:

    truffle compile
    truffle migrate

REPL
----

The Money Market has a simple scenario evaluation tool to test and evaluate scenarios which could occur on the blockchain. This tool has a simple REPL to interact with local Compound cToken markets.

    yarn run repl -n development
    yarn run repl -n rinkeby

See the [Scenario Docs](https://github.com/compound-finance/money-market-presidio/tree/master/scenario/SCENARIO.md) on steps for using the repl.

Deployment
----------

The easiest way to deploy a Comptroller, Price Oracle, Interest Rate Model, ERC-20 Token and cToken is through the REPL.

    # run ganache locally
    yarn run ganache

    # ensure development files don't exist as
    # new ganache instances invalidate old addresses
    rm networks/development*

    # run deployment script
    yarn run deploy

    # if you want, set prices and collateral factors
    yarn run deploy -e zrx_price=11,zrx_cf=0.1,bat_price=11,bat_cf=0.1,omg_price=11,omg_cf=0.1

After that, you'll have a full set of contracts deployed locally. Look in `networks/development.json` for the addresses for those deployed contracts.

If you want to use the more production-final deployment scripts, run:

    # run ganache locally
    yarn run ganache

    # ensure development files don't exist as
    # new ganache instances invalidate old addresses
    rm networks/development*

    # deploy underlying
    scenario/scen/dev/tokens.scen

    # deploy oracle
    scenario/scen/dev/oracle.scen

    # deploy interest rate models, comptroller and ctokens
    scenario/scen/prod/deploy.scen -e close_factor=0.5,max_assets=20,liquidation_incentive=1.05,reserve_factor=0.10

Console
-------

If you'd like to open a truffle console:

    yarn run console

Note: if you are using our standard deployment, this will not write artifacts that truffle expects, so `Comptroller.deployed()` will not work. You can use `Comptroller.at("0x...")` and use the address from the `networks/` folder.

Testing
-------
Contract tests are defined under the [test directory](https://github.com/compound-finance/money-market-presidio/tree/master/test). To run the tests run:

    yarn run test

or with inspection (visit chrome://inspect) and look for a remote target after running:

    node --inspect node_modules/truffle-core/cli.js test

Assertions used in our tests are provided by [ChaiJS](http://chaijs.com).

Code Coverage
-------------
To run code coverage, simply run:

    scripts/ganache-coverage # run ganache in coverage mode
    yarn run coverage

Linting
-------
To lint the code, run:

    yarn run lint

_© Copyright 2019, Compound Labs_

Docker
------

To run in docker:

    # Build the docker image
    docker build -t money-market-presidio .

    # Run a shell to the built image
    docker run -it money-market-presidio /bin/sh

From within a docker shell, you can interact locally with the protocol via ganache and truffle:

    > ganache-cli &
    > yarn run deploy
    > yarn run console
    truffle(development)> Comptroller.at("0x...").then((contract) => comptroller = contract);
    truffle(development)> comptroller.maxAssets().toNumber()
    20

Test net
--------

To deploy on test-net, run:

    RINKEBY_PRIVATE_KEY=<...> yarn run deploy -n rinkeby

where the private key refers to a rinkeby private key in hex form (e.g. this can be the value exported from MetaMask under Settings).

You can choose "rinkeby", "kovan" or "ropsten" as your test net.

Additionally, for not main-net, you can put your test-net private keys in a folder and set the environment variable (e.g. in your `~/.bash_profile`):

```sh
ETHEREUM_NETWORKS_HOME=~/.ethereum
```

The project will search this directory for test-net keys, which you can add as such:

```sh
mkdir -p ~/.ethereum
# Store command via editor or:
pbpaste > ~/.ethereum/rinkeby
chmod 600 ~/.ethereum/rinkeby
```

Note: This method is not safe for production. Production keys should be kept on hardware wallets.

Discussion
----------

For any concerns with the protocol, open an issue or visit us on [Discord](https://discordapp.com/invite/874ntdw) to discuss.

For security concerns, please email [security@compound.finance](mailto:security@compound.finance).
