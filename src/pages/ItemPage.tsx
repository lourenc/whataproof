import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { Request } from "../components/Request";

export function ItemPage({ id }: { id: string }) {
  const { isConnected } = useAccount();

  return (
    <div className="wrapper">
      <div className="flex-space-between margin-bottom-big">
        <a href="/">Back to homepage</a>
        <ConnectButton />
      </div>

      {isConnected && (
        <div className="nes-container with-title">
          <span className="title">Request</span>
          <Request itemId={id} />
        </div>
      )}
    </div>
  );
}
