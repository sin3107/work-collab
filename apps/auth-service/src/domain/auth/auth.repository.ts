import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly repository: Repository<AuthEntity>,
  ) {}

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const existing = await this.repository.findOne({ where: { userId } });

    if (existing) {
      existing.refreshToken = refreshToken;
      await this.repository.save(existing);
    } else {
      const entity = this.repository.create({ userId, refreshToken });
      await this.repository.save(entity);
    }
  }

  async findByUserId(userId: number): Promise<AuthEntity | null> {
    return this.repository.findOne({ where: { userId } });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.repository.delete({ userId });
  }
}
