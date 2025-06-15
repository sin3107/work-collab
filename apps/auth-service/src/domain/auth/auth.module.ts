import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { AuthRepository } from './auth.repository';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import { ErrorModule } from '@error';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([AuthEntity]),
    JwtModule.register({}),
    ErrorModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    BcryptService,
  ],
})
export class AuthModule {}