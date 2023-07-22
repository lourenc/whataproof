import { RequestStatus, Request } from "../models/Request";
import "../main.css";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useAccount } from "wagmi";

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
  const [requests, setRequests] = useState<Request[]>([]);
  const account = useAccount();

  useEffect(() => {
    if (!account.address) return;
    api.getRequests(account.address).then(setRequests);
  }, [account.address]);

  const onApprove = (id: string) => {
    api
      .updateRequest(id, { status: RequestStatus.APPROVED, meta: "TODO" })
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
                onApprove={() => onApprove(request.id)}
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
