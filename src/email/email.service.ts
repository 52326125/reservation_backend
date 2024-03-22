import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { EMAIL_TOKEN } from 'src/const';

@Injectable()
export class EmailService {
  @Inject(EMAIL_TOKEN)
  private email: Resend;

  async sendSignUpVerify(to: string, verifyCode: string) {
    await this.email.emails.send({
      to,
      from: 'onboarding@resend.dev',
      subject: '註冊驗證碼',
      html: `<p>Your sign up verify code is: ${verifyCode}</p>`,
    });
  }
}
