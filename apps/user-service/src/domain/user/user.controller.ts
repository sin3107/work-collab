import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserRequestDto } from './dtos/request/create-user.request.dto';
import { ErrorResponse, Provider, SocialUserPayload, SuccessResponse } from '@common';
import { UserErrors } from '@error/constants/user.errors';
import { UserSuccess } from './response-defines/user-success';
import { UserResponseDTO } from './dtos/response/user.response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @SuccessResponse(HttpStatus.CREATED, [UserSuccess['USER-S001']])
  async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDTO> {
    return await this.userService.createUser(dto);

  }

  @Get('email/:email')
  @SuccessResponse(HttpStatus.OK, [UserSuccess['USER-S002']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [UserErrors.USER_NOT_FOUND])
  async findByEmail(@Param('email') email: string): Promise<UserResponseDTO> {
    return await this.userService.getUserByEmail(email);
  }

  @Get(':id')
  @SuccessResponse(HttpStatus.OK, [UserSuccess['USER-S003']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [UserErrors.USER_NOT_FOUND])
  async findById(@Param('id') id: number): Promise<UserResponseDTO> {
    return await this.userService.getUserById(id);
  }

  @Get('provider/:provider/:providerId')
  async findByProvider(
    @Param('provider') provider: Provider,
    @Param('providerId') providerId: string,
  ) {
    return await this.userService.findByProvider(provider, providerId);

  }

  @Post('social')
  async createSocialUser(@Body() payload: SocialUserPayload) {
    return this.userService.createSocialUser(payload);
  }
}
