```
<Aragon-CLI-Address>

dao new --environment aragon:rinkeby
dao token new "CompoundFinanceDAOToken" "CFDAO" 0 --environment aragon:rinkeby

<DAO-Address>
<DAO-Token-Address>

dao install <DAO-Address> token-manager --app-init none --environment aragon:rinkeby

<Token-Manager-Proxy-Address>

dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <Aragon-CLI-Address> <Aragon-CLI-Address> --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <Aragon-CLI-Address> 1 --environment aragon:rinkeby
dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 500000000000000000 3600 --environment aragon:rinkeby

<Voting-App-Proxy-Address>

dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao install <DAO-Address> agent --environment aragon:rinkeby

<Agent-App-Proxy-Address>

dao install <DAO-Address> compound.open.aragonpm.eth --app-init-args <Agent-App-Proxy-Address> ["'0x6D7F0754FFeb405d23C51CE938289d4835bE3b14'"] --environment aragon:rinkeby

<Compound-App-Proxy-Address>

dao acl create <DAO-Address> <Agent-App-Proxy-Address> EXECUTE_ROLE <Compound-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> SAFE_EXECUTE_ROLE <Compound-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Agent-App-Proxy-Address> TRANSFER_ROLE <Compound-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Compound-App-Proxy-Address> SUPPLY_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Compound-App-Proxy-Address> MODIFY_CTOKENS <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Compound-App-Proxy-Address> REDEEM_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Compound-App-Proxy-Address> TRANSFER_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Compound-App-Proxy-Address> SET_AGENT_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

https://rinkeby.aragon.org/#/<DAO-Address>

https://rinkeby.aragon.org/#/<DAO-Address>/<Compound-App-Proxy-Address>
```
