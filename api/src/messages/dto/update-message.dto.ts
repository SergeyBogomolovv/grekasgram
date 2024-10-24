import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiProperty({ example: 'message' })
  content: string;

  @ApiProperty({ example: 'uuid' })
  messageId: string;
}
