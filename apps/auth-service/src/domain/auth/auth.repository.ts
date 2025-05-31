import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'apps/user-service/src/domain/user/entities/user.entity';
import { Provider, UserStatus } from 'apps/user-service/src/domain/user/entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async createUserEntity(data: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    birth?: Date;
  }): Promise<UserEntity> {
    return this.userRepository.create({
      ...data,
      provider: Provider.Local,
      status: UserStatus.Active,
    });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

}
