import { Body, Controller, Get, Headers, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { CurrentUser, ErrorResponse, SocialUserPayload, SuccessResponse } from '@common';
import { AuthErrors } from '@error/constants/auth.errors';
import { AuthSuccess } from './response-defines/auth-success';
import { UserRegisterResponseDTO } from './dtos/response/register.response.dto';
import { JwtAuthGuard } from './passport/guards/jwt.guard';
import { UserErrors } from '@error/constants/user.errors';
import { GetMeResponseDTO } from './dtos/response/get-me.response.dto';
import { JwtRefreshAuthGuard } from './passport/guards/jwt-refresh.guard';
import { LoginRequestDTO } from './dtos/request/login.request.dto';
import { LoginResponseDTO } from './dtos/response/login.response.dto';
import { LocalGuard } from './passport/guards/local-guard';
import { AppleAuthGuard, GoogleAuthGuard, KakaoAuthGuard } from './passport/guards/social.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @SuccessResponse(HttpStatus.CREATED, [AuthSuccess['AUTH-S001']])
  @ErrorResponse(HttpStatus.CONFLICT, [AuthErrors.EMAIL_ALREADY_EXISTS])
  @ErrorResponse(HttpStatus.BAD_REQUEST, [AuthErrors.USER_SERVICE_COMMUNICATION_FAILED])
  async register(@Body() registerDto: RegisterRequestDTO): Promise<UserRegisterResponseDTO> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S002']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrors.INVALID_CREDENTIALS, AuthErrors.AUTH_NOT_FOUND
  ])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [AuthErrors.USER_SERVICE_COMMUNICATION_FAILED])
  @ApiBody({ type: LoginRequestDTO })
  async login(@Req() req): Promise<LoginResponseDTO> {
    return this.authService.login(req.user);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() { }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [AuthErrors.AUTH_NOT_FOUND,])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [AuthErrors.USER_SERVICE_COMMUNICATION_FAILED,])
  async googleRedirect(@Req() req) {
    const payload: SocialUserPayload = req.user;
    return this.authService.socialLogin(payload);
  }

  @Get('kakao/login')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() { }

  @Get('kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [AuthErrors.AUTH_NOT_FOUND,])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [AuthErrors.USER_SERVICE_COMMUNICATION_FAILED,])
  async kakaoRedirect(@Req() req) {
    const payload: SocialUserPayload = req.user;
    return this.authService.socialLogin(payload);
  }

  @Get('apple/login')
  @UseGuards(AppleAuthGuard)
  async appleLogin() { }

  @Get('apple/redirect')
  @UseGuards(AppleAuthGuard)
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [AuthErrors.AUTH_NOT_FOUND,])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [AuthErrors.USER_SERVICE_COMMUNICATION_FAILED,])
  async appleRedirect(@Req() req) {
    const payload: SocialUserPayload = req.user;
    return this.authService.socialLogin(payload);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S003']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [UserErrors.USER_NOT_FOUND])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [AuthErrors.USER_SERVICE_COMMUNICATION_FAILED])
  async getMe(@CurrentUser() user): Promise<GetMeResponseDTO> {
    return this.authService.getMe(user.id);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S004']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [UserErrors.USER_NOT_FOUND])
  async logout(@CurrentUser() user): Promise<void> {
    return this.authService.logout(user.id);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S005']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrors.INVALID_REFRESH_TOKEN,
    AuthErrors.USER_STATUS_RESTRICTED,
    AuthErrors.AUTH_NOT_FOUND,
  ])
  @ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, [AuthErrors.USER_SERVICE_COMMUNICATION_FAILED])
  async refresh(
    @CurrentUser() user,
    @Headers('authorization') authorization: string
  ): Promise<LoginResponseDTO> {
    const rawToken = authorization?.replace(/^Bearer\s/, '');
    return this.authService.refresh(user, rawToken);
  }
}
