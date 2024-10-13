import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: 'uuid of participant' })
  @IsString()
  @IsUUID()
  companionId: string;
}
