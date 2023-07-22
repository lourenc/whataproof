import mongoose from 'mongoose';

interface ItemSchema {
	meta: String,
}

const itemSchema = new mongoose.Schema({
	meta: String,
});

export default mongoose.model<ItemSchema>('Item', itemSchema);
