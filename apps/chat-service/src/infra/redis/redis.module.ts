import { Module } from '@nestjs/common';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';
import { redisConfig } from './redis.config';

@Module({
  imports: [IoRedisModule.forRoot(redisConfig)],
  exports: [IoRedisModule],
})
export class RedisInfraModule {}