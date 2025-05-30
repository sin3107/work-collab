import * as Joi from 'joi';

export const validationSchema = Joi.object({
  
  // 공통 부트스트랩에 필요한 최소 항목
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
  PORT: Joi.number().default(3000),
  
  // DB 접속 정보
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  AUTH_DB_NAME: Joi.string().required(),

  // 추가적인 설정 (JWT 시크릿 등)
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
});
