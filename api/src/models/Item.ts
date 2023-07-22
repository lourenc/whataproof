import mongoose from 'mongoose';

export interface ItemSchema {
	id: string;
	meta: String;
	distributor: String;
}

const itemSchema = new mongoose.Schema({
	meta: String,
	distributor: String,
});

export default mongoose.model<ItemSchema>('Item', itemSchema);
