import { Controller, Get, Query } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';

@Controller('auth')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    const result = await this.emailVerificationService.verifyToken(token);

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      message: result.message || 'Invalid or expired token',
    };
  }
}
