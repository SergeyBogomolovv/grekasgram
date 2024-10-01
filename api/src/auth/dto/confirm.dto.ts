import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({ title: 'Token' })
  @IsString()
  token: string;
}
