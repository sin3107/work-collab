import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/request/create-user.request.dto';
import { UserEntity } from './entities/user.entity';
import { ErrorService } from '@error';
import { UserErrors } from '@error/constants/user.errors';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly errorService: ErrorService
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    return await this.userRepository.createUser(dto);
  }

async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) this.errorService.throw(UserErrors.USER_NOT_FOUND);
    return user;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) this.errorService.throw(UserErrors.USER_NOT_FOUND);
    return user;
  }
}
