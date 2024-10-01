import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  constructor(msg: string) {
    this.message = msg;
  }
  @ApiProperty({ title: 'Message', example: 'message' })
  message: string;
}
