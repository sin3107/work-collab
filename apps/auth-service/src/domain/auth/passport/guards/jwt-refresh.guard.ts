import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorService } from '@error';
import { AuthErrors } from '@error/constants/auth.errors';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh-token') {
  constructor(private readonly errorService: ErrorService) {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      this.errorService.throw(AuthErrors.INVALID_REFRESH_TOKEN);
    }
    return user;
  }
}
