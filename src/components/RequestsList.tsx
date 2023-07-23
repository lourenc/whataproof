import "../main.css";

import { RequestStatus, Request } from "../models/Request";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  createACLForAccount,
  createACLForERC20,
  decryptFileWithEOAAccess,
  encryptFileWithCustomACL,
} from "../lit-sdk";
import { useAccount, useNetwork } from "wagmi";
import { useEthersSigner } from "../hooks/useEthersSigner";
import { watermarkApi } from "../api/watermark";

import mimetypes from "mime-types";

enum ACL {
  ManualApprove = "MANUAL_APPROVE",
  MoreThan3Apes = "MORE_THAN_3_APES",
  // NftHolder = "NFT_HOLDER",
}
const shortenString = (text: string) =>
  text.length > 12 ? text.slice(0, 6) + ".." + text.slice(-6) : text;

export function RequestsListItem(
  props: Request & {
    onApprove: (preferredAcl: ACL) => void;
    onReject: () => void;
  }
) {
  const [selectedAcl, setSelectedAcl] = useState<ACL>(ACL.ManualApprove);
  const handleTdClick = (
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>,
    fullText: string
  ) => {
    const td = event.target as HTMLTableCellElement;
    const currentText = td.innerText;

    if (currentText === shortenString(fullText)) {
      td.innerText = fullText;
    } else {
      td.innerText = shortenString(fullText);
    }
  };
  const { id, initiator: initinator, distributor: distibutor, itemId } = props;

  return (
    <tr>
      <td className="on-hover-blue" onClick={(e) => handleTdClick(e, id)}>
        {shortenString(id)}
      </td>
      <td>
        {props.status === RequestStatus.PENDING ? (
          <div className="vertical-small-gap" style={{ width: "300px" }}>
            <div className="nes-select">
              <select
                required
                id="default_select"
                value={selectedAcl}
                onChange={(e) => setSelectedAcl(e.currentTarget.value as ACL)}
              >
                <option value={ACL.ManualApprove}>Default</option>
                <option value={ACL.MoreThan3Apes}>At least 3 APEs</option>
              </select>
            </div>

            <button
              onClick={() => props.onApprove(selectedAcl)}
              className="nes-btn is-success"
            >
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
      <td
        className="on-hover-blue"
        onClick={(e) => handleTdClick(e, initinator)}
      >
        {shortenString(initinator)}
      </td>
      <td
        className="on-hover-blue"
        onClick={(e) => handleTdClick(e, distibutor)}
      >
        {shortenString(distibutor)}
      </td>
      <td className="on-hover-blue" onClick={(e) => handleTdClick(e, itemId)}>
        {shortenString(itemId)}
      </td>
    </tr>
  );
}

const WagmiNetworkToLitNetwork: Record<number, string> = {
  1: "ethereum",
  314: "filecoin",
};

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

  const onApprove = async (request: Request, preferedAcl: ACL) => {
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

    const formData = new FormData();
    const fileExtension = mimetypes.extension(decryptedOriginalFile.type);

    formData.append(
      "image",
      decryptedOriginalFile,
      fileExtension ? `encrypted.${fileExtension}` : "unknown.png"
    );
    formData.append("key", request.initiator.toLowerCase());

    const watermarkedImageResponse = await watermarkApi.addWatermark(formData);
    const watermarkedImageBlob = new Blob([watermarkedImageResponse.data], {
      type: watermarkedImageResponse.headers["content-type"],
    });

    const acl = (() => {
      const manualApprove = createACLForAccount(
        request.initiator.toLowerCase(),
        WagmiNetworkToLitNetwork[chain.id]! // yes, looks weird, but it is what it is
      );

      switch (preferedAcl) {
        case ACL.MoreThan3Apes:
          return [
            manualApprove,
            { operator: "and" },
            createACLForERC20(
              "0x4d224452801aced8b2f0aebe155379bb5d594381",
              "3",
              "ethereum"
            ),
          ].flat();
        default:
        case ACL.ManualApprove:
          return manualApprove;
      }
    })();

    const encryptedFileCidWithACL = await encryptFileWithCustomACL(
      chain.id,
      signer.provider as any,
      address.toLowerCase(),
      acl as any,
      watermarkedImageBlob
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
            <th>Status</th>
            <th>Initiator</th>
            <th>Distributor</th>
            <th>ItemId</th>
          </tr>
        </thead>
        {requests.length ? (
          <tbody>
            {requests.map((request) => (
              <RequestsListItem
                key={request.id}
                onReject={() => onReject(request.id)}
                onApprove={(preferedAcl) => onApprove(request, preferedAcl)}
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
