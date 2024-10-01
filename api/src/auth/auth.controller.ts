import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { MessageResponse } from 'src/common/message-response';
import { ConfirmEmailDto } from './dto/confirm.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User succesfully logged in',
    type: MessageResponse,
  })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { message, session } = await this.authService.login(dto);
    return this.setCookie(res, session).json(message);
  }

  @ApiCreatedResponse({
    description: 'Confirmation email sent',
    type: MessageResponse,
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiCreatedResponse({
    description: 'User confirmed email',
    type: MessageResponse,
  })
  @Post('confirm-email')
  async confirmEmail(@Body() dto: ConfirmEmailDto, @Res() res: Response) {
    const { session, message } = await this.authService.confirmEmail(dto.token);

    return this.setCookie(res, session).json(message);
  }

  @ApiCreatedResponse({
    description: 'User logged out',
    type: MessageResponse,
  })
  @Post('logout')
  async logout(@Res() res: Response) {
    return res
      .clearCookie('session')
      .json(new MessageResponse('Logout success'));
  }

  private setCookie(res: Response, session: string) {
    return res.cookie('session', session, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      sameSite: 'lax',
      path: '/',
    });
  }
}
