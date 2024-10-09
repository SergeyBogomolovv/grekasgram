import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
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
import { HttpSession } from './decorators/http-session.decorator';
import { SessionEntity } from 'src/sessions/entities/session.entity';

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
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { message, session } = await this.authService.login(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
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
  async confirmEmail(
    @Body() dto: ConfirmEmailDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { session, message } = await this.authService.confirmEmail(
      dto.token,
      req.ip,
      req.headers['user-agent'],
    );

    return this.setCookie(res, session).json(message);
  }

  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiCreatedResponse({
    description: 'User logged out',
    type: MessageResponse,
  })
  @UseGuards(HttpAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response, @HttpSession('id') sessionId: string) {
    await this.authService.logout(sessionId);
    return res
      .clearCookie('session')
      .json(new MessageResponse('Logout sussessfully'));
  }

  @ApiOperation({ summary: 'Проверка и обновление сессии' })
  @ApiOkResponse({ description: 'Session validated' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(HttpAuthGuard)
  @Get('validate-session')
  async getSession(
    @HttpSession() session: SessionEntity,
    @Res() res: Response,
  ) {
    const newSession = await this.authService.updateSession(session);
    return this.setCookie(res, newSession).json(
      new MessageResponse('Session updated'),
    );
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
