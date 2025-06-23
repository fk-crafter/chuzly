import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { addDays } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: { email: string; password: string; name: string }) {
    const hash = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        plan: 'TRIAL',
        trialEndsAt: addDays(new Date(), 7),
        emailVerified: false,
      },
    });

    return { message: 'user_created' };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.emailVerified) {
      throw new UnauthorizedException(
        'Invalid credentials / email not verified',
      );
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign(
      { userId: user.id, name: user.name, plan: user.plan },
      { expiresIn: '24h' },
    );
    return { token, name: user.name, plan: user.plan };
  }

  generateMagicLinkToken(userId: string) {
    return this.jwt.sign({ userId }, { expiresIn: '15m' });
  }
  loginFromMagicLink(userId: string) {
    return this.jwt.sign({ userId }, { expiresIn: '24h' });
  }

  async deleteAccount(userId: string) {
    const ids = (
      await this.prisma.event.findMany({
        where: { creatorId: userId },
        select: { id: true },
      })
    ).map((e) => e.id);

    await this.prisma.guest.deleteMany({ where: { eventId: { in: ids } } });
    await this.prisma.option.deleteMany({ where: { eventId: { in: ids } } });
    await this.prisma.event.deleteMany({ where: { id: { in: ids } } });
    await this.prisma.user.delete({ where: { id: userId } });
  }
}
