import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import Stripe from 'stripe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/request-user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

@Controller('billing')
export class BillingController {
  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req: RequestWithUser) {
    const { userId, email } = req.user;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId,
      },
      success_url: `${process.env.FRONT_URL}/success`,
      cancel_url: `${process.env.FRONT_URL}/subscription`,
    });

    return { url: session.url };
  }
}
