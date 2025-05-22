import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [PrismaModule, EventModule],
})
export class AppModule {}
