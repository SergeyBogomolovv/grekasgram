import {
  Body,
  Controller,
  Get,
  Param,
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
import { SessionDto } from 'src/sessions/dto/session.dto';

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
    const message = await this.authService.logout(sessionId);
    return res.clearCookie('session').json(message);
  }

  @ApiOperation({ summary: 'Проверка и обновление сессии' })
  @ApiOkResponse({ description: 'Session validated', type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(HttpAuthGuard)
  @Get('validate-session')
  async validateSession(
    @HttpSession('id') sessionId: string,
    @Res() res: Response,
  ) {
    const { session, message } = await this.authService.renewSession(sessionId);
    return this.setCookie(res, session).json(message);
  }

  @ApiOperation({ summary: 'Получение сессий пользователя' })
  @ApiOkResponse({ description: 'Sessions data', type: [SessionDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(HttpAuthGuard)
  @Get('all-sessions')
  async getSession(@HttpSession('userId') userId: string) {
    return this.authService.getUserSessions(userId);
  }

  @ApiOperation({ summary: 'Выход с определенной сессии' })
  @ApiCreatedResponse({ description: 'Выход успешен', type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(HttpAuthGuard)
  @Post('logout-from-device/:sessionId')
  async logoutFromDevice(@Param('sessionId') sessionId: string) {
    return this.authService.logout(sessionId);
  }

  @ApiOperation({ summary: 'Выход с других сессий' })
  @ApiCreatedResponse({ description: 'Выход успешен', type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(HttpAuthGuard)
  @Post('logout-from-other-devices')
  async logoutFromOtherDevices(@HttpSession('id') sessionId: string) {
    return this.authService.logoutFromOtherDevices(sessionId);
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
