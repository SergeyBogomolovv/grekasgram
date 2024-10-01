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
import { SessionPayload } from './entities/session';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private linksService: LinksService,
    private mailService: MailService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmailOrFail(dto.email);

    if (!user.emailConfirmed) {
      throw new BadRequestException('Email not confirmed');
    }

    const isPasswordMath = await compare(dto.password, user.password);

    if (!isPasswordMath) throw new BadRequestException('Invalid credentials');

    const session = this.generateSession(user.id);

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

  async confirmEmail(link: string) {
    const userId = await this.linksService.confirmLink(link);
    if (!userId) throw new ForbiddenException('Invalid link');

    const user = await this.usersService.findOneByIdOrFail(userId);
    user.emailConfirmed = new Date();
    await this.usersService.update(userId, user);

    const session = this.generateSession(user.id);

    return { session, message: new MessageResponse('Email confirmed') };
  }

  private generateSession(userId: string) {
    const session = new SessionPayload({ userId });
    return this.jwtService.sign({ ...session });
  }
}
