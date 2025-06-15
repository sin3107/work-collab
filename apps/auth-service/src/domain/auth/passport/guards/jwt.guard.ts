import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorService } from '@error';
import { UserErrors } from '@error/constants/user.errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly errorService: ErrorService) {
    super();
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      this.errorService.throw(UserErrors.USER_NOT_FOUND);
    }
    return user;
  }
}
