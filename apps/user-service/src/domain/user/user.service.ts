import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserRequestDto } from './dtos/request/create-user.request.dto';
import { UserEntity } from './entities/user.entity';
import { ErrorService } from '@error';
import { UserErrors } from '@error/constants/user.errors';
import { UserResponseDTO } from './dtos/response/user.response.dto';
import { Provider, SocialUserPayload } from '@common';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly errorService: ErrorService
  ) { }

  async createUser(dto: CreateUserRequestDto): Promise<UserResponseDTO> {
    return await this.userRepository.createUser(dto);
  }

  async getUserById(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) this.errorService.throw(UserErrors.USER_NOT_FOUND);
    return this.toResponseDTO(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) this.errorService.throw(UserErrors.USER_NOT_FOUND);
    return this.toResponseDTO(user);
  }

  private toResponseDTO(user: UserEntity): UserResponseDTO {
    const { id, email, name, provider, status, role } = user;
    return { id, email, name, provider, status, role };
  }

  async findByProvider(provider: Provider, providerId: string): Promise<UserEntity> {
    const user = await this.userRepository.findByProvider(provider, providerId);
    if (!user) this.errorService.throw(UserErrors.USER_NOT_FOUND);
    return user;
  }

  async createSocialUser(payload: SocialUserPayload): Promise<UserEntity> {
    const existing = await this.userRepository.findByEmail(payload.email);
    if (existing) {
      this.errorService.throw(UserErrors.EMAIL_ALREADY_EXISTS);
    }

    const user = this.userRepository.createSocialUser(payload);
    return this.userRepository.save(user);
  }
}
