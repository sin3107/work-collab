import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { AuthRepository } from './auth.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import { ErrorModule } from '@error';
import { SafeHttpModule } from '@common/utils/safe-http.module';
import { GlobalJwtModule } from '@bootstrap';

@Module({
  imports: [
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([AuthEntity]),
    GlobalJwtModule,
    ErrorModule,
    SafeHttpModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    BcryptService
  ],
})
export class AuthModule { }