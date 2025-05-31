import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from '../../../../user-service/src/domain/user/entities/user.entity';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, BcryptService],
})
export class AuthModule {}