import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'message' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'uuid of chat' })
  @IsString()
  chatId: string;

  @ApiProperty({ type: 'string', format: 'binary', nullable: true })
  @IsOptional()
  @IsMimeType()
  image?: any;
}
