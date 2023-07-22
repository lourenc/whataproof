import mongoose from 'mongoose';

export enum RequestStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
}

export interface RequestSchema {
	id: string;
	initiator: string;
	distributor: string;
	status: RequestStatus;
	itemId: string;
        meta?: string
}

const requestSchema = new mongoose.Schema({
	initiator: { type: String, required: true },
	distributor: { type: String, required: true },
	status: { type: String, enum: Object.values(RequestStatus), required: true },
	itemId: { type: String, required: true },
        meta: { type: String, required: false },
});

export default mongoose.model<RequestSchema>('Request', requestSchema);
