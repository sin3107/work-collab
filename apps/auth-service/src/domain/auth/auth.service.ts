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

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly bcryptService: BcryptService,
    private readonly errorService: ErrorService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(dto: RegisterRequestDTO): Promise<UserRegisterResponseDTO> {
    try {
      await firstValueFrom(
        this.httpService.get(`http://user-service:3001/users/email/${dto.email}`).pipe(
          retry(2)
        )
      );
      this.errorService.throw(AuthErrors.EMAIL_ALREADY_EXISTS);
    } catch (error) {
      if (error.response?.status !== 404) {
        this.errorService.throw(AuthErrors.USER_SERVICE_COMMUNICATION_FAILED);
      }
    }

    const { data: user } = await firstValueFrom(
      this.httpService.post<UserRegisterResponseDTO>('http://user-service:3001/users', {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        birth: dto.birth,
      }).pipe(
        retry(2)
      )
    );

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
      const res = await firstValueFrom(
        this.httpService.get(`http://user-service:3001/users/provider/${payload.provider}/${payload.providerId}`),
      );
      user = res.data;
    } catch (err) {
      const axiosError = err as AxiosError
      if (axiosError.response?.status === 404) {
        const res = await firstValueFrom(
          this.httpService.post(`http://user-service:3001/users/social`, payload),
        );
        user = res.data;
      } else {
        throw err;
      }
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
    const { data: userInfo } = await firstValueFrom(
      this.httpService.get<GetMeResponseDTO>(`http://user-service:3001/users/${userId}`).pipe(
        retry(2)
      )
    );
    return userInfo;
  }


  async logout(userId: number): Promise<void> {
    await this.authRepository.removeRefreshToken(userId);
  }


  async refresh(user: { id: number; email: string; role: string }): Promise<LoginResponseDTO> {
    const auth = await this.authRepository.findByUserId(user.id);
    if (!auth || !auth.refreshToken) {
      this.errorService.throw(AuthErrors.INVALID_REFRESH_TOKEN);
    }

    const { data: userProfile } = await firstValueFrom(
      this.httpService.get(`http://user-service:3001/users/${user.id}`).pipe(
        retry(2)
      )
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
    const { data: user } = await firstValueFrom(
      this.httpService.get(`http://user-service:3001/users/email/${email}`).pipe(retry(2)),
    ).catch(() => ({ data: null }));

    if (!user) return null;

    const auth = await this.authRepository.findByUserId(user.id);
    if (!auth || !(await this.bcryptService.compare(password, auth.password))) {
      return null;
    }

    return user;
  }

}
