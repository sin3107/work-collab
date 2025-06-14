import { Body, Controller, Get, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { CurrentUser, ErrorResponse, SuccessResponse } from '@common';
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
  @UseGuards(LocalGuard)
  @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S002']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [
    AuthErrors.INVALID_CREDENTIALS,
  ])
  @ApiBody({ type: LoginRequestDTO })
  async login(@Request() req): Promise<LoginResponseDTO> {
    return this.authService.login(req.user);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @SuccessResponse(HttpStatus.OK, [AuthSuccess['AUTH-S003']])
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [UserErrors.USER_NOT_FOUND])
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
  @ErrorResponse(HttpStatus.UNAUTHORIZED, [AuthErrors.INVALID_REFRESH_TOKEN])
  async refresh(@CurrentUser() user: { id: number; email: string; role: string }): Promise<LoginResponseDTO> {
    return this.authService.refresh(user);
  }
}
