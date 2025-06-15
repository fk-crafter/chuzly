import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `${process.env.API_URL}/auth/confirm?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email',
      html: `
        <p>Welcome! Please confirm your email by clicking the button below:</p>
        <p><a href="${confirmUrl}" style="padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px;">Confirm Email</a></p>
        <p>If the button doesn't work, copy and paste this URL in your browser:</p>
        <p>${confirmUrl}</p>
      `,
    });
  }
}
