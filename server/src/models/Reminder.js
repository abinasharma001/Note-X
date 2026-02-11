import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true, index: true },
    remindAt: { type: Date, required: true },
    message: { type: String, trim: true, maxlength: 200 },
    notified: { type: Boolean, default: false },
    notifiedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model('Reminder', reminderSchema);
