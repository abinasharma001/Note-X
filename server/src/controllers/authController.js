import User from '../models/User.js';
import { signToken } from '../utils/token.js';

export const register = async (req, res) => {
  const { username, password, recycleBinPin } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ message: 'Username already exists' });

  const user = new User({ username, password });
  if (recycleBinPin) await user.setRecycleBinPin(recycleBinPin);
  await user.save();

  return res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, username: user.username, theme: user.theme },
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    token: signToken(user._id),
    user: { id: user._id, username: user.username, theme: user.theme },
  });
};

export const me = async (req, res) => {
  return res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      theme: req.user.theme,
    },
  });
};

export const setRecyclePin = async (req, res) => {
  const { pin } = req.body;
  await req.user.setRecycleBinPin(pin);
  await req.user.save();
  return res.json({ message: 'Recycle bin PIN updated' });
};
