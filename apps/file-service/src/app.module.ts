import { Module } from '@nestjs/common';
import { FileModule } from './domain/file/file.module';
import { ConfigModule } from './infra/config/config.module';
import { DatabaseModule } from './infra/database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    FileModule,
  ],
})
export class AppModule {}
