import "../main.css";

import { RequestStatus, Request } from "../models/Request";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { decryptFileWithEOAAccess, encryptFileWithEOAAccess } from "../lit-sdk";
import { useAccount, useNetwork } from "wagmi";
import { useEthersSigner } from "../hooks/useEthersSigner";

export function RequestsListItem(
  props: Request & { onApprove: () => void; onReject: () => void }
) {
  const { id, initiator: initinator, distributor: distibutor, itemId } = props;
  return (
    <tr>
      <td>
        {props.status === RequestStatus.PENDING ? (
          <div className="vertical-small-gap">
            <button onClick={props.onApprove} className="nes-btn is-success">
              Approve
            </button>
            <button onClick={props.onReject} className="nes-btn is-error">
              Reject
            </button>
          </div>
        ) : (
          props.status
        )}
      </td>
      <td>{id}</td>
      <td>{initinator}</td>
      <td>{distibutor}</td>
      <td>{itemId}</td>
    </tr>
  );
}

export function RequestsList() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const signer = useEthersSigner({ chainId: chain?.id });

  const [requests, setRequests] = useState<Request[]>([]);
  const account = useAccount();

  useEffect(() => {
    if (!account.address) return;
    api.getRequests(account.address).then(setRequests);
  }, [account.address]);

  const onApprove = async (request: Request) => {
    if (!chain || !address || !signer) {
      return;
    }

    const { id, itemId } = request;
    const item = await api.getItem(itemId);
    const encryptedFileCid = item.meta;
    const decryptedOriginalFile = await decryptFileWithEOAAccess(
      chain.id,
      signer.provider as any,
      address.toLowerCase(),
      encryptedFileCid
    );

    if (!decryptedOriginalFile) {
      throw new Error("Failed to decrypt file from web3storage/LIT");
    }

    const encryptedFileCidWithACL = await encryptFileWithEOAAccess(
      chain.id,
      signer.provider as any,
      address.toLowerCase(),
      request.initiator.toLowerCase(),
      decryptedOriginalFile
    );

    if (!encryptedFileCidWithACL) {
      alert("Failed to encrypt file with ACL");
    }

    return api
      .updateRequest(id, {
        status: RequestStatus.APPROVED,
        meta: encryptedFileCidWithACL,
      })
      .then((request) => {
        setRequests((requests) =>
          requests.map((r) => (r.id === request.id ? request : r))
        );
      });
  };

  const onReject = (id: string) => {
    api
      .updateRequest(id, { status: RequestStatus.REJECTED })
      .then((request) => {
        setRequests((requests) =>
          requests.map((r) => (r.id === request.id ? request : r))
        );
      });
  };

  return (
    <div className="nes-table-responsive">
      <table className="nes-table is-bordered is-centered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Initiator</th>
            <th>Distributor</th>
            <th>ItemId</th>
            <th>Status</th>
          </tr>
        </thead>
        {requests.length ? (
          <tbody>
            {requests.map((request) => (
              <RequestsListItem
                key={request.id}
                onReject={() => onReject(request.id)}
                onApprove={() => onApprove(request)}
                {...request}
              />
            ))}
          </tbody>
        ) : (
          <div>No requests</div>
        )}
      </table>
    </div>
  );
}
