import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class WaitlistService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendThankYouEmail(email: string) {
    await this.resend.emails.send({
      from: 'Chuzly <no-reply@chuzly.app>',
      to: email,
      subject: 'Welcome to Chuzly ✨',
      html: `
        <p>Thank you for joining the waitlist! 🎉</p>
        <p>We’re excited to have you on board. You’ll be the first to know when we launch 🚀</p>
      `,
    });
  }
}
