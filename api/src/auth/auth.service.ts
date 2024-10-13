import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, compare, genSaltSync } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MessageResponse } from 'src/common/message-response';
import { LinksService } from './links.service';
import { MailService } from 'src/mail/mail.service';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private linksService: LinksService,
    private mailService: MailService,
    private tokensService: TokensService,
  ) {}

  async login(dto: LoginDto, ip: string, device: string) {
    const user = await this.usersService.findOneByEmailOrFail(dto.email);

    if (!user.emailConfirmed) {
      throw new BadRequestException('Email not confirmed');
    }

    const isPasswordMath = await compare(dto.password, user.password);

    if (!isPasswordMath) throw new BadRequestException('Invalid credentials');

    const refreshToken = await this.tokensService.signRefreshToken({
      userId: user.id,
      ip,
      device,
    });

    const accessToken = this.tokensService.signAccessToken({
      userId: user.id,
    });

    this.logger.debug(`User ${user.email} logined`);

    return {
      refreshToken,
      accessToken,
    };
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

    const refreshToken = await this.tokensService.signRefreshToken({
      userId: user.id,
      ip,
      device,
    });

    const accessToken = this.tokensService.signAccessToken({
      userId: user.id,
    });

    this.logger.debug(`User ${user.email} confirmed email`);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (refreshToken) await this.tokensService.logout(refreshToken);
    return new MessageResponse('Logout sussessfully');
  }

  async deleteRefreshToken(refreshTokenId: string) {
    await this.tokensService.deleteRefreshToken(refreshTokenId);
    return new MessageResponse('Logout sussessfully');
  }

  async logoutFromOtherDevices(refreshToken: string) {
    if (refreshToken) {
      await this.tokensService.logoutFromOtherDevices(refreshToken);
    }
    return new MessageResponse('Logout sussessfully');
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('Invalid token');
    const accessToken =
      await this.tokensService.resignAccessToken(refreshToken);

    return {
      accessToken,
    };
  }

  async getUserRefreshTokens(userId: string) {
    return this.tokensService.getUserRefreshTokens(userId);
  }
}
