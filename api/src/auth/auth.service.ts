import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, compare, genSaltSync } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from 'src/common/message-response';
import { LinksService } from './links.service';
import { MailService } from 'src/mail/mail.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { SessionEntity } from 'src/sessions/entities/session.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private linksService: LinksService,
    private mailService: MailService,
    private sessionService: SessionsService,
  ) {}

  async login(dto: LoginDto, ip: string, device: string) {
    const user = await this.usersService.findOneByEmailOrFail(dto.email);

    if (!user.emailConfirmed) {
      throw new BadRequestException('Email not confirmed');
    }

    const isPasswordMath = await compare(dto.password, user.password);

    if (!isPasswordMath) throw new BadRequestException('Invalid credentials');

    const session = await this.sessionService.generateSession({
      userId: user.id,
      ip,
      device,
    });

    return { session, message: new MessageResponse('Login successfully') };
  }

  async register(dto: RegisterDto) {
    const hashedPassword = await hash(dto.password, genSaltSync());

    // already checks if user exists
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const verifyLink = await this.linksService.generateLink(user.id);

    this.mailService.sendVerifyEmail(verifyLink, user.email);

    return new MessageResponse('Confirmation email sent');
  }

  async confirmEmail(link: string, ip: string, device: string) {
    const userId = await this.linksService.confirmLink(link);
    if (!userId) throw new ForbiddenException('Invalid link');

    const user = await this.usersService.findOneByIdOrFail(userId);
    user.emailConfirmed = new Date();
    await this.usersService.update(userId, user);

    const session = await this.sessionService.generateSession({
      userId: user.id,
      ip,
      device,
    });

    return { session, message: new MessageResponse('Email confirmed') };
  }

  async logout(sessionId: string) {
    await this.sessionService.deleteSession(sessionId);
  }

  async updateSession(currentSession: SessionEntity) {
    return this.sessionService.updateSession({
      ...currentSession,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
  }
}
