import { Injectable } from '@nestjs/common';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { UserRegisterResponseDTO } from './dtos/response/register.response.dto';
import { LoginResponseDTO } from './dtos/response/login.response.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BcryptService } from '../../infra/security/bcrypt.service';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GetMeResponseDTO } from './dtos/response/get-me.response.dto';
import { retry } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { SocialUserPayload } from '@common';
import { JwtPayload } from './passport/payloads/jwt.payload';
import { SafeHttpService } from '@common/utils/safe-http.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly bcryptService: BcryptService,
    private readonly errorService: ErrorService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly safeHttp: SafeHttpService,
  ) { }

  async register(dto: RegisterRequestDTO): Promise<UserRegisterResponseDTO> {
    try {
      await this.safeHttp.get(
        `http://user-service:3001/users/email/${dto.email}`,
        (error) => {
          if (error.response?.status === 404) {
            return null; // 이메일 없음 → 정상
          }
          return AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
        }
      )
      this.errorService.throw(AuthErrors.EMAIL_ALREADY_EXISTS);
    } catch { }

    const user = await this.safeHttp.post<UserRegisterResponseDTO>(
      'http://user-service:3001/users', {
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      birth: dto.birth,
    },
      (error) => {
        if (error.response?.status === 409) {
          return AuthErrors.EMAIL_ALREADY_EXISTS;
        }
        return AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
      }
    )

    const hashedPassword = await this.bcryptService.hash(dto.password);
    await this.authRepository.createAuth(user.id, hashedPassword);

    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const refreshToken = this.generateRefreshToken(jwtPayload);
    const updated = await this.authRepository.saveRefreshToken(user.id, refreshToken);
    if (!updated) {
      this.errorService.throw(AuthErrors.AUTH_NOT_FOUND);
    }

    return user;
  }


  async login(user: { id: number; email: string; role: string }): Promise<LoginResponseDTO> {
    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);
    const updated = await this.authRepository.saveRefreshToken(user.id, refreshToken);

    if (!updated) {
      this.errorService.throw(AuthErrors.AUTH_NOT_FOUND);
    }

    return { accessToken, refreshToken };
  }


  async socialLogin(payload: SocialUserPayload): Promise<{ accessToken: string; refreshToken: string }> {
    let user;

    try {
      user = await this.safeHttp.get(
        `http://user-service:3001/users/provider/${payload.provider}/${payload.providerId}`,
        (error) => {
          if (error.response?.status === 404) {
            return null;
          }
          return AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
        }
      );

      if (!user) {
        user = await this.safeHttp.post(
          `http://user-service:3001/users/social`,
          payload,
          AuthErrors.USER_SERVICE_COMMUNICATION_FAILED
        );
      }
    } catch {
      this.errorService.throw(AuthErrors.USER_SERVICE_COMMUNICATION_FAILED);
    }

    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    const updated = await this.authRepository.saveRefreshToken(user.id, refreshToken);
    if (!updated) {
      this.errorService.throw(AuthErrors.AUTH_NOT_FOUND);
    }

    return { accessToken, refreshToken };
  }


  async getMe(userId: number): Promise<GetMeResponseDTO> {
    return await this.safeHttp.get<GetMeResponseDTO>(
      `http://user-service:3001/users/${userId}`,
      AuthErrors.USER_SERVICE_COMMUNICATION_FAILED
    );
  }


  async logout(userId: number): Promise<void> {
    await this.authRepository.removeRefreshToken(userId);
  }


  async refresh(user: { id: number; email: string; role: string }, presentedToken: string): Promise<LoginResponseDTO> {
    const auth = await this.authRepository.findByUserId(user.id);
    if (!auth || !auth.refreshToken) {
      this.errorService.throw(AuthErrors.INVALID_REFRESH_TOKEN);
    }

    if (auth.refreshToken !== presentedToken) {
      this.errorService.throw(AuthErrors.INVALID_REFRESH_TOKEN);
    }
    const userProfile = await this.safeHttp.get<GetMeResponseDTO>(
      `http://user-service:3001/users/${user.id}`,
      AuthErrors.USER_SERVICE_COMMUNICATION_FAILED
    );

    if (userProfile.status !== 'Active') {
      this.errorService.throw(AuthErrors.USER_STATUS_RESTRICTED);
    }

    const jwtPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(jwtPayload);
    const newRefreshToken = this.generateRefreshToken(jwtPayload);

    const updated = await this.authRepository.saveRefreshToken(user.id, newRefreshToken);
    if (!updated) {
      this.errorService.throw(AuthErrors.AUTH_NOT_FOUND);
    }

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }


  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN', '15m'),
    });
  }


  private generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '14d'),
    });
  }

  async validateUser(email: string, password: string): Promise<{ id: number; email: string; role: string } | null> {
    let user: { id: number; email: string; role: string } | null = null;

    try {
      user = await this.safeHttp.get(
        `http://user-service:3001/users/email/${email}`,
        (error) => {
          if (error.response?.status === 404) {
            return null;
          }
          return AuthErrors.USER_SERVICE_COMMUNICATION_FAILED;
        }
      );
    } catch {
      return null;
    }

    if (!user) return null;

    const auth = await this.authRepository.findByUserId(user.id);
    if (!auth || !(await this.bcryptService.compare(password, auth.password))) {
      return null;
    }

    return user;
  }

}
