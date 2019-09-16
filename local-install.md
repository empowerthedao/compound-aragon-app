# Local deployment

To deploy the Compound Aragon app locally first requires installing the Compound protocol locally, then copying key 
addresses from the deployment process into the Aragon app deployment script for the app to use. 

## Compound Protocol Deployment 

This process deploys the Compound Protocol to a local test chain with a cDai token for testing. 

Instructions are for OSX, other OS's may require additional steps.

Pre-requisite dependencies:
- [NPM from Node v10](https://nodejs.org/en/download/) (errors may occur when using a version later than v10)
- [Aragon CLI](https://github.com/aragon/aragon-cli)
- [Truffle](https://github.com/trufflesuite/truffle)

Execute the following within the `compound-aragon-app/compound-protocol` directory:

Install dependencies:
```
$ npm install
```

Run a test chain in a separate terminal:
```
$ aragon devchain
```

Deploy Compound protocol (if previously deployed run `$ rm networks/development*` first)
```
$ npm run deploy
```  


## Compound Protocol Setup
Scripts to emulate activity on the Compound protocol. 

> :warning: Note that both of the following scripts must be executed after deployment of the Compound protocol
 for the Aragon app to function as expected.

To execute the scripts requires the contracts first be compiled with:
```
$ truffle compile
```

Emulate activity on the Compound network:
```
$ truffle exec aragon-app-scripts/borrowAndRepayDai.js
```

Give account 0, used by the Aragon CLI, some DAI to experiment with:
```
$ truffle exec aragon-app-scripts/giveAcc0Dai.js
```

## Compound Aragon App Deployment

Execute the following within the `compound-aragon-app` directory.

Install dependencies:
```
$ npm install
```

Copy the cDai address to the Aragon app deployment script:
- Open `compound-protocol/networks/development.json`
- Copy the deployed cDai token address from the JSON at `Contracts.cDAI`  
- Open `compound-aragon-app/package.json` and paste the address into the `start:http:template` command as the last 
argument, replace the address that is already there.   

Serve the web portion of the Aragon app locally:
```
$ npm run start:app
```

Create a DAO and install an instance of the Compound Aragon app (requires canceling and re-executing on contract updates):
```
$ npm run start:http:template
```

After these steps have completed your web browser should open Aragon automatically with the Compound app installed. The
template is setup to give permissions for executing all of the functionality to any address so you should be able to
experiment straight away. 

Any changes made to the web portion of the app should update without any redeployment of the app.  

Any changes to `script.js` require rebuilding the script, to do this execute the following in the `compound-aragon-app/app` directory:
```
$ npm run build:script
```

For further instructions and alternative approaches to deploying Aragon apps locally, see the official 
[react app template](https://github.com/aragon/aragon-react-boilerplate).