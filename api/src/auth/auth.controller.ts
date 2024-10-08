import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MessageResponse } from 'src/common/message-response';
import { ConfirmEmailDto } from './dto/confirm.dto';
import { HttpAuthGuard } from './guards/http-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User succesfully logged in',
    type: MessageResponse,
  })
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { message, session } = await this.authService.login(dto);
    return this.setCookie(res, session).json(message);
  }

  @ApiOperation({ summary: 'Регистрация' })
  @ApiCreatedResponse({
    description: 'Confirmation email sent',
    type: MessageResponse,
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Подтверждение регистрации' })
  @ApiCreatedResponse({
    description: 'User confirmed email',
    type: MessageResponse,
  })
  @Post('confirm-email')
  async confirmEmail(@Body() dto: ConfirmEmailDto, @Res() res: Response) {
    const { session, message } = await this.authService.confirmEmail(dto.token);

    return this.setCookie(res, session).json(message);
  }

  @ApiOperation({ summary: 'Выход из аккаунта' })
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

  @ApiOperation({ summary: 'Проверка и обновление сессии' })
  @ApiOkResponse({ description: 'Session validated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(HttpAuthGuard)
  @Get('validate-session')
  async getSession(@Res() res: Response) {
    const session = res.locals.session;
    return res.json(session);
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
