import * as Joi from '@hapi/joi';

export const user_registration = Joi.object({
  username: Joi.string().alphanum().min(6).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  public_name: Joi.string().alphanum().min(6).max(12).required(),
});

export const user_login = Joi.object({
  username: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
});
