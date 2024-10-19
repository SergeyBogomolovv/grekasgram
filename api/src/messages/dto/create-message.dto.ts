import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ example: 'message' })
  content: string;

  @ApiProperty({ example: 'uuid of chat' })
  chatId: string;
}
