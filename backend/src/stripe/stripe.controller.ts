import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import Stripe from 'stripe';
import { StripeService } from './stripe.service';
import { PrismaService } from '../prisma/prisma.service';
import { RequestWithUser } from '../auth/types/request-user';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('checkout-session')
  async createCheckout(@Req() req: RequestWithUser) {
    console.log('🔥 Reçu POST /stripe/checkout-session');

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

  @UseGuards(AuthGuard('jwt'))
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

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripe = this.stripeService.getRawStripeInstance();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', msg);
      return res.status(400).send(`Webhook Error: ${msg}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;
      const userId = session.metadata?.userId;

      if (!userId) {
        console.warn('No userId in metadata');
        return res.status(400).send('No userId in metadata');
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId,
          stripeSubId: subscriptionId,
          plan: 'PRO',
        },
      });

      console.log(`User ${userId} successfully upgraded to PRO`);
    }

    return res.json({ received: true });
  }
}
