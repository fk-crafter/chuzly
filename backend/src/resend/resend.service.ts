import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendMagicLink(email: string, magicLink: string) {
    return this.resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: 'Sign in to your account',
      html: `<p>Click here to sign in: <a href="${magicLink}">${magicLink}</a></p>`,
    });
  }
}
