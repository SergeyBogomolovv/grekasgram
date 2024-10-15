import { ApiProperty } from '@nestjs/swagger';

export class CreateChatResponse {
  @ApiProperty({ example: 'uuid of chat' })
  chatId: string;
}
