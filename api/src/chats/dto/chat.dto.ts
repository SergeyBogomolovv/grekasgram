import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto/user.dto';

export class ChatDto {
  constructor(payload: ChatDto) {
    this.id = payload.id;
    this.companion = payload.companion;
    this.createdAt = payload.createdAt;
  }

  @ApiProperty({ example: 'uuid of chat' })
  id: string;

  @ApiProperty({ type: () => UserDto })
  companion: UserDto;

  @ApiProperty({ example: 'timestamp' })
  createdAt: Date;
}
