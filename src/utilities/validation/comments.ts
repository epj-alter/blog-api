import * as Joi from '@hapi/joi';

class CommentValidation {
  insert(data: any, options?: Joi.ValidationOptions) {
    return this.comment_insert.validate(data, options);
  }

  private comment_insert = Joi.object({
    token: Joi.string().min(10).required(),
    post_id: Joi.number().min(1).required(),
    content: Joi.string().min(20).max(15000).required(),
  });

  select(data: any, options?: Joi.ValidationOptions) {
    return this.comment_select.validate(data, options);
  }

  private comment_select = Joi.number().required();
}

export const comment = new CommentValidation();
