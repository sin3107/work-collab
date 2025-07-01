import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './infra/config/validationSchema'
import { ChatModule } from './domain/chat/chat.module';
import { RedisInfraModule } from './infra/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    RedisInfraModule,
    ChatModule,
  ],
})
export class AppModule { }
