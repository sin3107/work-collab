import { Injectable } from '@nestjs/common';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { UserRegisterResponseDTO } from './dtos/response/register.response.dto';
import { LoginRequestDTO } from './dtos/request/login.request.dto';
import { LoginResponseDTO } from './dtos/response/login.response.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly bcryptService: BcryptService,
    private readonly errorService: ErrorService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterRequestDTO): Promise<UserRegisterResponseDTO> {
    try {
      await firstValueFrom(
        this.httpService.get(`http://user-service:3001/users/email/${dto.email}`)
      );
      this.errorService.throw(AuthErrors.EMAIL_ALREADY_EXISTS);
    } catch (error) {
      if (error.response?.status !== 404) {
        this.errorService.throw(AuthErrors.USER_SERVICE_COMMUNICATION_FAILED);
      }
    }

    const hashedPassword = await this.bcryptService.hash(dto.password);

    const { data: user } = await firstValueFrom(
      this.httpService.post<UserRegisterResponseDTO>('http://user-service:3001/users', {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        birth: dto.birth,
      })
    );

    const refreshToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '14d'),
      },
    );

    await this.authRepository.saveRefreshToken(user.id, refreshToken);

    return user;
  }

  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const {email, password} = dto;
    let user;
    try {
      const res = await firstValueFrom(
        this.httpService.get(`http://user-service:3001/users/email/${email}`)
      );
      user = res.data;
    } catch {
      this.errorService.throw(AuthErrors.INVALID_CREDENTIALS);
    }

    const isMatch = await this.bcryptService.compare(password, user.password);
    
    if (!isMatch) {
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

    await this.authRepository.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
