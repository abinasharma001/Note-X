import Note from '../models/Note.js';
import Task from '../models/Task.js';

export const listTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id, note: req.params.noteId }).sort({ createdAt: -1 });
  return res.json(tasks);
};

export const createTask = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.noteId, user: req.user._id, isDeleted: false });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  const task = await Task.create({ ...req.body, user: req.user._id, note: note._id });
  return res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.taskId, user: req.user._id, note: req.params.noteId },
    req.body,
    { new: true },
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.taskId, user: req.user._id, note: req.params.noteId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  return res.json({ message: 'Task deleted' });
};
