
import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'apps/user-service/src/domain/user/user.repository';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'apps/user-service/src/domain/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { LoginRequestDTO } from './dtos/request/login.request.dto';
import { LoginResponseDTO } from './dtos/response/login.response.dto';
import { UserErrors } from '@error/constants/user.errors';
import { GetMeResponseDTO } from './dtos/response/get-me.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly errorService: ErrorService,
  ) { }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await this.bcryptService.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async register(registerDto: RegisterRequestDTO): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findByEmail(registerDto.email);
    if (existingUser) {
      this.errorService.throw(AuthErrors.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.bcryptService.hash(registerDto.password);

    const userEntity = await this.authRepository.createUserEntity({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      phone: registerDto.phone,
      birth: registerDto.birth,
    });

    return this.authRepository.save(userEntity);
  }

  async login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      this.errorService.throw(AuthErrors.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.bcryptService.compare(password, user.password);
    if (!isPasswordValid) {
      this.errorService.throw(AuthErrors.INVALID_CREDENTIALS);
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '14d'),
    });

    await this.authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getMe(user: UserEntity): Promise<GetMeResponseDTO> {
    const foundUser = await this.usersRepository.findUserById(user.id);
    if (!foundUser) {
      this.errorService.throw(UserErrors.USER_NOT_FOUND);
    }

    return {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      phone: foundUser.phone,
      birth: foundUser.birth,
      provider: foundUser.provider,
      status: foundUser.status,
      role: foundUser.role,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.authRepository.updateRefreshToken(userId, null);
  }

  async refresh(user: UserEntity): Promise<LoginResponseDTO> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '14d'),
    });

    await this.authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

}
