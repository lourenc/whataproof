import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import 'nes.css/css/nes.min.css';
import '../main.css';

import { CreateItemLink } from '../components/CreateItemLink'
import { Blame } from '../components/Blame'
import { RequestsList } from '../components/RequestsList'
import { ItemsList } from '../components/ItemsList';

export function HomePage() {
  const { isConnected } = useAccount()

  return (
    <div className="wrapper">
      <div className="flex-space-between margin-bottom-big">
        <h1>Whataproof</h1>
        <ConnectButton />
      </div>

      {isConnected && (
        <>
          <div className="main-content-wrapper">
            <div className="main-content-col nes-container with-title">
              <span className="title">Distribute🔗</span>
              <CreateItemLink />
            </div>
            <div className="main-content-col nes-container with-title is-dark">
              <span className="title">Blame🔥</span>
              <Blame />
            </div>
          </div>
          <br />
          <div className="nes-container with-title">
            <span className="title">Distributed items</span>
            <ItemsList />
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
