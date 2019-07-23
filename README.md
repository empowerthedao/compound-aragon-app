# Compound Aragon App

Aragon app for a DAO to interact with Compound's protocol.

To deploy Compound protocol, requires node v10 and recent version of `ganache-cli`. Execute within the `compound-protocol` directory:

Install dependencies:
```
$ npm install
```

Run ganache-cli in a separate terminal:
```
$ ganache-cli
```

Deploy Compound protocol:
```
$ rm networks/development*
$ npm run deploy
```

To test basic functionality:
```
$ truffle exec aragon-app-scripts/basigUsage.js
```