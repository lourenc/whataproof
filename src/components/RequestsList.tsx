import { RequestStatus, Request } from "../models/Request";

const requests: Request[] = [
  {
    id: "1",
    initinator: "0x12312312312312313",
    distibutor: "0x12312312312312313",
    status: RequestStatus.PENDING,
  },
  {
    id: "2",
    initinator: "0x12312312312312313",
    distibutor: "0x12312312312312313",
    status: RequestStatus.APPROVED,
  },
  {
    id: "3",
    initinator: "0x12312312312312313",
    distibutor: "0x12312312312312313",
    status: RequestStatus.REJECTED,
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
