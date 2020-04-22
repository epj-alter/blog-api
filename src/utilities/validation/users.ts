import * as Joi from '@hapi/joi';

class UserValidation {
  registration(data: any, options?: Joi.ValidationOptions) {
    return this.user_registration.validate(data, options);
  }

  login(data: any, options?: Joi.ValidationOptions) {
    return this.user_login.validate(data, options);
  }

  private user_registration = Joi.object({
    username: Joi.string().alphanum().min(6).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    public_name: Joi.string().alphanum().min(4).max(12).required(),
  });

  private user_login = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
}

export const user = new UserValidation();
