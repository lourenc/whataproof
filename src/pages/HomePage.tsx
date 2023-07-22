import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

import { Account } from '../components/Account'
import { NetworkSwitcher } from '../components/NetworkSwitcher'
import { CreateItemLink } from '../components/CreateItemLink'
import { Blame } from '../components/Blame'

export function HomePage() {
  const { isConnected } = useAccount()

  return (
    <>
      <h1>Home Page</h1>

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
          <h2>Distribute</h2>
          <CreateItemLink />
          <hr />
          <h2>Blame</h2>
          <Blame />
          <hr />
        </>
      )}
    </>
  )
}
