import { useCallback, useEffect, useState } from "react";

import { RequestStatus, Request as RequestModel } from "../models/Request";
import { api } from "../api/api";
import { useAccount, useChainId } from "wagmi";
import { Item } from "../models/Item";
import { decryptFileWithEOAAccess } from "../lit-sdk";
import { useEthersSigner } from "../hooks/useEthersSigner";

function RejectedRequest() {
  return (
    <div>
      <h1>Request rejected</h1>
    </div>
  );
}

function PendingRequest({ request }: { request: RequestModel }) {
  return (
    <div>
      <div>Distibutor: {request.distributor}</div>
      <div>Status: {request.status}</div>
    </div>
  );
}

function ApprovedRequest({ request }: { request: RequestModel }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const signer = useEthersSigner({ chainId: chainId });
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const decryptFileHandler = useCallback(
    async function () {
      if (!request.meta || !address) return;

      const file = await decryptFileWithEOAAccess(
        chainId,
        signer?.provider as any,
        address.toLowerCase(),
        request.meta
      );

      if (!file) {
        throw new Error("Failed to decrypt file");
      }

      setImageBlob(file);
    },
    [chainId, request.meta, address, signer]
  );

  return (
    <div>
      <div>Request id: {request.id}</div>
      <div>Distibutor: {request.distributor}</div>
      <div>Status: {request.status}</div>

      <h1>DO NOT LEAK! LEAKAGE IS TRACEBLE</h1>
      {!imageBlob && <button onClick={decryptFileHandler}>Decrypt file</button>}
      {imageBlob && <img src={URL.createObjectURL(imageBlob)} width={500} />}
    </div>
  );
}

function NoRequest({ onSubmit }: { itemId: string; onSubmit: () => void }) {
  return (
    <div>
      <div>Submit request to view the item</div>
      <button onClick={onSubmit}>Request</button>
    </div>
  );
}

export function Request({ itemId }: { itemId: string }) {
  const account = useAccount();
  const [request, setRequest] = useState<null | RequestModel>(null);
  const [item, setItem] = useState<null | Item>(null);

  useEffect(() => {
    if (!account.address) return;

    api.getRequest(itemId, account.address).then((request) => {
      setRequest(request);
    });

    api.getItem(itemId).then((request) => {
      setItem(request);
    });
  }, [account.address]);

  if (!item) {
    return <h1>Item not found</h1>;
  }

  return (
    <div>
      <div>Item id: {itemId}</div>
      {request?.status === RequestStatus.PENDING && (
        <PendingRequest request={request} />
      )}
      {request?.status === RequestStatus.APPROVED && (
        <ApprovedRequest request={request} />
      )}
      {request?.status === RequestStatus.REJECTED && <RejectedRequest />}
      {!request && (
        <NoRequest
          onSubmit={function (): void {
            if (!item) return;
            api
              .createRequest({
                initiator: account.address!,
                distributor: item.distributor,
                status: RequestStatus.PENDING,
                itemId,
              })
              .then((request) => {
                setRequest(request);
              });
          }}
          itemId={itemId}
        />
      )}
    </div>
  );
}
