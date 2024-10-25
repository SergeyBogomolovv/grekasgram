import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import mailConfig from './config/mail.config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { VerifyEmailPayload } from './dto/verify-email.payload';

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(mailConfig.KEY)
    mailConfiguration: ConfigType<typeof mailConfig>,
    private readonly config: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.transporter = createTransport(mailConfiguration);
  }

  sendVerifyEmail(token: string, email: string) {
    this.eventEmitter.emit(
      'send-verify-email',
      new VerifyEmailPayload({ token, to: email }),
    );
  }

  @OnEvent('send-verify-email')
  async sendVerifyEmailEvent({ to, token }: VerifyEmailPayload) {
    const mailOptions = {
      to,
      subject: 'Подтвердите регистрацию в Grekasgram',
      text: 'Подробности в письме',
      html: `<!DOCTYPE html>
              <html lang="ru">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Подтверждение почты</title>
              </head>
              <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; color: #333333; padding: 20px; text-align: center;">
                  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                      <h1 style="color: #7c3aed;">Подтвердите ваш адрес электронной почты</h1>
                      <p>Спасибо за регистрацию в Grekasgram! Чтобы завершить процесс регистрации, пожалуйста, подтвердите свой адрес электронной почты, нажав на кнопку ниже.</p>
                      <a href="${this.config.get('CONFIRM_EMAIL_URL')}?token=${token}"
                        style="display: inline-block; margin: 20px auto; padding: 15px 30px; font-size: 18px; font-weight: bold; color: #ffffff; background-color: #7c3aed; text-decoration: none; border-radius: 12px;">
                        Подтвердить почту
                      </a>
                      <p style="color: #555555;">Если вы не регистрировались в Grekasgram, просто проигнорируйте это письмо.</p>
                  </div>
              </body>
              </html>`,
    };
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
