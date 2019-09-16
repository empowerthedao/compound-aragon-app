# Compound Aragon App

An Aragon app using the [Aragon Agent](https://github.com/aragon/aragon-apps/tree/master/apps/agent) enabling a DAO to 
interact with the Compound protocol. 

The current functionality allows a single cERC20 compound token to be enabled within the app. This token can then be supplied/lent 
to with the corresponding ERC20 token from the DAO to accrue interest.

:rotating-light: Security review status: pre-audit  
The code in this repo has not been audited.

# Development Instructions

To deploy the Compound Aragon app locally first requires installing the Compound protocol locally, then copying key 
addresses from the deployment process into the Aragon app deployment script for the app to use. 

Follow these [instructions to install the compound protocol locally](https://github.com/empowerthedao/compound-aragon-app/tree/master/compound-protocol).

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
Create a DAO and install an instance of the Compound Aragon app (requires re-executing on contract updates):
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