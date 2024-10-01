import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import mailConfig from './config/mail.config';

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(mailConfig.KEY)
    mailConfiguration: ConfigType<typeof mailConfig>,
    private readonly config: ConfigService,
  ) {
    this.transporter = createTransport(mailConfiguration);
  }

  async sendVerifyEmail(token: string, email: string) {
    const mailOptions = {
      to: email,
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
