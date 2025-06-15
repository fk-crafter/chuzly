import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { addDays } from 'date-fns';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}

  async register(data: { email: string; password: string; name: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const trialEndsAt = addDays(new Date(), 7);
    const emailToken = randomBytes(32).toString('hex');
    const emailTokenExpires = addDays(new Date(), 1);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        plan: 'TRIAL',
        trialEndsAt,
        emailVerified: false,
        emailToken,
        emailTokenExpires,
      },
    });

    await this.mailService.sendConfirmationEmail(user.email, emailToken);

    return { message: 'Confirmation email sent. Please check your inbox.' };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign({
      userId: user.id,
      name: user.name,
      plan: user.plan,
    });

    return { token, name: user.name, plan: user.plan };
  }

  async confirmEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailToken: token },
    });

    if (
      !user ||
      !user.emailTokenExpires ||
      user.emailTokenExpires < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailToken: null,
        emailTokenExpires: null,
      },
    });

    return { message: 'Email successfully verified' };
  }
}
