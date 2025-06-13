import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { CurrentUser, ErrorResponse, SuccessResponse } from '@common';
import { AuthErrors } from '@error/constants/auth.errors';
import { AuthSuccess } from './response-defines/auth-success';
import { UserRegisterResponseDTO } from './dtos/response/register.response.dto';
import { JwtAuthGuard } from './passport/guards/jwt-guard';
import { UserErrors } from '@error/constants/user.errors';
import { UserEntity } from 'apps/user-service/src/domain/user/entities/user.entity';
import { GetMeResponseDTO } from './dtos/response/get-me.response.dto';
import { JwtRefreshAuthGuard } from './passport/guards/jwt-refresh-guard';
import { LoginRequestDTO } from './dtos/request/login.request.dto';
import { LoginResponseDTO } from './dtos/response/login.response.dto';

@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @SuccessResponse(HttpStatus.CREATED, [AuthSuccess['AUTH-S001']])
  @ErrorResponse(HttpStatus.CONFLICT, [AuthErrors.EMAIL_ALREADY_EXISTS])
  async register(@Body() registerDto: RegisterRequestDTO): Promise<UserRegisterResponseDTO> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S002']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrors.INVALID_CREDENTIALS,
  ])
  @ApiBody({ type: LoginRequestDTO })
  async login(@Body() loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    return this.authService.login(loginDto);
  }

//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S003']])
//   @ErrorResponse(HttpStatus.UNAUTHORIZED, [
//     UserErrors.USER_NOT_FOUND,
//   ])
//   async getMe(@CurrentUser() user: UserEntity): Promise<GetMeResponseDTO> {
//     return this.authService.getMe(user);
//   }

//   @Post('logout')
//   @UseGuards(JwtAuthGuard)
//   @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S004']])
//   @ErrorResponse(HttpStatus.UNAUTHORIZED, [
//     UserErrors.USER_NOT_FOUND,
//   ])
//   async logout(@CurrentUser() user: UserEntity): Promise<void> {
//     return this.authService.logout(user.id);
//   }

//   @Post('refresh')
//   @UseGuards(JwtRefreshAuthGuard)
//   @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S005']])
//   @ErrorResponse(HttpStatus.UNAUTHORIZED, [
//     AuthErrors.INVALID_REFRESH_TOKEN,
//   ])
//   async refresh(@CurrentUser() user: UserEntity): Promise<{ accessToken: string; refreshToken: string }> {
//     return this.authService.refresh(user);
//   }
}
