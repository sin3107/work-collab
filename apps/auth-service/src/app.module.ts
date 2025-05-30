import { Module } from '@nestjs/common';
import { ConfigModule } from './infra/config/config.module';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
