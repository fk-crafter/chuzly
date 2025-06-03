import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { isAfter, addMonths } from 'date-fns';

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { userId: string };

    if (!user?.userId) {
      throw new ForbiddenException('Missing user in request');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!dbUser) throw new ForbiddenException('User not found');

    const now = new Date();

    if (dbUser.plan === 'PRO') return true;

    if (dbUser.plan === 'TRIAL') {
      const trialEnds: Date | null = dbUser.trialEndsAt
        ? new Date(dbUser.trialEndsAt as string | number | Date)
        : null;

      if (trialEnds && isAfter(trialEnds, now)) {
        return true;
      }

      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: {
          plan: 'FREE',
          freeStartedAt: now,
        },
      });

      return true;
    }

    if (dbUser.plan === 'FREE') {
      const cycleStart: Date = dbUser.freeStartedAt
        ? new Date(dbUser.freeStartedAt as string | number | Date)
        : new Date(dbUser.createdAt as string | number | Date);
      const nextReset: Date = addMonths(cycleStart, 1);

      if (isAfter(now, nextReset)) {
        await this.prisma.user.update({
          where: { id: dbUser.id },
          data: { freeStartedAt: now },
        });
      }

      const effectiveStart: Date = dbUser.freeStartedAt
        ? new Date(dbUser.freeStartedAt as string | number | Date)
        : new Date(dbUser.createdAt as string | number | Date);

      const eventsThisCycle = await this.prisma.event.count({
        where: {
          creatorId: dbUser.id,
          createdAt: {
            gte: effectiveStart,
          },
        },
      });

      if (eventsThisCycle < 2) return true;

      throw new ForbiddenException('Free plan allows 2 events per 30 days');
    }

    throw new ForbiddenException('Access denied by plan');
  }
}
