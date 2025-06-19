import {
  Controller,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../auth/types/request-user';
import { PrismaService } from '../prisma/prisma.service';

@Controller('stripe')
@UseGuards(AuthGuard('jwt'))
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private prisma: PrismaService,
  ) {}

  @Post('checkout-session')
  async createCheckout(@Req() req: RequestWithUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user || !user.email) {
      throw new BadRequestException('User or email not found');
    }

    const url = await this.stripeService.createCheckoutSession(
      user.id,
      user.email,
    );

    return { url };
  }

  @Post('portal-session')
  async createPortal(@Req() req: RequestWithUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user?.stripeCustomerId) {
      throw new BadRequestException('No Stripe customer ID found');
    }

    const url = await this.stripeService.createPortalSession(
      user.stripeCustomerId,
    );

    return { url };
  }
}
