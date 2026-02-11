export const validate = (schema, source = 'body') => (req, res, next) => {
  const { value, error } = schema.validate(req[source]);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req[source] = value;
  return next();
};
