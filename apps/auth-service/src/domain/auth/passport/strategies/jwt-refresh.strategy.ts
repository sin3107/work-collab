import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../payloads/jwt.payload';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';
import { UserErrors } from '@error/constants/user.errors';
import { AuthRepository } from '../../auth.repository';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
    private readonly errorService: ErrorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
  const auth = await this.authRepository.findByUserId(payload.id);
  if (!auth || !auth.refreshToken) {
    this.errorService.throw(AuthErrors.INVALID_REFRESH_TOKEN);
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
}
}
