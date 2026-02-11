import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true, index: true },
    text: { type: String, required: true, trim: true, maxlength: 200 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('Task', taskSchema);
