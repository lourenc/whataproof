import { RequestStatus, Request } from "../models/Request";
import '../main.css';

const requests: Request[] = [
  {
    id: "1",
    initiator: "0x12312312312312313",
    distributor: "0x12312312312312313",
    status: RequestStatus.PENDING,
    itemId: "item-id-1",
  },
  {
    id: "2",
    initiator: "0x12312312312312313",
    distributor: "0x12312312312312313",
    status: RequestStatus.APPROVED,
    itemId: "item-id-2",
  },
  {
    id: "3",
    initiator: "0x12312312312312313",
    distributor: "0x12312312312312313",
    status: RequestStatus.REJECTED,
    itemId: "item-id-3",
  },
];

export function RequestsListItem(props: Request) {
  const { id, initiator: initinator, distributor: distibutor, itemId} = props;
  return (
    <tr>
      <td>{id}</td>
      <td>{initinator}</td>
      <td>{distibutor}</td>
      <td>{itemId}</td>
      <td>{props.status === RequestStatus.PENDING ? (
        <div className="vertical-small-gap">
          <button className="nes-btn is-success">Approve</button>
          <button className="nes-btn is-error">Reject</button>
        </div>
      ) : (
        props.status
      )}
      </td>
    </tr>
  );
}

export function RequestsList() {
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
          <tbody>
            {requests.map((request) => (
              <RequestsListItem {...request} />
            ))}
          </tbody>
        </table>
    </div>
  );
}
