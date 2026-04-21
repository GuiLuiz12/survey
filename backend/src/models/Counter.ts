import mongoose, { Schema } from 'mongoose';

export interface ICounter {
  _id: string;
  value: number;
}

const CounterSchema: Schema = new Schema({
  _id: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
});

export default mongoose.model<ICounter>('Counter', CounterSchema);
