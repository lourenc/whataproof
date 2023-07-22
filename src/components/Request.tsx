import { useEffect, useState } from "react";

import { RequestStatus, Request as RequestModel } from "../models/Request";

function RejectedRequest() {
  return (
    <div>
      <h1>Request rejected</h1>
    </div>
  );
}

function PendingRequest({
  request,
  onSubmit,
}: {
  request: RequestModel;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div>Distibutor: {request.distibutor}</div>
      <div>Status: {request.status}</div>
      <button onClick={onSubmit}>Submit request</button>
    </div>
  );
}

function ApprovedRequest({ request }: { request: RequestModel }) {
  return (
    <div>
      <div>Request id: {request.id}</div>
      <div>Distibutor: {request.distibutor}</div>
      <div>Status: {request.status}</div>

      <h1>DO NOT LEAK! LEAKAGE IS TRACEBLE</h1>
      <img
        src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
        width={500}
      />
    </div>
  );
}

function NoRequest({ itemId }: { itemId: string }) {
  return (
    <div>
      <div>Submit request to view the item</div>
      <button
        onClick={() => {
          // TODO add request to backend
          alert("Request submitted for item id: " + itemId);
        }}
      >
        Request
      </button>
    </div>
  );
}

export function Request({ itemId }: { itemId: string }) {
  const [request, setRequest] = useState<null | RequestModel>(null);

  useEffect(() => {
    // TODO - call backend to get request
    if (!itemId) {
      return;
    }

    if (Math.random() > 0.5) {
      setRequest({
        id: "SOME_ID",
        initinator: "0x103FA68B461bdBDbc5456Fd3164f8A71fd25eb5f",
        distibutor: "0x103FA68B461bdBDbc5456Fd3164f8A71fd25eb5f",
        status: RequestStatus.PENDING,
        itemId,
      });
    } else {
      setRequest({
        id: "SOME_ID",
        initinator: "0x103FA68B461bdBDbc5456Fd3164f8A71fd25eb5f",
        distibutor: "0x103FA68B461bdBDbc5456Fd3164f8A71fd25eb5f",
        status: RequestStatus.APPROVED,
        itemId,
      });
    }
  }, [itemId]);

  return (
    <div>
      <div>Item id: {itemId}</div>
      {request?.status === RequestStatus.PENDING && (
        <PendingRequest
          request={request}
          onSubmit={function (): void {
            // TODO
            alert("Request submitted for item id: " + itemId);
          }}
        />
      )}
      {request?.status === RequestStatus.APPROVED && (
        <ApprovedRequest request={request} />
      )}
      {request?.status === RequestStatus.REJECTED && (
        <RejectedRequest />
      )}
      {!request && <NoRequest itemId={itemId} />}
    </div>
  );
}
