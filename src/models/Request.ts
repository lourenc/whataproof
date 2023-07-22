export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Request {
  id: string;
  initiator: string;
  distributor: string;
  status: RequestStatus;
  itemId: string;
}

