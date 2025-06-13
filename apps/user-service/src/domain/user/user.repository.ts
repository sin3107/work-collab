import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    const entity = this.repository.create(user);
    return await this.repository.save(entity);
  }
}
