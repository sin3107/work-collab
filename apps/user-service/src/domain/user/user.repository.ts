import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserRequestDto } from './dtos/request/create-user.request.dto';
import { Provider, SocialUserPayload } from '@common';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findByEmail(email?: string): Promise<UserEntity | null> {
    if (!email) return null;
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async createUser(user: CreateUserRequestDto): Promise<UserEntity> {
    const entity = this.repository.create(user);
    return await this.repository.save(entity);
  }

   async findByProvider(provider: Provider, providerId: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { provider, providerId } });
  }

  createSocialUser(payload: SocialUserPayload): UserEntity {
    return this.repository.create({
      email: payload.email,
      name: payload.name,
      provider: payload.provider as Provider,
      providerId: payload.providerId,
    });
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }
}
