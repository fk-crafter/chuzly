import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';
import { PushSubscription } from 'web-push';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  subscribe(@Body() subscription: PushSubscription) {
    console.log('📥 Abonnement reçu :', subscription);
    return { success: true };
  }

  @Post('send')
  async sendNotification(
    @Body() body: { subscription: PushSubscription; payload: any },
  ) {
    await this.pushService.sendNotification(body.subscription, body.payload);
    return { success: true };
  }
}
