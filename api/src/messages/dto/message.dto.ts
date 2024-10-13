import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  constructor(payload: MessageDto) {
    this.id = payload.id;
    this.content = payload.content;
    this.createdAt = payload.createdAt;
    this.updatedAt = payload.updatedAt;
    this.fromId = payload.fromId;
    this.chatId = payload.chatId;
    this.viewed = payload.viewed;
  }

  @ApiProperty({ example: 'uuid of message' })
  id: string;

  @ApiProperty({ example: 'message' })
  content: string;

  @ApiProperty({ example: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ example: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ example: 'uuid of user' })
  fromId: string;

  @ApiProperty({ example: 'uuid of chat' })
  chatId: string;

  @ApiProperty({ example: false })
  viewed: boolean;
}
