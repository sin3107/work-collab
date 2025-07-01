import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
  PORT: Joi.number().default(3000),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),

  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('15m'),
});