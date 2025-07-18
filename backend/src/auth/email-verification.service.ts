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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://chuzly.app/logo.png" alt="Chuzly Logo" style="width: 100px; height: auto;" />
        </div>
        <h2 style="color: #111827; text-align: center;">Verify your email</h2>
        <p style="font-size: 16px; color: #374151;">
          Hey 👋, thanks for signing up to Chuzly!
        </p>
        <p style="font-size: 16px; color: #374151;">
          To complete your registration, please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; color: #6b7280;">
          Or copy and paste this link into your browser:<br/>
          <a href="${verifyUrl}" style="color: #3b82f6;">${verifyUrl}</a>
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          This link expires in 24 hours.
        </p>
        <p style="font-size: 14px; color: #6b7280;">
          — Chuzly
        </p>
      </div>
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

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    await this.resend.emails.send({
      from: 'Chuzly <no-reply@chuzly.app>',
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });
  }
}
