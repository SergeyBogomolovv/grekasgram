import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { LinksService } from './links.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { HttpAuthGuard } from './guards/http-auth.guard';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        expiresIn: '30d',
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LinksService, HttpAuthGuard, WsAuthGuard],
})
export class AuthModule {}
