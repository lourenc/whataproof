import { RequestStatus, Request } from "../models/Request";

const requests: Request[] = [
  {
    id: "1",
    initinator: "0x12312312312312313",
    distibutor: "0x12312312312312313",
    status: RequestStatus.PENDING,
    itemId: "item-id-1",
  },
  {
    id: "2",
    initinator: "0x12312312312312313",
    distibutor: "0x12312312312312313",
    status: RequestStatus.APPROVED,
    itemId: "item-id-2",
  },
  {
    id: "3",
    initinator: "0x12312312312312313",
    distibutor: "0x12312312312312313",
    status: RequestStatus.REJECTED,
    itemId: "item-id-3",
  },
];

export function RequestsListItem(props: Request) {
  return (
    <div>
      <span>
        <b>ID:</b> {props.id}{" "}
      </span>
      <span>
        <b>Initiator:</b> {props.initinator}{" "}
      </span>
      <span>
        <b>Distributor:</b> {props.distibutor}{" "}
      </span>
      <span>
        <b>Id:</b> {props.itemId}{" "}
      </span>
      {props.status === RequestStatus.PENDING ? (
        <>
          <button>Approve</button> <button>Reject</button>
        </>
      ) : (
        props.status
      )}
    </div>
  );
}

export function RequestsList() {
  return (
    <div>
      {requests.map((request) => (
        <RequestsListItem {...request} />
      ))}
    </div>
  );
}
