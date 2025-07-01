import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisPublisherService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async publish(channel: string, message: any): Promise<void> {
    await this.redisClient.publish(channel, JSON.stringify(message));
  }
}
