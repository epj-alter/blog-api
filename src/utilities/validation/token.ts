import * as Joi from '@hapi/joi';

class tokenValidation {
  content(data: any, options?: Joi.ValidationOptions) {
    return this.token_object.validate(data, options);
  }

  private token_object = Joi.string().min(10).required();
}

export const token = new tokenValidation();
