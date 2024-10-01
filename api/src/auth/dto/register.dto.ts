import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ title: 'Username', example: 'griffit' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ title: 'Email', example: 'email@email.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ title: 'Password', example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}
