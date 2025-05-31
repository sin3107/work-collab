import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../payloads/jwt-payload';
import { ErrorService } from '@error';
import { UserErrors } from '@error/constants/user.errors';
import { UsersRepository } from 'apps/user-service/src/domain/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly errorService: ErrorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersRepository.findUserById(payload.id);
      if (!user) {
        this.errorService.throw(UserErrors.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      this.errorService.throw(UserErrors.TOKEN_VALIDATION_FAIL);
    }
  }
}
