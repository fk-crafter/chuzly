import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://chuzly.app'],
    credentials: true,
  });

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(bodyParser.json());

  await app.listen(process.env.PORT ?? 5001);
}
void bootstrap();
