# Compound Protocol Local Deployment

Instructions are for OSX, other OS's may require additional steps.

Pre-requisite dependencies:
- [NPM from Node v10](https://nodejs.org/en/download/)
- [Ganache CLI](https://github.com/trufflesuite/ganache-cli) or [Aragon CLI](https://github.com/aragon/aragon-cli)
- [Truffle](https://github.com/trufflesuite/truffle)

To locally deploy the Compound protocol requires Node v10 (errors may occur when using a newer version) and the most recent version of `ganache-cli` (errors may occur when using an older version) or the `aragon devchain`. Execute the following within the `compound-aragon-app/compound-protocol` directory:

Install dependencies:
```
$ npm install
```

Run `ganache-cli` or `aragon devchain` in a separate terminal:
```
$ ganache-cli
```

Deploy Compound protocol (If previously deployed run: `rm networks/development*` first)

```
$ scenario/scen/deploy.scen -e dai_price=0.1,dai_cf=0.5,eth_cf=0.5
```

To test basic functionality required by the Compound Aragon app:  
- Copy the `compound-protocol/aragon-app-scripts/test` directory to the `compound-protocol/contracts` directory  
- Compile the contracts:
```
$ truffle compile
```
- Delete the `compound-protocol/contracts/test` directory (as it prevents re-deployment of the Compound protocol using the instructions above)
- Execute the basicUsage script:
```
$ truffle exec aragon-app-scripts/basicUsage.js
```