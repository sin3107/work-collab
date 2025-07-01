import { RedisModuleOptions } from '@nestjs-modules/ioredis';

export const redisConfig: RedisModuleOptions = {
  type: 'single',
  options: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
};