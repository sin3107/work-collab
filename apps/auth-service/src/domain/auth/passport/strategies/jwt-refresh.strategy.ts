import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../payloads/jwt.payload';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';
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
      ignoreExpiration: false,
      secretOrKeyProvider: async (_, rawJwtToken, done) => {
        try {
          const secret = configService.get<string>('REFRESH_TOKEN_SECRET');
          done(null, secret);
        } catch (err) {
          done(err, null);
        }
      },
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