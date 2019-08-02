# Compound Protocol Local Deployment

To locally deploy the Compound protocol requires node v10 and a recent version of `ganache-cli` (errors may occur when using an older version) or the `aragon devchain`. Execute the following within the `compound-protocol` directory:

Install dependencies:
```
$ npm install
```

Run `ganache-cli` or `aragon devchain` in a separate terminal:
```
$ ganache-cli
```

Deploy Compound protocol:
```
$ rm networks/development*
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