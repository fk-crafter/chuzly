import { Injectable } from '@nestjs/common';
import webPush from 'web-push';
import { PushSubscription } from 'web-push';

@Injectable()
export class PushService {
  constructor() {
    const publicKey = process.env.VAPID_PUBLIC_KEY!;
    const privateKey = process.env.VAPID_PRIVATE_KEY!;

    webPush.setVapidDetails(
      'mailto:contact@tondomaine.com',
      publicKey,
      privateKey,
    );
  }

  async sendNotification(
    subscription: PushSubscription,
    payload: Record<string, any>,
  ): Promise<void> {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  }
}
