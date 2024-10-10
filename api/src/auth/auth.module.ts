import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { LinksService } from './links.service';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [SessionsModule, UsersModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, LinksService],
})
export class AuthModule {}
