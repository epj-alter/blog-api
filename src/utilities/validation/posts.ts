import * as Joi from '@hapi/joi';

class PostValidation {
  insert(data: any, options?: Joi.ValidationOptions) {
    return this.post_insert.validate(data, options);
  }

  private post_insert = Joi.object({
    token: Joi.string().min(10).required(),
    title: Joi.string().min(6).max(58).required(),
    image: Joi.string().uri().min(6).required(),
    content: Joi.string().min(50).max(15000).required(),
  });

  select(data: any, options?: Joi.ValidationOptions) {
    return this.post_select.validate(data, options);
  }

  private post_select = Joi.number().required();
}

export const post = new PostValidation();
