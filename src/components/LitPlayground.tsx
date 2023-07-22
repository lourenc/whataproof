import { useAccount, useChainId } from "wagmi";
import { useEthersSigner } from "../hooks/useEthersSigner";
import {
  encryptStringWithEOAAccess,
  decryptStringWithEOAAccess,
} from "../lit-sdk";
import { useCallback, useState } from "react";
import { providers } from "ethers";

export function LitPlayground() {
  const chainId = useChainId();
  const signer = useEthersSigner({ chainId });
  const { address } = useAccount();

  const isConnected =
    address !== undefined && signer !== undefined && chainId !== undefined;

  const [receiverAddress, setReceiverAddress] = useState(
    "0xC8837AF38c9615AA10B235Cca68EeDae22bf9B82"
  );

  const [messageToEncrypt, setMessageToEncrypt] = useState(
    "matrix has you, neo"
  );

  const [ipfsCid, setIpfsCid] = useState("");

  const encryptHander = useCallback(async () => {
    if (!isConnected) return;

    const cid = await encryptStringWithEOAAccess(
      chainId,
      signer.provider as providers.Web3Provider,
      address.toLowerCase(),
      receiverAddress,
      messageToEncrypt
    );

    console.info("cid received", cid);

    setIpfsCid(cid);
  }, [signer, address, chainId, receiverAddress, messageToEncrypt]);

  const decryptHandler = useCallback(async () => {
    if (!isConnected) return;

    const decryptedData = await decryptStringWithEOAAccess(
      chainId,
      signer.provider as providers.Web3Provider,
      address.toLowerCase(),
      ipfsCid
    );

    console.info("decrypted data received", decryptedData);

    setMessageToEncrypt(decryptedData.toString());
  }, [signer, address, ipfsCid, chainId]);

  return (
    <div>
      <label>Message:</label>
      <input
        type="text"
        onChange={(e) => setMessageToEncrypt(e.target.value)}
        value={messageToEncrypt}
      />

      <br />

      <label>Receiver address:</label>
      <input
        type="text"
        onChange={(e) => setReceiverAddress(e.target.value)}
        value={receiverAddress}
      />

      <br />

      <label>IPFS CID:</label>
      <input
        type="text"
        onChange={(e) => setIpfsCid(e.target.value)}
        value={ipfsCid}
      />

      <br />

      <button onClick={encryptHander}>Encrypt test</button>

      <button onClick={decryptHandler}>Decrypt test</button>
    </div>
  );
}
