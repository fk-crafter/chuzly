import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { addDays } from 'date-fns';
import { EmailVerificationService } from './email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async register(data: { email: string; password: string; name: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const trialEndsAt = addDays(new Date(), 7);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        plan: 'TRIAL',
        trialEndsAt,
      },
    });

    await this.emailVerificationService.sendVerificationEmail(
      user.id,
      user.email,
    );

    const token = this.jwt.sign({
      userId: user.id,
      name: user.name,
      plan: user.plan,
    });

    return { token, name: user.name, plan: user.plan };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email address first.',
      );
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

  async deleteAccount(userId: string): Promise<void> {
    const events = await this.prisma.event.findMany({
      where: { creatorId: userId },
      select: { id: true },
    });

    const eventIds = events.map((e) => e.id);

    await this.prisma.guest.deleteMany({
      where: { eventId: { in: eventIds } },
    });

    await this.prisma.option.deleteMany({
      where: { eventId: { in: eventIds } },
    });

    await this.prisma.event.deleteMany({
      where: { id: { in: eventIds } },
    });

    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
