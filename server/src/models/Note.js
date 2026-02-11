import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    mimeType: String,
    filename: String,
    filePath: String,
    size: Number,
  },
  { _id: false },
);

const noteVersionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    links: [String],
    theme: {
      bgColor: String,
      textColor: String,
      fontSize: String,
    },
    updatedAt: Date,
  },
  { _id: false },
);

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, default: '' },
    links: [{ type: String, trim: true }],
    coverImage: attachmentSchema,
    attachments: [attachmentSchema],
    theme: {
      bgColor: { type: String, default: '#ffffff' },
      textColor: { type: String, default: '#111827' },
      fontSize: { type: String, default: '16px' },
    },
    pinned: { type: Boolean, default: false },
    reminderAt: Date,
    reminderNotifiedAt: Date,
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: Date,
    editHistory: {
      type: [noteVersionSchema],
      default: [],
      validate: [(arr) => arr.length <= 20, 'Edit history limit exceeded'],
    },
  },
  { timestamps: true },
);

noteSchema.index({ user: 1, pinned: -1, updatedAt: -1 });

export default mongoose.model('Note', noteSchema);
