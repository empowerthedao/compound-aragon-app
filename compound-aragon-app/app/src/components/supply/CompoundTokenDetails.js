import React from "react"
import {Split} from '@aragon/ui'
import {useNetwork} from "@aragon/api-react";
import SupplyDetails from "./SupplyDetails";
import SupplyActivity from "./SupplyActivity";

const CompoundTokenDetails = ({compoundToken, network, tokens, isSyncing}) => {

    return (
        <div css={'margin-top: 16px'}>
            <Split
                primary={
                    <SupplyActivity
                        compoundToken={compoundToken}
                        tokens={tokens}
                    />}
                secondary={
                    <SupplyDetails
                        network={network}
                        compoundToken={compoundToken}
                        tokens={tokens}
                        isSyncing={isSyncing}
                    />}
            />
        </div>

    )
}

export default props => {
    const network = useNetwork()
    return <CompoundTokenDetails network={network} {...props} />
}
