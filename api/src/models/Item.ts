import mongoose from 'mongoose';

interface ItemSchema {
	meta: String,
	distributor: String,
}

const itemSchema = new mongoose.Schema({
	meta: String,
	distributor: String,
});

export default mongoose.model<ItemSchema>('Item', itemSchema);
