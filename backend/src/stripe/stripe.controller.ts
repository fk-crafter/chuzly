import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  UseGuards,
  BadRequestException,
  Patch,
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
          cancelAt: null,
        },
      });

      console.log(`✅ User ${userId} successfully upgraded to PRO`);
    } else if (
      event.type === 'customer.subscription.deleted' ||
      (event.type === 'customer.subscription.updated' &&
        event.data.object.status === 'canceled')
    ) {
      const sub = event.data.object;
      const customerId = sub.customer as string;

      const user = await this.prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });

      if (!user) {
        console.warn('Stripe customer not linked to any user');
        return res.json({ received: true });
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'FREE',
          stripeSubId: null,
          cancelAt: null,
        },
      });

      console.log(`✅ User ${user.id} downgraded to FREE (subscription ended)`);
    }

    return res.json({ received: true });
  }

  @Patch('cancel-subscription')
  @UseGuards(AuthGuard('jwt'))
  async cancelSubscription(@Req() req: RequestWithUser) {
    const userId = req.user.userId;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.stripeSubId) {
      throw new BadRequestException('No active subscription found');
    }

    const stripe = this.stripeService.getRawStripeInstance();
    const subscription = await stripe.subscriptions.update(user.stripeSubId, {
      cancel_at_period_end: true,
    });

    const cancelDate = new Date((subscription.cancel_at as number) * 1000);

    await this.prisma.user.update({
      where: { id: userId },
      data: { cancelAt: cancelDate },
    });

    return { cancelAt: cancelDate };
  }

  @Patch('undo-cancel')
  @UseGuards(AuthGuard('jwt'))
  async undoCancel(@Req() req: RequestWithUser) {
    const userId = req.user.userId;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.stripeSubId) {
      throw new BadRequestException('No active subscription found');
    }

    const stripe = this.stripeService.getRawStripeInstance();

    await stripe.subscriptions.update(user.stripeSubId, {
      cancel_at_period_end: false,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { cancelAt: null },
    });

    return { cancelAt: null };
  }
}
