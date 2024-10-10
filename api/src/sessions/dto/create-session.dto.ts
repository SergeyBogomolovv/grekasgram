import { IsIP, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  userId: string;

  @IsString()
  device: string;

  @IsIP(4)
  ip: string;
}
