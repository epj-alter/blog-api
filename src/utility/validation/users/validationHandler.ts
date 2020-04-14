import * as Joi from '@hapi/joi';

export const register = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(6)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  alias: Joi.string()
    .alphanum()
    .min(6)
    .required()
});

export const login = Joi.object({
  username: Joi.string()
    .min(6)
    .required(),
  password: Joi.string()
    .min(6)
    .required()
});
