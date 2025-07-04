import { Body, Controller, Post } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post('send-thank-you')
  async sendThankYou(@Body('email') email: string) {
    if (!email) {
      return { success: false, message: 'Email is required' };
    }

    await this.waitlistService.sendThankYouEmail(email);
    return { success: true };
  }
}
