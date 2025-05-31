import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'apps/user-service/src/domain/user/user.repository';
import { JwtPayload } from '../payloads/jwt-payload';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';
import { UserErrors } from '@error/constants/user.errors';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly errorService: ErrorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersRepository.findUserById(payload.id);

    if (!user) {
      this.errorService.throw(UserErrors.USER_NOT_FOUND);
    }

    if (user.refreshToken !== payload.refreshToken) {
      this.errorService.throw(AuthErrors.INVALID_REFRESH_TOKEN);
    }

    return user;
  }
}
