import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import 'nes.css/css/nes.min.css';
import './HomePage.css';

import { Account } from '../components/Account'
import { NetworkSwitcher } from '../components/NetworkSwitcher'
import { CreateItemLink } from '../components/CreateItemLink'
import { Blame } from '../components/Blame'
import { RequestsList } from '../components/RequestsList'

export function HomePage() {
  const { isConnected } = useAccount()

  return (
    <div className="wrapper">
      <h1>Home Page</h1>

      <ConnectButton />

      {isConnected && (
        <>
          <h2>Network</h2>
          <NetworkSwitcher />
          <br />
          <h2>Account</h2>
          <Account />
          <br />
          <div className="main-content-wrapper">
            <div className="main-content-col nes-container with-title">
              <span className="title">Distribute</span>
              <CreateItemLink />
            </div>
            <div className="main-content-col nes-container with-title is-dark">
              <span className="title">Blame</span>
              <Blame />
            </div>
          </div>
          <br />
          <div className="nes-container with-title">
            <span className="title">Requests</span>
            <RequestsList />
          </div>
        </>
      )}
    </div>
  )
}
