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
      subject: 'Verify your email',
      html: `<a href="${this.config.get('CONFIRM_EMAIL_URL')}?token=${token}">Подтвердите ваш email</a>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
