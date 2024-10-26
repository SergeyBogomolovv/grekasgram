import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'message' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'uuid of chat' })
  @IsString()
  chatId: string;
}
