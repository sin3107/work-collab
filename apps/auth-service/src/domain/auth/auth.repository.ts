import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly repository: Repository<AuthEntity>,
  ) { }

  async createAuth(userId: number, password: string): Promise<AuthEntity> {
    const entity = this.repository.create({ userId, password });
    return await this.repository.save(entity);
  }

  async findByUserId(userId: number): Promise<AuthEntity | null> {
    return await this.repository.findOne({ where: { userId } });
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
    const auth = await this.findByUserId(userId);
    if (!auth) return false;

    auth.refreshToken = refreshToken;
    await this.repository.save(auth);
    return true;
  }

  async removeRefreshToken(userId: number): Promise<void> {
    const auth = await this.repository.findOne({ where: { userId } });
    if (auth) {
      auth.refreshToken = null;
      await this.repository.save(auth);
    }
  }
}
