import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, compare, genSaltSync } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from 'src/common/message-response';
import { LinksService } from './links.service';
import { MailService } from 'src/mail/mail.service';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
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

    this.logger.debug(`User ${user.email} logined`);

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

    this.logger.debug(`User ${user.email} registered`);

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

    this.logger.debug(`User ${user.email} confirmed email`);

    return { session, message: new MessageResponse('Email confirmed') };
  }

  async logout(sessionId: string) {
    await this.sessionService.deleteSession(sessionId);
    return new MessageResponse('Logout sussessfully');
  }

  async renewSession(currentSessionId: string) {
    const session = await this.sessionService.renewSession(currentSessionId);

    this.logger.debug(`Session ${currentSessionId} renewed`);
    return { session, message: new MessageResponse('Session renewed') };
  }

  async getUserSessions(userId: string) {
    return this.sessionService.getUserSessions(userId);
  }
}
