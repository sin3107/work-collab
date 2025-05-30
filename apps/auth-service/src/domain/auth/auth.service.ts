import { Injectable } from '@nestjs/common';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { Provider, UserEntity, UserStatus } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly errorService: ErrorService,
  ) { }

  async register(registerDto: RegisterRequestDTO): Promise<UserEntity> {
    const existUser = await this.userRepository.findByEmail(registerDto.email);
    if (existUser) {
      this.errorService.throw(AuthErrors.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.bcryptService.hash(registerDto.password);

    const user = new UserEntity();
    user.email = registerDto.email;
    user.password = hashedPassword;
    user.name = registerDto.name;
    user.phone = registerDto.phone;
    user.birth = registerDto.birth;
    user.provider = Provider.Local;
    user.status = UserStatus.Active;

    return await this.userRepository.save(user);

    
  }
}
