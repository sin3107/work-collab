import { Module } from '@nestjs/common';
import { UserModule } from './domain/user/user.module';
import { ConfigModule } from './infra/config/config.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
