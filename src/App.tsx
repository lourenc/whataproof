import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { Account } from './components/Account'
import { Balance } from './components/Balance'
import { NetworkSwitcher } from './components/NetworkSwitcher'
import { RequestsList } from './components/RequestsList'
import { CreateItemLink } from './components/CreateItemLink'
import { Blame } from './components/Blame'
import { Request } from './components/Request'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <h1>wagmi + RainbowKit + Vite</h1>

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
          <h2>Distribute</h2>
          <CreateItemLink />
          <hr />
          <h2>Blame</h2>
          <Blame />
          <hr />
          <h2>Request</h2>
          <Request itemId='itemId' />
        </>
      )}
    </>
  )
}
