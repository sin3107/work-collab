import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),

  // 공통 부트스트랩에 필요한 최소 항목
  PORT: Joi.number().default(3000),
  SECRET_KEY: Joi.string().required(),
  ADMIN_USER: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  CORS_ORIGIN_LIST: Joi.string().default('*'),

  // DB 접속 정보
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  USER_DB_NAME: Joi.string().required(),
});
