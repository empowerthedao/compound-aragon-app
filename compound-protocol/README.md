# Compound Protocol Local Deployment

This process deploys the Compound Protocol to a local test chain with a cDai token for testing. 

### Local Deployment 
Instructions are for OSX, other OS's may require additional steps.

Pre-requisite dependencies:
- [NPM from Node v10](https://nodejs.org/en/download/)
- [Aragon CLI](https://github.com/aragon/aragon-cli)
- [Truffle](https://github.com/trufflesuite/truffle)

To locally deploy the Compound protocol requires Node v10 (errors may occur when using a newer version). Execute the following within the `compound-aragon-app/compound-protocol` directory:

Install dependencies:
```
$ npm install
```

Run `aragon devchain` in a separate terminal:
```
$ aragon devchain
```

Deploy Compound protocol (if previously deployed run `rm networks/development*` first)
```
$ npm run deploy
```  


### Compound Interaction Truffle Scripts
Scripts to emulate activity on the Compound protocol. 

:warning: Note that one of `basicUsage.js` or `borrowAndRepayDai.js` must be
executed after deployment of the Compound protocol for the Aragon app to function as expected.

It is also suggested that the `giveAcc0Dai.js` script be run for easier experimentation.

To execute the scripts requires the contracts first be compiled with:
```
$ truffle compile
```

#### Truffle Scripts

Walk through basic functionality required by the Compound Aragon app:
```
$ truffle exec aragon-app-scripts/basicUsage.js
```  

Emulate activity on the Compound network:
```
$ truffle exec aragon-app-scripts/borrowAndRepayDai.js
```

Give account 0, used by the Aragon CLI, some DAI to experiment with:
```
$ truffle exec aragon-app-scripts/giveAcc0Dai.js
```