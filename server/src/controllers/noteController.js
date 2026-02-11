import path from 'path';
import Note from '../models/Note.js';
import Task from '../models/Task.js';
import Reminder from '../models/Reminder.js';
import { sanitizeRichText } from '../utils/sanitize.js';

const mapFile = (file) => ({
  originalName: file.originalname,
  mimeType: file.mimetype,
  filename: file.filename,
  filePath: path.join('uploads', file.filename),
  size: file.size,
});

export const getNotes = async (req, res) => {
  const { q = '', sort = 'updated' } = req.query;
  const sortBy = sort === 'pinned' ? { pinned: -1, updatedAt: -1 } : { updatedAt: -1 };

  const notes = await Note.find({
    user: req.user._id,
    isDeleted: false,
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
    ],
  }).sort(sortBy);

  return res.json(notes);
};

export const createNote = async (req, res) => {
  const payload = req.body;
  payload.content = sanitizeRichText(payload.content);

  const files = req.files || [];
  const attachments = files.filter((f) => !f.fieldname.includes('cover')).map(mapFile);
  const cover = files.find((f) => f.fieldname === 'coverImage');

  const note = await Note.create({
    ...payload,
    user: req.user._id,
    attachments,
    coverImage: cover ? mapFile(cover) : undefined,
  });

  return res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  note.editHistory.push({
    title: note.title,
    content: note.content,
    links: note.links,
    theme: note.theme,
    updatedAt: note.updatedAt,
  });

  const payload = req.body;
  if (payload.content !== undefined) payload.content = sanitizeRichText(payload.content);

  Object.assign(note, payload);

  const files = req.files || [];
  if (files.length) {
    note.attachments.push(...files.filter((f) => f.fieldname === 'attachments').map(mapFile));
    const cover = files.find((f) => f.fieldname === 'coverImage');
    if (cover) note.coverImage = mapFile(cover);
  }

  await note.save();
  return res.json(note);
};

export const undoLastEdit = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });
  if (!note || !note.editHistory.length) {
    return res.status(400).json({ message: 'No edit history available' });
  }

  const previous = note.editHistory.pop();
  note.title = previous.title;
  note.content = previous.content;
  note.links = previous.links;
  note.theme = previous.theme;
  await note.save();

  return res.json(note);
};

export const softDeleteNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true },
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  return res.json({ message: 'Moved to recycle bin' });
};

export const togglePin = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  note.pinned = !note.pinned;
  await note.save();
  return res.json(note);
};

export const hardDeleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDeleted: true });
  if (!note) return res.status(404).json({ message: 'Deleted note not found' });

  await Task.deleteMany({ note: note._id, user: req.user._id });
  await Reminder.deleteMany({ note: note._id, user: req.user._id });

  return res.json({ message: 'Note permanently deleted' });
};

export const getRecycleBin = async (req, res) => {
  const notes = await Note.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 });
  return res.json(notes);
};

export const restoreNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, isDeleted: true },
    { isDeleted: false, deletedAt: null },
    { new: true },
  );
  if (!note) return res.status(404).json({ message: 'Deleted note not found' });
  return res.json(note);
};
