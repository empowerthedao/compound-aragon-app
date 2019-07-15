# Compound Aragon App

Aragon app for a DAO to interact with Compound's protocol.

To deploy Compound protocol, requires node v10 and recent version of `ganache-cli` (can probably replace `yarn` wth `npm`) execute within the `compound-protocol` directory:

Install dependencies:
```
$ yarn install
```

Run ganache-cli in a separate terminal:
```
$ ganache-cli
```

Deploy Compound protocol:
```
$ rm networks/development*
$ yarn run deploy
```

To test basic functionality:
```
$ truffle exec aragon-app-scripts/basigUsage.js
```