import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('USER_DB_NAME'),
  synchronize: true, // 운영 환경에서는 항상 false로 (DDL 위험 방지)
  autoLoadEntities: true,
  retryAttempts: 10,
  retryDelay: 3000,
  logging: true, // 개발 중에만 사용
});
