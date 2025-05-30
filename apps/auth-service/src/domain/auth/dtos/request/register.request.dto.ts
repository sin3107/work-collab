import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterRequestDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  phone?: string;
  birth?: Date;
}
