import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { isAfter } from 'date-fns';

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

    if (!dbUser) {
      throw new ForbiddenException('User not found');
    }

    if (dbUser.plan === 'PRO') return true;

    const now = new Date();
    const trialEnds = dbUser.trialEndsAt
      ? new Date(dbUser.trialEndsAt as string | number | Date)
      : null;

    if (dbUser.plan === 'TRIAL') {
      if (trialEnds && isAfter(trialEnds, now)) {
        return true;
      }

      await this.prisma.user.update({
        where: { id: dbUser.id },
        data: { plan: 'FREE' },
      });
    }

    if (dbUser.plan === 'FREE') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const eventsThisMonth = await this.prisma.event.count({
        where: {
          creatorId: dbUser.id,
          createdAt: {
            gte: startOfMonth,
          },
        },
      });

      if (eventsThisMonth < 2) return true;

      throw new ForbiddenException('Free plan allows 2 events per month');
    }

    throw new ForbiddenException('Access denied by plan');
  }
}
