import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendMagicLink(email: string, url: string) {
    await this.resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: email,
      subject: 'Sign in to your account',
      html: `
        <p>Click below to sign in:</p>
        <a href="${url}" target="_blank">${url}</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    });
  }
}
