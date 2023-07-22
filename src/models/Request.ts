export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Request {
  id: string;
  initinator: string;
  distibutor: string;
  status: RequestStatus;
  itemId: string;
}
