import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).max(128).required(),
  recycleBinPin: Joi.string().pattern(/^\d{4,8}$/).optional(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const noteSchema = Joi.object({
  title: Joi.string().max(120).required(),
  content: Joi.string().allow(''),
  links: Joi.array().items(Joi.string().uri()).default([]),
  pinned: Joi.boolean().optional(),
  reminderAt: Joi.date().iso().allow(null),
  theme: Joi.object({
    bgColor: Joi.string().pattern(/^#[0-9a-fA-F]{3,6}$/),
    textColor: Joi.string().pattern(/^#[0-9a-fA-F]{3,6}$/),
    fontSize: Joi.string().pattern(/^\d+(px|em|rem|%)$/),
  }).optional(),
}).options({ stripUnknown: true });

export const taskSchema = Joi.object({
  text: Joi.string().max(200).required(),
  completed: Joi.boolean().optional(),
});

export const reminderSchema = Joi.object({
  remindAt: Joi.date().iso().required(),
  message: Joi.string().max(200).allow(''),
});
