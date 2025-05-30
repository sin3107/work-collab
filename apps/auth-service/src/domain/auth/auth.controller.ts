import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RegisterRequestDTO } from './dtos/request/register.request.dto';
import { ErrorResponse, SuccessResponse } from '@common';
import { AuthErrors } from '@error/constants/auth.errors';
import { AuthSuccess } from './response-defines/auth-success';
import { UserRegisterResponseDTO } from './dtos/response/register.response.dto';

@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @SuccessResponse(HttpStatus.CREATED, [AuthSuccess['AUTH-S001']])
  @ErrorResponse(HttpStatus.CONFLICT, [
    AuthErrors.EMAIL_ALREADY_EXISTS,
  ])
  async register(@Body() registerDto: RegisterRequestDTO): Promise<UserRegisterResponseDTO> {
    const user = await this.authService.register(registerDto);
    return user;
  }
}
