To deploy Compound protocol, requires node v10 and recent version of `ganache-cli` (can probably replace `yarn` wth `npm`:

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