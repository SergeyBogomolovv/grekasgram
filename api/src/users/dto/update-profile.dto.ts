import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'griffit', nullable: true })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ example: 'about griffit', nullable: true })
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  @IsOptional()
  @IsMimeType()
  avatar?: any;
}
