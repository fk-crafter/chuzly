import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailVerificationService {
  private resend: Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(userId: string, email: string) {
    const token = this.jwtService.sign({ userId }, { expiresIn: '1d' });

    const verifyUrl = `${process.env.FRONT_URL}/auth/verify?token=${token}`;

    await this.resend.emails.send({
      from: 'Chuzly <no-reply@chuzly.app>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <p>Hey 👋</p>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ userId: string }>(
        token,
      );

      await this.prisma.user.update({
        where: { id: payload.userId },
        data: { emailVerified: true },
      });

      return { success: true };
    } catch (err) {
      console.error('Token verification error:', err);
      return { success: false, message: 'Invalid or expired token' };
    }
  }
}
