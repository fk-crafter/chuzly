import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
  });

  async createCheckoutSession(userId: string, userEmail: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      success_url: `${process.env.FRONT_URL}/app/setting/subscription?success=1`,
      cancel_url: `${process.env.FRONT_URL}/app/setting/subscription?canceled=1`,
    });

    return session.url;
  }

  async createPortalSession(customerId: string) {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONT_URL}/app/setting/subscription`,
    });

    return session.url;
  }

  getRawStripeInstance() {
    return this.stripe;
  }
}
