import Reminder from '../models/Reminder.js';
import Note from '../models/Note.js';

export const listReminders = async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id }).sort({ remindAt: 1 });
  return res.json(reminders);
};

export const createReminder = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.noteId, user: req.user._id, isDeleted: false });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  const reminder = await Reminder.create({ user: req.user._id, note: note._id, ...req.body });
  note.reminderAt = reminder.remindAt;
  await note.save();

  return res.status(201).json(reminder);
};

export const updateReminder = async (req, res) => {
  const reminder = await Reminder.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
  return res.json(reminder);
};

export const deleteReminder = async (req, res) => {
  const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
  return res.json({ message: 'Reminder deleted' });
};

export const dueReminders = async (req, res) => {
  const now = new Date();
  const reminders = await Reminder.find({
    user: req.user._id,
    remindAt: { $lte: now },
    notified: false,
  });

  await Reminder.updateMany(
    { _id: { $in: reminders.map((r) => r._id) } },
    { notified: true, notifiedAt: now },
  );

  return res.json(reminders);
};
