import mongoose from 'mongoose';

export interface ItemSchema {
	id: string;
	meta: String;
	distributor: String;
}

const itemSchema = new mongoose.Schema({
	meta: { type: String, required: true },
	distributor: { type: String, required: true },
});

export default mongoose.model<ItemSchema>('Item', itemSchema);
