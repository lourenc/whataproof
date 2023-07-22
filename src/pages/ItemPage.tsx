import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { Account } from '../components/Account'
import { Balance } from '../components/Balance'
import { NetworkSwitcher } from '../components/NetworkSwitcher'
import { RequestsList } from '../components/RequestsList'
import { Request } from '../components/Request'

export function ItemPage({ id }: { id: string }) {
  const { isConnected } = useAccount()

  return (
    <>
      <h1>Item {id}</h1>

      <ConnectButton />

      {isConnected && (
        <>
          <hr />
          <h2>Network</h2>
          <NetworkSwitcher />
          <br />
          <hr />
          <h2>Account</h2>
          <Account />
          <br />
          <hr />
          <h2>Balance</h2>
          <Balance />
          <hr />
          <h2>Requests</h2>
          <RequestsList />
          <hr />
          <h2>Request</h2>
          <Request itemId={id}/>
        </>
      )}
    </>
  )
}
