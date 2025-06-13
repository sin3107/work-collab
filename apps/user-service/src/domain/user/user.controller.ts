import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/request/create-user.request.dto';
import { ErrorResponse, SuccessResponse } from '@common';
import { UserErrors } from '@error/constants/user.errors';
import { UserSuccess } from './response-defines/user-success';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post()
  @SuccessResponse(HttpStatus.CREATED, [UserSuccess['USER-S001']])
  async create(@Body() dto: CreateUserDto): Promise<Partial<UserEntity>> {
    const user = await this.userService.createUser(dto);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  @Get('email/:email')
  @SuccessResponse(HttpStatus.OK, [UserSuccess['USER-S002']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [UserErrors.USER_NOT_FOUND])
  async findByEmail(@Param('email') email: string): Promise<UserEntity> {
    return await this.userService.getUserByEmail(email);
  }

  @Get(':id')
  @SuccessResponse(HttpStatus.OK, [UserSuccess['USER-S003']])
  @ErrorResponse(HttpStatus.NOT_FOUND, [UserErrors.USER_NOT_FOUND])
  async findById(@Param('id') id: number): Promise<UserEntity> {
    return await this.userService.getUserById(id);
  }
}
