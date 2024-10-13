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
import { AccessTokenResponse } from './dto/accessToken.response';
import { SessionsResponse } from './dto/sessions.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User succesfully logged in',
    type: AccessTokenResponse,
  })
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      dto,
      req.ip,
      req.headers['user-agent'],
    );
    return this.setCookie(res, refreshToken).json({ accessToken });
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
    const { refreshToken, accessToken } = await this.authService.confirmEmail(
      dto.token,
      req.ip,
      req.headers['user-agent'],
    );

    return this.setCookie(res, refreshToken).json({ accessToken });
  }

  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiCreatedResponse({
    description: 'User logged out',
    type: MessageResponse,
  })
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const message = await this.authService.logout(req.cookies.refreshToken);
    return res.clearCookie('refreshToken').json(message);
  }

  @ApiOperation({ summary: 'Обновление access token' })
  @ApiOkResponse({
    description: 'Access token updated',
    type: AccessTokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('refresh')
  async refresh(@Req() req: Request) {
    return this.authService.refreshAccessToken(req.cookies.refreshToken);
  }

  @ApiOperation({ summary: 'Получение сессий пользователя' })
  @ApiOkResponse({ description: 'Sessions data', type: SessionsResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('all-sessions')
  async getUserSessions(@Req() req: Request) {
    return this.authService.getUserRefreshTokens(req.cookies.refreshToken);
  }

  @ApiOperation({ summary: 'Выход с определенного устройства' })
  @ApiCreatedResponse({ description: 'Выход успешен', type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(HttpAuthGuard)
  @Post('logout-from-device/:refreshTokenId')
  async logoutFromDevice(@Param('refreshTokenId') refreshTokenId: string) {
    return this.authService.deleteRefreshToken(refreshTokenId);
  }

  @ApiOperation({ summary: 'Выход с других сессий' })
  @ApiCreatedResponse({ description: 'Выход успешен', type: MessageResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('logout-from-other-devices')
  async logoutFromOtherDevices(@Req() req: Request) {
    return this.authService.logoutFromOtherDevices(req.cookies.refreshToken);
  }

  private setCookie(res: Response, session: string) {
    return res.cookie('refreshToken', session, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      sameSite: 'lax',
      path: '/',
    });
  }
}
