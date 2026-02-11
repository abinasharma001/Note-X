export const verifyRecyclePin = async (req, res) => {
  const { pin } = req.body;
  const ok = await req.user.verifyRecycleBinPin(pin);
  if (!ok) return res.status(403).json({ message: 'Invalid recycle bin PIN' });
  return res.json({ message: 'PIN verified' });
};
